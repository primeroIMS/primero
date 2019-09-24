module Api::V2
  class UsersTransitionsController < ApplicationApiController

    before_action :record_model, only: [:assign_to, :transfer_to, :refer_to]

    def assign_to
      authorize!(:assign, @record_model)
      @users = User.users_for_assign(current_user, @record_model)
      render 'api/v2/users/users_for_transition'
    end

    def transfer_to
      authorize!(:transfer, @record_model)
      @users = User.users_for_transfer(current_user, @record_model, user_filters)
      render 'api/v2/users/users_for_transition'
    end

    def refer_to
      authorize!(:referral, @record_model)
      @users = User.users_for_referral(current_user, @record_model, user_filters)
      render 'api/v2/users/users_for_transition'
    end

    private

    def record_model
      @record_model = Record.model_from_name(params[:record_type])
    end

    def user_filters
      @user_filters ||= params.permit(:agency, :location, :services)
    end

  end
end