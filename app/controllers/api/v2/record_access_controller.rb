# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API READ endpoint for Record Access
class Api::V2::RecordAccessController < Api::V2::RecordResourceController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::SupplementData

  def index
    authorize_access!(:access_log)

    @audit_logs = @record.access_log_filtered(**access_log_filters)
    @total = @audit_logs.size
    @audit_logs.paginate(pagination)
  end

  def access_log_params
    params.permit(filters: [:from, :to, { actions: [] }])
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
end
