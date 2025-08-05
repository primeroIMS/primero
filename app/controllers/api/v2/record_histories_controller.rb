# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API READ endpoint for Record Histories
class Api::V2::RecordHistoriesController < Api::V2::RecordResourceController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::SupplementData

  def index
    authorize_access!(:change_log)

    filter_record_histories = @record.filter_histories(**record_histories_filters)
    @total = filter_record_histories.size
    @record_histories = filter_record_histories.paginate(pagination)
  end

  def record_histories_params
    params.permit(filters: { field_names: {}, form_unique_ids: {} })
  end

  def record_histories_filters
    {
      field_names: record_histories_params.dig(:filters, :field_names)&.values,
      form_unique_ids: record_histories_params.dig(:filters, :form_unique_ids)&.values
    }
  end
end
