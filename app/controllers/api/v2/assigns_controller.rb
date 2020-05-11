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
      updates_for_record(@record)
      render 'api/v2/transitions/create'
    end

    def create_bulk
      authorize_all!(:assign, @records)
      @transitions = @records.map { |record| assign(record) }
      updates_for_records(@records)
      render 'api/v2/transitions/create_bulk'
    end

    private

    def assign(record)
      transitioned_to = params[:data][:transitioned_to]
      notes = params[:data][:notes]
      transitioned_by = current_user.user_name
      Assign.create!(record: record, transitioned_to: transitioned_to,
                     transitioned_by: transitioned_by, notes: notes)
    end

    def create_action_message
      'assign'
    end

    def destroy_action_message
      'unassign'
    end

    def create_bulk_record_resource
      'bulk_assign'
    end
  end
end
