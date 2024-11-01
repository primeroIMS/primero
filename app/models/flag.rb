# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents actions to flag a record
class Flag < ApplicationRecord
  EVENT_FLAG = 'flag'
  EVENT_UNFLAG = 'unflag'

  belongs_to :record, polymorphic: true

  # The CAST is necessary because ActiveRecord assumes the id is an int.  It isn't.
  # TODO: Rewrite these queries when we start using record_uuid
  scope :join_record, lambda { |record_type|
    joins(
      ActiveRecord::Base.sanitize_sql(
        "INNER JOIN #{ActiveRecord::Base.connection.quote_column_name(record_type)} ON \
        CAST (#{ActiveRecord::Base.connection.quote_column_name(record_type)}.id as varchar) = \
        CAST (flags.record_id as varchar)"
      )
    )
  }

  scope :by_record_associated_user, lambda { |params|
    owner_json = params[:owner].to_json
    join_record(params[:type]).where(
      "data %s '$[*] %s (@.assigned_user_names == %s || @.owned_by == %s)'", '@?', '?', owner_json, owner_json
    )
  }

  scope :by_record_associated_groups, lambda { |params|
    groups = params[:group].map do |group|
      ActiveRecord::Base.sanitize_sql_for_conditions(['@ == %s', group.to_json])
    end.join('||')

    join_record(params[:type]).where("data %s '$.associated_user_groups %s (%s)'", '@?', '?', groups)
  }

  scope :by_record_agency, lambda { |params|
    join_record(params[:type]).where("data %s '$.owned_by_agency_id %s (@ == %s)'", '@?', '?', params[:agency].to_json)
  }

  validates :message, presence: { message: 'errors.models.flags.message' }
  validates :date, presence: { message: 'errors.models.flags.date' }

  after_create :flag_history
  after_update :unflag_history

  class << self
    def by_owner(query_scope, active_only, record_types, flagged_by)
      record_types ||= %w[cases incidents tracing_requests]
      owner_params = find_scope_to_use(query_scope)
      return [] if owner_params.blank?

      find_by_owner(owner_params[:scope_to_use], active_only, record_types, flagged_by, owner_params[:params])
    end

    private

    def find_scope_to_use(query_scope)
      if query_scope[:user]['user'].present?
        return { scope_to_use: 'by_record_associated_user', params: { owner: query_scope[:user]['user'] } }
      end
      if query_scope[:user]['group'].present?
        return { scope_to_use: 'by_record_associated_groups', params: { group: query_scope[:user]['group'] } }
      end
      if query_scope[:user]['agency'].present?
        return { scope_to_use: 'by_record_agency', params: { agency: query_scope[:user]['agency'] } }
      end

      {}
    end

    def find_by_owner(scope_to_use, active_only, record_types, flagged_by, params = {})
      record_types = %w[cases incidents tracing_requests] if record_types.blank?
      flags = []
      record_types.each do |record_type|
        params[:type] = record_type
        f = send(scope_to_use, params).includes(:record).where(where_params(flagged_by, active_only)).order(date: :desc)
        flags << f
      end
      flags.flatten
    end

    def where_params(flagged_by, active_only)
      where_params = {}
      where_params[:flagged_by] = flagged_by if flagged_by.present?
      where_params[:removed] = false if active_only
      where_params
    end
  end

  def flag_history
    update_flag_history(EVENT_FLAG, flagged_by)
  end

  def unflag_history
    return unless saved_change_to_attribute('removed')&.[](1)

    saved_changes.transform_values { |v| v[1] }
    update_flag_history(EVENT_UNFLAG, unflagged_by)
  end

  private

  def update_flag_history(event, user_name)
    RecordHistory.create(
      record_id:,
      record_type:,
      user_name:,
      datetime: DateTime.now,
      action: event,
      record_changes: { flags: { from: nil, to: self } }
    )
  end
end
