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
      authorize! :read, @role
    end

    def create
      authorize! :create, Role
      @role = Role.new_with_properties(role_params)
      @role.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :update, @role
      @role.update_properties(role_params)
      @role.save!
    end

    def destroy
      authorize! :destroy, @role
      @role.destroy!
    end

    def role_params
      params.require(:data).permit(:id, :unique_id, :name, :description,
                                   :group_permission, :referral, :transfer, :is_manager,
                                   'permissions' => {}, 'form_section_unique_ids' => [])
    end

    def per
      @per ||= (params[:per].try(:to_i) || 100)
    end

    protected

    def load_role
      @role = Role.find(record_id)
    end
  end
end
