# frozen_string_literal: true

# User Group CRUD API
class Api::V2::UserGroupsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  before_action :load_user_group, only: %i[show update destroy]

  def index
    authorize! :index, UserGroup
    @user_groups = UserGroup.all
    @total = @user_groups.size
    @user_groups = @user_groups.paginate(pagination)
  end

  def show
    authorize! :read, @user_group
  end

  def create
    authorize! :create, UserGroup
    @user_group = UserGroup.new_with_properties(user_group_params, current_user)
    @user_group.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize! :update, @user_group
    @user_group.assign_attributes(user_group_params)
    @user_group.save!
  end

  def destroy
    authorize! :destroy, @user_group
    @user_group.destroy!
  end

  def user_group_params
    params.require(:data).permit(:id, :unique_id, :name, :description, :disabled)
  end

  protected

  def load_user_group
    @user_group = UserGroup.find(record_id)
  end
end
