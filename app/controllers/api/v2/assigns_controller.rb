module Api::V2
  class AssignsController < RecordResourceController

    def index
      authorize! :read, @record
      @transitions = @record.assigns
      render 'api/v2/transitions/index'
    end

    def create
      authorize! :assign, @record
      @transition = assign(@record)
      render 'api/v2/transitions/create'
    end

    def create_bulk
      authorize_all!(:assign, @records)
      @transitions = @records.map { |record| assign(record) }
      render 'api/v2/transitions/create_bulk'
    end

    private

    def assign(record)
      to_user_name = params[:data][:to_user_name]
      notes = params[:data][:notes]
      transitioned_by = current_user.user_name
      Assign.create!(record: record, to_user_name: to_user_name,
                     transitioned_by: transitioned_by, notes: notes)
    end

  end
end

