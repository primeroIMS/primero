module Api::V2
  class RolesController < ApplicationApiController

    def index
      authorize! :idex, Role
      @roles = Role.all
    end

    def show
      authorize! :show, Role
      @role = Role.find(record_id)
    end

    def create
      authorize! :create, Role
      @role = Role.new(role_params.except(:permissions))
      @role.permissions = role_params[:permissions].map{|pr| Permission.new(pr)} if role_params[:permissions].present?
      @role.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :update, Role
      @role = Role.find(record_id)
      @role.update_properties(role_params)
      @role.save!
      render 'show'
    end

    def destroy
      authorize! :destroy, Role
      @role = Role.find(record_id)
      @role.destroy!
    end

    def role_params
      params.require(:data).permit(:id, :unique_id, :name, :description,
                                   :group_permission, :referral, :transfer,
                                   :is_manager, Role.permitted_api_params)
    end

  end
end