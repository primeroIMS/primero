module Api::V2
  class RecordResourceController < ApplicationApiController
    before_action :find_record, only: [:index, :create, :update]

    protected

    def record_id
      @record_id ||= request.path.split('/')[4]
    end

    def find_record
      @record = model_class.find(record_id)
    end
  end
end