# frozen_string_literal: true

class Flag < ApplicationRecord
  include Indexable

  EVENT_FLAG = 'flag'
  EVENT_UNFLAG = 'unflag'

  belongs_to :record, polymorphic: true

  # The CAST is necessary because ActiveRecord assumes the id is an int.  It isn't.
  scope :by_record_associated_user, -> (params) {
    Flag.joins("INNER JOIN #{params[:type]} ON CAST (#{params[:type]}.id as varchar) = CAST (flags.record_id as varchar)")
        .where("(data -> 'assigned_user_names' ? :username) OR (data -> 'owned_by' ? :username)", username: params[:owner])
        .select("flags.id, flags.record_type, flags.record_id, flags.date, flags.message, flags.flagged_by, #{params[:type]}.data -> 'short_id' as r_short_id, #{params[:type]}.data -> 'name' as r_name, #{params[:type]}.data -> 'owned_by' as r_owned_by")
  }

  # TODO: this is working as long as params[:group] only has 1 user_group
  scope :by_record_associated_groups, -> (params) {
    Flag.joins("INNER JOIN #{params[:type]} ON CAST (#{params[:type]}.id as varchar) = CAST (flags.record_id as varchar)")
        .where("(data -> 'associated_user_groups' ?& array[:group])", group: params[:group])
        .select("flags.id, flags.record_type, flags.record_id, flags.date, flags.message, flags.flagged_by, #{params[:type]}.data -> 'short_id' as r_short_id, #{params[:type]}.data -> 'name' as r_name, #{params[:type]}.data -> 'owned_by' as r_owned_by")
  }


  validates :message, presence: { message: 'errors.models.flags.message' }
  validates :date, presence: { message: 'errors.models.flags.date' }

  after_create :flag_history
  after_update :unflag_history
  after_save :index_record

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

  class << self
    def by_owner(query_scope, record_types)
      record_types ||= %w[cases incidents tracing_requests]
      params = {}
      scope_to_use = nil
      if query_scope[:user]['user'].present?
        params[:owner] = query_scope[:user]['user']
        scope_to_use = 'by_record_associated_user'
      elsif query_scope[:user]['group'].present?
        params[:group] = query_scope[:user]['group']
        scope_to_use = 'by_record_associated_groups'
      end
      flags = []
      record_types.each do |record_type|
        params[:type] = record_type
        flags << self.send(scope_to_use, params)
      end
      flags.flatten
    end
  end

  def flag_history
    update_flag_history(EVENT_FLAG, flagged_by)
  end

  def unflag_history
    return unless saved_change_to_attribute('removed')[1]

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
