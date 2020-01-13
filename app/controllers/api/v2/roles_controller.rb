module Api::V2
  class RolesController < ApplicationApiController
    include Concerns::Pagination
    before_action :load_role, only: [:show, :update, :destroy]

    def index
      authorize! :index, Role
      @total = Role.all.size
      @roles = Role.paginate(pagination)
    end

    def show
      authorize! :show, Role
    end

    def create
      authorize! :create, Role
      @role = Role.new(role_params.except(:permissions))
      @role.permissions = Role.permissions_attributes(role_params[:permissions])
      @role.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :update, Role
      @role.update_attributes(role_params)
      @role.save!
    end

    def destroy
      authorize! :destroy, Role
      @role.destroy!
    end

    def role_params
      params.require(:data).permit(:id, :unique_id, :name, :description,
                                   :group_permission, :referral, :transfer,
                                   :is_manager, Role.permitted_api_params)
    end

    protected

    def load_role
      @role = Role.find(record_id)
    end

  end
end