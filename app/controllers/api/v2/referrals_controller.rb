# frozen_string_literal: true

# API for creating referrals for record types
class Api::V2::ReferralsController < Api::V2::RecordResourceController
  def index
    authorize! :read, @record
    @transitions = @record.referrals_for_user(current_user)
    render 'api/v2/transitions/index'
  end

  def create
    authorize_create!(@record)
    @transition = refer(@record)
    updates_for_record(@record)
    render 'api/v2/transitions/create'
  end

  def update
    authorize! :update, @record
    @transition = Referral.find(params[:id])
    @transition.process!(update_params)
    updates_for_record(@transition.record)
    render 'api/v2/transitions/update'
  end

  def create_bulk
    authorize_all!(:referral, @records)
    @transitions = @records.map { |record| refer(record) }
    updates_for_records(@records)
    render 'api/v2/transitions/create_bulk'
  end

  def destroy
    authorize! :update, @record
    @transition = Referral.find(params[:id])
    @transition.revoke!
    updates_for_record(@transition.record)
    render 'api/v2/transitions/destroy'
  end

  def index_action_message
    'show_referrals'
  end

  def create_action_message
    'refer'
  end

  def update_action_message
    "refer_#{params[:data][:status]}"
  end

  def destroy_action_message
    'refer_revoke'
  end

  private

  def refer(record)
    permitted = params.require(:data).permit(
      :transitioned_to, :transitioned_to_remote, :transitioned_to_agency,
      :service, :service_record_id, :remote, :type_of_export, :notes,
      :consent_overridden
    )
    referral = Referral.new(permitted)
    referral.transitioned_by = current_user.user_name
    referral.record = record
    referral.save! && referral
  end

  def authorize_create!(record)
    authorize! :referral, record
  rescue CanCan::AccessDenied => e
    raise e unless params[:data][:service_record_id]

    authorize! :referral_from_service, record
  end

  def update_params
    @update_params ||= params.require(:data).permit(:status, :rejected_reason, :rejection_note)
  end
end
