module Api::V2
  class ReferralsController < RecordResourceController

    def index
      authorize! :read, @record
      @transitions = @record.referrals_for_user(current_user)
      render 'api/v2/transitions/index'
    end

    def create
      authorize! :referral, @record
      @transition = refer(@record)
      updates_for_record
      render 'api/v2/transitions/create'
    end

    def create_bulk
      authorize_all!(:referral, @records)
      @transitions = @records.map { |record| refer(record) }
      updates_for_records
      render 'api/v2/transitions/create_bulk'
    end

    def destroy
      authorize! :update, @record
      @transition = Referral.find(params[:id])
      @transition.reject!
      updates_for_record
      render 'api/v2/transitions/destroy'
    end

    private

    def refer(record)
      permitted = params.require(:data).permit(
        :to_user_name, :to_user_remote, :to_user_agency,
        :service, :service_record_id, :remote, :type_of_export, :notes,
        :consent_overridden
      )
      referral = Referral.new(permitted)
      referral.transitioned_by = current_user.user_name
      referral.record = record
      referral.save! && referral
    end

  end
end