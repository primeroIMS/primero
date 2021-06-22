# frozen_string_literal: true

# Roles CRUD API
class Api::V2::RolesController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::JsonValidateParams

  before_action :load_role, only: %i[show update destroy]

  def index
    @roles = Role.list(current_user, params)
    @total = @roles.size
    @roles = @roles.paginate(pagination) if pagination?
  end

  def show
    authorize! :read, @role
  end

  def create
    authorize!(:create, Role) && validate_json!(Role::ROLE_FIELDS_SCHEMA, role_params)
    @role = Role.new_with_properties(role_params)
    @role.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize!(:update, @role) && validate_json!(Role::ROLE_FIELDS_SCHEMA, role_params)
    @role.update_properties(role_params)
    @role.save!
  end

  def destroy
    authorize! :destroy, @role
    @role.destroy!
  end

  def role_params
    @role_params ||= params.require(:data).permit(
      :id, :unique_id, :name, :description, :disabled,
      :group_permission, :referral, :transfer, :is_manager, :reporting_location_level,
      permissions: {}, form_section_read_write: {}, module_unique_ids: []
    )
  end

  def per
    @per ||= (params[:per]&.to_i || 100)
  end

  protected

  def load_role
    @role = Role.find(record_id)
  end
end
