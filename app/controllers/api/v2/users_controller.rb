# frozen_string_literal: true

# Users CRUD API
class Api::V2::UsersController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  before_action :load_user, only: %i[show update destroy]
  before_action :user_params, only: %i[create update]
  before_action :load_extended, only: %i[index show]
  after_action :welcome, only: %i[create]
  after_action :identity_sync, only: %i[create update]

  def index
    authorize! :index, User
    filters = params.permit(:agency, :location, :services, :user_group_ids, disabled: {}).to_h
    results = PermittedUsersService.new(current_user).find_permitted_users(
      filters.compact, pagination, sort_params
    )
    @users = results[:users]
    @total = results[:total]
  end

  def show
    authorize! :show_user, @user
  end

  def create
    authorize! :create, User
    @user = User.new(@user_params)
    @user.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize! :disable, @user if @user_params.include?('disabled')
    authorize! :edit_user, @user
    @user.update_with_properties(@user_params)
    @user.save!
  end

  def destroy
    authorize! :enable_disable_record, User
    @user.destroy!
  end

  protected

  def sort_params
    { params[:order_by] => params[:order] } if params[:order_by].present? && params[:order].present?
  end

  def user_params
    @user_params = params.require(:data).permit(User.permitted_api_params(current_user, @user))
  end

  def load_user
    @user = User.includes(:role).joins(:role).find(params[:id])
  end

  def load_extended
    @extended = params[:extended].present? && params[:extended] == 'true'
  end

  def welcome
    @user.send_welcome_email(current_user)
  end

  def identity_sync
    @user.identity_sync(current_user)
  end
end
