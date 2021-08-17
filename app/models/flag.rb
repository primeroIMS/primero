# frozen_string_literal: true

# Represents actions to flag a record
class Flag < ApplicationRecord
  include Indexable

  EVENT_FLAG = 'flag'
  EVENT_UNFLAG = 'unflag'

  belongs_to :record, polymorphic: true

  # The CAST is necessary because ActiveRecord assumes the id is an int.  It isn't.
  # TODO: Rewrite these queries when we start using record_uuid
  scope :by_record_associated_user, lambda { |params|
    Flag.joins(
      "INNER JOIN #{params[:type]} ON CAST (#{params[:type]}.id as varchar) = CAST (flags.record_id as varchar)"
    ).where(
      "(data -> 'assigned_user_names' ? :username) OR (data -> 'owned_by' ? :username)", username: params[:owner]
    )
  }

  scope :by_record_associated_groups, lambda { |params|
    Flag.joins(
      "INNER JOIN #{params[:type]} ON CAST (#{params[:type]}.id as varchar) = CAST (flags.record_id as varchar)"
    ).where("(data -> 'associated_user_groups' ?| array[:group])", group: params[:group])
  }

  scope :by_record_agency, lambda { |params|
    Flag.joins(
      "INNER JOIN #{params[:type]} ON CAST (#{params[:type]}.id as varchar) = CAST (flags.record_id as varchar)"
    ).where("(data -> 'owned_by_agency_id' ? :agency)", agency: params[:agency])
  }

  validates :message, presence: { message: 'errors.models.flags.message' }
  validates :date, presence: { message: 'errors.models.flags.date' }

  after_create :flag_history
  after_update :unflag_history
  after_save :index_record

  # rubocop:disable Metrics/BlockLength
  searchable do
    date :flag_date, stored: true do
      date.present? ? date : nil
    end
    time :flag_created_at, stored: true do
      created_at.present? ? created_at : nil
    end
    string :flag_message, stored: true do
      message
    end
    string :flag_unflag_message, stored: true do
      unflag_message
    end
    string :flag_flagged_by, stored: true do
      flagged_by
    end
    string :flag_flagged_by_module, stored: true do
      record.module_id
    end
    boolean :flag_is_removed, stored: true do
      removed ? true : false
    end
    boolean :flag_system_generated_followup, stored: true do
      system_generated_followup
    end
    string :flag_record_id, stored: true do
      record_id
    end
    string :flag_record_type, stored: true do
      record_type.underscore.downcase
    end
    string :flag_record_short_id, stored: true do
      record.short_id
    end
    string :flag_child_name, stored: true do
      record.try(:name)
    end
    string :flag_hidden_name, stored: true do
      record.try(:hidden_name)
    end
    string :flag_module_id, stored: true do
      record.module_id
    end
    string :flag_incident_date_of_first_report, stored: true do
      record.try(:date_of_first_report)
    end
    string :flag_record_owner, stored: true do
      record.owned_by
    end
    string :flag_groups_owner, stored: true, multiple: true do
      record.owned_by_groups
    end
    string :flag_associated_groups, stored: true, multiple: true do
      record.associated_user_groups
    end
    string :flag_agency_id_owner, stored: true, multiple: true do
      record.owned_by_agency_id
    end
    string :flag_associated_agencies, stored: true, multiple: true do
      record.associated_user_agencies
    end
  end
  # rubocop:enable Metrics/BlockLength

  class << self
    def by_owner(query_scope, active_only, record_types, flagged_by)
      record_types ||= %w[cases incidents tracing_requests]
      owner = query_scope[:user]['user']
      return find_by_owner('by_record_associated_user', active_only, record_types, flagged_by, owner: owner) if owner.present?

      group = query_scope[:user]['group']
      return  find_by_owner('by_record_associated_groups', active_only, record_types, flagged_by, group: group) if group.present?

      agency = query_scope[:user]['agency']
      return find_by_owner('by_record_agency', active_only, record_types, flagged_by, agency: agency) if agency.present?

      []
    end

    private

    def find_by_owner(scope_to_use, active_only, record_types, flagged_by, params = {})
      record_types = %w[cases incidents tracing_requests] if record_types.blank?
      flags = []
      record_types.each do |record_type|
        params[:type] = record_type
        f = send(scope_to_use, params).where(where_params(flagged_by, active_only)).select(select_fields(record_type))
        flags << f
      end
      mask_flag_names(flags.flatten)
    end

    def mask_flag_names(flags)
      flags.each_with_object([]) do |flag, flag_list|
        flag.name = RecordDataService.visible_name(flag)
        flag_list << flag
      end
    end

    def where_params(flagged_by, active_only)
      where_params = {}
      where_params[:flagged_by] = flagged_by if flagged_by.present?
      where_params[:removed] = false if active_only
      where_params
    end

    def select_fields(record_type)
      (Flag.column_names.map { |column| "flags.#{column}" } +
         record_fields_for_select.map { |field| "#{record_type}.data -> '#{field}' as #{field}" }).join(', ')
    end

    def record_fields_for_select
      %w[short_id name hidden_name owned_by owned_by_agency_id]
    end
  end

  def flag_history
    update_flag_history(EVENT_FLAG, flagged_by)
  end

  def unflag_history
    return unless saved_change_to_attribute('removed')&.[](1)

    saved_changes.map { |k, v| [k, v[1]] }.to_h
    update_flag_history(EVENT_UNFLAG, unflagged_by)
  end

  def index_record
    Sunspot.index!(record) if record
  end

  private

  def update_flag_history(event, user_name)
    RecordHistory.create(
      record_id: record_id,
      record_type: record_type,
      user_name: user_name,
      datetime: DateTime.now,
      action: event,
      record_changes: { flags: { from: nil, to: self } }
    )
  end
end
