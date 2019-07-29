module Api::V2
  class UsersController < ApplicationApiController
    include Concerns::Pagination

    before_action :user_params, only: [:create, :update]
    before_action :load_user, only: [:show, :update, :destroy]
    before_action :load_options, only: [:index, :show]

    def index
      authorize! :index, User
      @extended = params[:extended].present? && params[:extended] == 'true'
      filters = params.permit(:agency, :location, :services, :disabled).to_h
      results = User.find_permitted_users(
        filters.compact, pagination, { user_name: :asc}, current_user)
      @users = results[:users]
      @total = results[:total]
    end

    def show
      authorize! :read, User
      @extended = params[:extended]
    end

    def create
      authorize! :create, User
      @user = User.new(@user_params)
      @user.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :disable, @user
      authorize! :update, @user
      @user.update_attributes(@user_params)
    end

    def destroy
      authorize! :enable_disable_record, User
      @user.destroy!
    end

    protected

    def user_params
      @user_params = params.require(:data).permit(User.attribute_names)
    end

    def load_user
      @user = User.find(params[:id])
    end

    def load_options
      @system = SystemSettings.current
      @lookups = Lookup.all
      @locations = Location.all_names
    end

  end
end
