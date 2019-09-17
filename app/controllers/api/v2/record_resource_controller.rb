module Api::V2
  class RecordResourceController < ApplicationApiController
    before_action :find_record, only: [:index, :create, :update, :destroy]
    before_action :find_records, only: [:create_bulk]

    protected

    def create_bulk
      raise NotImplementedError
    end

    def record_id
      @record_id ||= request.path.split('/')[4]
    end

    def find_record
      @record = model_class.find(record_id)
    end

    def find_records
      @records = if params['data']['ids'].present?
                   model_class.find(params['data']['ids'])
                 else
                   []
                 end
    end
  end
end