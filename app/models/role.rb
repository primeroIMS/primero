# frozen_string_literal: true

# The model for Role
class Role < ApplicationRecord
  include ConfigurationRecord

  has_and_belongs_to_many :form_sections, -> { distinct }
  has_and_belongs_to_many :primero_modules, -> { distinct }

  has_many :users

  alias_attribute :modules, :primero_modules

  serialize :permissions, Permission::PermissionSerializer

  validates :permissions, presence: { message: 'errors.models.role.permission_presence' }
  validates :name, presence: { message: 'errors.models.role.name_present' },
                   uniqueness: { message: 'errors.models.role.unique_name' }
  validate :validate_reporting_location_level

  before_create :generate_unique_id
  before_save :reject_form_by_module

  scope :by_referral, -> { where(referral: true) }
  scope :by_transfer, -> { where(transfer: true) }

  def permitted_form_id?(form_unique_id_id)
    form_sections.map(&:unique_id).include?(form_unique_id_id)
  end

  class << self
    # TODO: Redundant after create_or_update!
    def create_or_update(attributes = {})
      record = find_by(unique_id: attributes[:unique_id])
      if record.present?
        record.update_attributes(attributes)
      else
        create!(attributes)
      end
    end

    def new_with_properties(role_params)
      role = Role.new(role_params.except(:permissions, :form_section_unique_ids, :module_unique_ids))
      if role_params[:form_section_unique_ids].present?
        role.form_sections = FormSection.where(unique_id: role_params[:form_section_unique_ids])
      end
      if role_params[:module_unique_ids].present?
        role.modules = PrimeroModule.where(unique_id: role_params[:module_unique_ids])
      end
      role.permissions = Permission::PermissionSerializer.load(role_params[:permissions].to_h)
      role
    end

    def list(user, external = false)
      if external
        Role.where(disabled: false).where(referral: true).or(Role.where(transfer: true))
      else
        user.permitted_roles_to_manage
      end
    end
  end

  def permitted_forms(record_type = nil, visible_only = false)
    form_sections.where({ parent_form: record_type, visible: (visible_only || nil) }.compact)
  end

  def permitted_roles
    return Role.none if permitted_role_unique_ids.blank?

    Role.where(unique_id: permitted_role_unique_ids)
  end

  def permitted_role_unique_ids
    role_permission = permissions.find { |permission| permission.resource == Permission::ROLE }
    return [] unless role_permission&.role_unique_ids&.present?

    role_permission.role_unique_ids
  end

  def dashboards
    dashboard_permissions = permissions.find { |p| p.resource == Permission::DASHBOARD }
    dashboards = dashboard_permissions&.actions&.map do |action|
      next Dashboard.dash_reporting_location(self) if action == 'dash_reporting_location'

      next Dashboard.send(action) if Dashboard::DYNAMIC.include?(action)

      begin
        "Dashboard::#{action.upcase}".constantize
      rescue NameError
        nil
      end
    end || []
    dashboards.compact
  end

  def reporting_location_config
    @system_settings ||= SystemSettings.current
    return nil if @system_settings.blank?

    ss_reporting_location = @system_settings&.reporting_location_config
    return nil if ss_reporting_location.blank?

    reporting_location_config = secondary_reporting_location(ss_reporting_location)
    reporting_location_config
  end

  # If the Role has a secondary reporting location (indicated by reporting_location_level),
  # override the reporting location from SystemSettings
  def secondary_reporting_location(ss_reporting_location)
    return ss_reporting_location if reporting_location_level.nil?

    return ss_reporting_location if reporting_location_level == ss_reporting_location.admin_level

    reporting_location = ReportingLocation.new(field_key: ss_reporting_location.field_key,
                                               admin_level: reporting_location_level,
                                               hierarchy_filter: ss_reporting_location.hierarchy_filter,
                                               admin_level_map: ss_reporting_location.admin_level_map)
    reporting_location
  end

  def super_user_role?
    superuser_resources = [
      Permission::CASE, Permission::INCIDENT, Permission::REPORT,
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    managed_resources?(superuser_resources)
  end

  def user_admin_role?
    admin_only_resources = [
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    managed_resources?(admin_only_resources)
  end

  def permitted_to_export?
    permissions&.map(&:actions)&.flatten&.compact&.any? { |p| p.start_with?('export') } ||
      permissions&.any? { |p| Permission.records.include?(p.resource) && p.actions.include?(Permission::MANAGE) }
  end

  def permissions_with_forms
    permissions.select { |p| p.resource.in?(Permission.records) }
  end

  def associate_all_forms
    forms_by_parent = FormSection.all_forms_grouped_by_parent
    role_module_ids = primero_modules.pluck(:unique_id)
    permissions_with_forms.map do |permission|
      form_sections << forms_by_parent[permission.resource].reject do |form|
        form_sections.include?(form) || reject_form?(form, role_module_ids)
      end
      save
    end
  end

  def reject_form?(form, role_module_ids)
    form_modules = form&.primero_modules&.pluck(:unique_id)
    return false unless form_modules.present?

    (role_module_ids & form_modules).blank?
  end

  def reject_form_by_module
    role_module_ids = primero_modules.map(&:unique_id)
    self.form_sections = form_sections.reject { |form| reject_form?(form, role_module_ids) }
  end

  def form_section_unique_ids
    form_sections.pluck(:unique_id)
  end

  def module_unique_ids
    modules.pluck(:unique_id)
  end

  def update_properties(role_properties)
    role_properties = role_properties.with_indifferent_access if role_properties.is_a?(Hash)
    assign_attributes(role_properties.except('permissions', 'form_section_unique_ids', 'module_unique_ids'))
    update_forms_sections(role_properties['form_section_unique_ids'])
    update_permissions(role_properties['permissions'])
    update_modules(role_properties['module_unique_ids'])
  end

  def configuration_hash
    hash = attributes.except('id', 'permissions')
    hash['permissions'] = Permission::PermissionSerializer.dump(permissions)
    hash['form_section_unique_ids'] = form_section_unique_ids
    hash['module_unique_ids'] = module_unique_ids
    hash.with_indifferent_access
  end

  private

  def validate_reporting_location_level
    @system_settings ||= SystemSettings.current
    return true if @system_settings.blank?

    reporting_location_levels = @system_settings&.reporting_location_config.try(:levels)
    return true if reporting_location_level.nil? ||
                   reporting_location_levels.blank? ||
                   reporting_location_levels.include?(reporting_location_level)

    errors.add(:reporting_location_level, 'errors.models.role.reporting_location_level')
    false
  end

  def update_forms_sections(form_section_unique_ids)
    return if form_section_unique_ids.nil?

    self.form_sections = FormSection.where(unique_id: form_section_unique_ids)
  end

  def update_permissions(permissions)
    return if permissions.nil?

    self.permissions = Permission::PermissionSerializer.load(permissions.to_h)
  end

  def update_modules(module_unique_ids)
    return if module_unique_ids.nil?

    self.modules = PrimeroModule.where(unique_id: module_unique_ids)
  end

  def managed_resources?(resources)
    current_managed_resources = permissions.select { |p| p.actions == [Permission::MANAGE] }.map(&:resource)
    (resources - current_managed_resources).empty?
  end
end
