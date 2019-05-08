module Api::V2::Concerns
  module Record
    extend ActiveSupport::Concern

    def index
      # search = model_class.list_records(filter, order, pagination, users_filter, params[:query], params[:match])
      @records = model_class.limit(per).offset(offset)
      @total = model_class.count
    end

    def show
    end


    private

    def pagination

    end

  end
end