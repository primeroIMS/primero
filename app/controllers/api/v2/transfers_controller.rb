module Api::V2
  class TransfersController < RecordResourceController

    def index
      authorize! :read, @record
      @transitions = @record.transfers
      render 'api/v2/transitions/index'
    end

    def create
      authorize! :transfer, @record
      @transition = transfer(@record)
      updates_for_record(@record)
      render 'api/v2/transitions/create'
    end

    def create_bulk
      authorize_all!(:transfer, @records)
      @transitions = @records.map { |record| transfer(record) }
      updates_for_records(@records)
      render 'api/v2/transitions/create_bulk'
    end

    def update
      authorize! :read, @record
      @transition = Transfer.find(params[:id])
      transition_status = params[:data][:status]
      if transition_status != @transition.status
        case transition_status
        when Transition::STATUS_ACCEPTED
          @transition.accept!
        when Transition::STATUS_REJECTED
          @transition.rejected_reason = params[:data][:rejected_reason]
          @transition.reject!
        end
      end
      updates_for_record(@transition.record)
      render 'api/v2/transitions/update'
    end

    def index_action_message
      'show_transfers'
    end

    def create_action_message
      'transfer'
    end

    def update_action_message
      "transfer_#{params[:data][:status]}"
    end

    def create_bulk_record_resource
      'bulk_transfer'
    end

    private

    def transfer(record)
      permitted = params.require(:data).permit(
        :transitioned_to, :transitioned_to_remote, :transitioned_to_agency,
        :remote, :type_of_export, :notes,
        :consent_overridden, :consent_individual_transfer
      )
      transfer = Transfer.new(permitted)
      transfer.transitioned_by = current_user.user_name
      transfer.record = record
      transfer.save! && transfer
    end

  end
end