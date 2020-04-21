# frozen_string_literal: true

module Api::V2
  # API READ endpoint for Record Histories
  class RecordHistoriesController < RecordResourceController
    include Api::V2::Concerns::Pagination

    def index
      authorize!(:read, @record)
      authorize!(:audit_log, @record)
      filter_record_histories = @record.ordered_histories
      @total = filter_record_histories.size
      @record_histories = filter_record_histories.paginate(pagination)
    end
  end
end
