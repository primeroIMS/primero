# frozen_string_literal: true

module Api::V2
  class UserGroupsController < ApplicationApiController
    include Concerns::Pagination
    before_action :load_user_group, only: %i[show update destroy]

    def index
      authorize! :index, UserGroup
      @total = UserGroup.all.size
      @user_groups = UserGroup.paginate(pagination)
    end

    def show
      authorize! :read, @user_group
    end

    def create
      authorize! :create, UserGroup
      @user_group = UserGroup.new(user_group_params)
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
      params.require(:data).permit(:id, :unique_id, :name, :description)
    end

    protected

    def load_user_group
      @user_group = UserGroup.find(record_id)
    end
  end
end
