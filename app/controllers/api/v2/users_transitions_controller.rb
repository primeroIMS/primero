# frozen_string_literal: true

# API to list allowsed users to receive assignements, transfers, referrals
class Api::V2::UsersTransitionsController < ApplicationApiController
  before_action :record_model, only: %i[assign_to transfer_to refer_to]
  before_action :record_module_unique_id, only: %i[assign_to transfer_to refer_to]

  def assign_to
    authorize_assign!(@record_model)
    @users = UserTransitionService.assign(current_user, @record_model, @record_module_unique_id).transition_users
    render 'api/v2/users/users_for_transition'
  end

  def transfer_to
    authorize!(:transfer, @record_model)
    @users = UserTransitionService.transfer(
      current_user,
      @record_model,
      @record_module_unique_id
    ).transition_users(user_filters)
    render 'api/v2/users/users_for_transition'
  end

  def refer_to
    authorize_refer_to!(@record_model)
    @users = UserTransitionService.referral(
      current_user,
      @record_model,
      @record_module_unique_id
    ).transition_users(user_filters)
    UserLocationService.inject_locations(@users)
    render 'api/v2/users/users_for_transition'
  end

  private

  def authorize_assign!(record)
    can_assign =
      current_user.can?(Permission::ASSIGN.to_sym, record) ||
        current_user.can?(Permission::ASSIGN_WITHIN_AGENCY.to_sym, record) ||
        current_user.can?(Permission::ASSIGN_WITHIN_USER_GROUP.to_sym, record)
    raise Errors::ForbiddenOperation unless can_assign
  end

  def record_model
    @record_model = Record.model_from_name(params[:record_type])
  end

  def record_module_unique_id
    @record_module_unique_id = params[:record_module_id]
  end

  def user_filters
    @user_filters ||= params.permit(:agency, :location, :service)
  end

  def authorize_refer_to!(record_model)
    authorize!(:referral, record_model)
  rescue CanCan::AccessDenied
    authorize!(:referral_from_service, record_model)
  end
end
