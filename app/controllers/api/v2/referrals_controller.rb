# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    authorize_update!(@record)
    @transition = Referral.find(params[:id])
    @transition.process!(current_user, update_params)
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
    authorize_update!(@record)
    @transition = Referral.find(params[:id])
    @transition.revoke!(current_user)
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
      :transitioned_to, :transitioned_to_remote, :transitioned_to_agency, :service, :service_record_id,
      :remote, :type_of_export, :notes, :consent_overridden, :authorized_role_unique_id,
      :allow_case_creation
    )
    referral = Referral.new(permitted)
    referral.transitioned_by = current_user.user_name
    referral.record = record
    record.update_last_updated_by(current_user)
    referral.save! && referral
  end

  def authorize_create!(record)
    authorize! :referral, record
  rescue CanCan::AccessDenied => e
    raise e unless params[:data][:service_record_id]

    authorize! :referral_from_service, record
  end

  def authorize_update!(record)
    authorize! :update, record
  rescue CanCan::AccessDenied
    authorize! :receive_referral, record
  end

  def update_params
    @update_params ||= params.require(:data).permit(:status, :rejected_reason, :rejection_note)
  end
end
