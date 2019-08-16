module Api::V2
  class FlagsController < ApplicationApiController
    before_action :set_class_name
    before_action { authorize! :flag, @model_class }
    before_action :find_record, only: [:index, :create, :update]

    def create
      @record.add_flag(params['data']['message'], params['data']['date'].to_date, current_user.user_name)
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end
    def update
      @record.remove_flag(params['id'], current_user.user_name, params['data']['unflag_message'])
    end

    def flags
      @model_class.batch_flag(params['data']['ids'], params['data']['message'], params['data']['date'].to_date, current_user.user_name)
    end

    private
    def set_class_name
      @model_class = if params['case_id'].present? || params['data']['record_type'] == 'case'
        Child 
      elsif params['tracing_request_id'].present? || params['data']['record_type'] == 'tracing_request'
        TracingRequest
      elsif params['incident_id'].present? || params['data']['record_type'] == 'incident'
        Incident
      end
    end

    def find_record
      record_id = params['case_id'].presence || params['tracing_request_id'].presence || params['incident_id'].presence
      @record = @model_class.find(record_id)
    end
  end
end