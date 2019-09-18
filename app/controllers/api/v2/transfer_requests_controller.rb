module Api::V2
  class TransferRequestsController < RecordResourceController

    def index
      authorize! :read, @record
      @transitions = @record.transfer_requests
      render 'api/v2/transitions/index'
    end

    def create
      authorize! :request_transfer, @record.class
      @transition = transfer_request(@record)
      render 'api/v2/transitions/create'
    end

    def update
      authorize! :read, @record
      @transition = TransferRequest.find(params[:id])
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
      render 'api/v2/transitions/update'
    end

    private

    def transfer_request(record)
      notes = params[:data][:notes]
      consent_individual_transfer = params[:data][:consent_individual_transfer] || false
      TransferRequest.create!(
        transitioned_by: current_user.user_name,
        consent_individual_transfer: consent_individual_transfer,
        to_user_name: record.owned_by,
        notes: notes, record: record
      )
    end

  end
end