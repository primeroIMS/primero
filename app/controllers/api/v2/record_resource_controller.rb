module Api::V2
  class RecordResourceController < ApplicationApiController
    before_action :set_class_name
    before_action :find_record, only: [:index, :create, :update]

    private
    def set_class_name
      @model_class = Record.model_from_name(request.path.split('/')[3].singularize)
    end

    def find_record
      record_id = params['case_id'].presence || params['tracing_request_id'].presence || params['incident_id'].presence
      @record = @model_class.find(record_id)
    end
  end
end