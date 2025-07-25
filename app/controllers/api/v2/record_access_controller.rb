# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# API READ endpoint for Record Access
class Api::V2::RecordAccessController < Api::V2::RecordResourceController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::SupplementData

  def index
    authorize_access!(:access_log)

    audit_logs_filtered = @record.access_log_filtered(**access_log_filters)
    @total = audit_logs_filtered.size
    @audit_logs = audit_logs_filtered.paginate(pagination)
  end

  def access_log_params
    params.permit(:per, :page, filters: { timestamp: %i[from to], actions: {} })
  end

  protected

  def access_log_filters
    filters = {
      date_range: timestamp_param,
      exclude_user_id: current_user.id
    }
    actions = access_log_params.dig(:filters, :actions)&.values.presence
    filters[:actions] = actions if actions.present?

    filters
  end

  def from_param
    if params.dig(:filters, :timestamp, :from).present?
      Time.zone.parse(params.dig(:filters, :timestamp, :from))
    else
      Time.at(0).to_datetime
    end
  end

  def to_param
    if params.dig(:filters, :timestamp, :to).present?
      Time.zone.parse(params.dig(:filters, :timestamp, :to))
    else
      DateTime.now.end_of_day
    end
  end
end
