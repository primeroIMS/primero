# frozen_string_literal: true

# The model for Role
# rubocop:disable Metrics/ClassLength
class Role < ApplicationRecord
  include ConfigurationRecord

  SUPER_ROLE_PERMISSIONS = {
    'case' => ['manage'],
    'role' => ['manage'],
    'user' => ['manage'],
    'agency' => ['manage'],
    'report' => ['manage'],
    'system' => ['manage'],
    'incident' => ['manage'],
    'metadata' => ['manage'],
    'user_group' => ['manage']
  }.freeze

  ADMIN_ROLE_PERMISSIONS = {
    'role' => ['manage'],
    'user' => ['manage'],
    'agency' => ['manage'],
    'system' => ['manage'],
    'metadata' => ['manage'],
    'user_group' => ['manage']
  }.freeze

  ROLE_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'unique_id' => { 'type' => 'string' },
    'name' => { 'type' => 'string' }, 'description' => { 'type' => 'string' },
    'group_permission' => { 'type' => 'string' }, 'referral' => { 'type' => 'boolean' },
    'is_manager' => { 'type' => 'boolean' }, 'transfer' => { 'type' => 'boolean' },
    'disabled' => { 'type' => 'boolean' }, 'module_unique_ids' => { 'type' => 'array' },
    'permissions' => { 'type' => 'object' }, 'form_section_read_write' => { 'type' => 'object' },
    'reporting_location_level' => { 'type' => 'integer' }
  }.freeze

  has_many :form_permissions
  has_many :form_sections, through: :form_permissions, dependent: :destroy
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
    def order_insensitive_attribute_names
      %w[name description]
    end

    # TODO: Redundant after create_or_update!
    def create_or_update(attributes = {})
      record = find_by(unique_id: attributes[:unique_id])
      if record.present?
        record.update(attributes)
      else
        create!(attributes)
      end
    end

    def new_with_properties(role_params)
      Role.new.tap do |role|
        role.update_properties(role_params)
      end
    end

    def list(user = nil, options = {})
      return list_external if options[:external]

      roles_list = options[:managed] ? list_managed(user) : all
      roles_list = roles_list.where(disabled: options[:disabled].values) if options[:disabled]

      OrderByPropertyService.apply_order(roles_list, options)
    end

    def list_managed(user)
      user&.permitted_roles_to_manage || none
    end

    def list_external
      where(disabled: false, referral: true).or(where(disabled: false, transfer: true))
    end
  end

  def permitted_forms(record_type = nil, visible_only = false, include_subforms = false)
    forms = form_sections.where({ parent_form: record_type, visible: (visible_only || nil) }.compact)
    forms = forms.or(form_sections.where(parent_form: record_type, is_nested: true)) if include_subforms
    forms
  end

  def permitted_subforms(record_type = nil, visible_only = false)
    FormSection.where(
      is_nested: true,
      subform_field: form_sections.joins(fields: :subform)
                                  .where({
                                    parent_form: record_type,
                                    visible: (visible_only || nil),
                                    fields: { type: Field::SUBFORM }
                                  }.compact)
    )
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

  def permits?(resource, action)
    permissions.find { |p| p.resource == resource }&.actions&.include?(action)
  end

  def permitted_dashboard?(dashboard_name)
    permits?(Permission::DASHBOARD, dashboard_name)
  end

  def dashboards
    dashboard_permissions = permissions.find { |p| p.resource == Permission::DASHBOARD }
    dashboard_permissions&.actions&.map do |action|
      next Dashboard.dash_reporting_location(self) if action == 'dash_reporting_location'
      next Dashboard.send(action) if Dashboard::DYNAMIC.include?(action)

      "Dashboard::#{action.upcase}".constantize
    rescue NameError
      nil
    end&.compact || []
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
    forms_by_parent = FormSection.all_forms_grouped_by_parent(true)
    role_module_ids = primero_modules.pluck(:unique_id)
    permissions_with_forms.each do |permission|
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

  def form_section_permission
    form_sections.pluck('form_sections.unique_id, form_sections_roles.permission')
                 .each_with_object({}) { |elem, acc| acc[elem.first] = elem.last }
  end

  def module_unique_ids
    modules.pluck(:unique_id)
  end

  def update_properties(role_properties)
    role_properties = role_properties.with_indifferent_access if role_properties.is_a?(Hash)
    assign_attributes(role_properties.except('permissions', 'form_section_read_write', 'module_unique_ids'))
    update_forms_sections(role_properties['form_section_read_write'])
    update_permissions(role_properties['permissions'])
    update_modules(role_properties['module_unique_ids'])
  end

  def configuration_hash
    hash = attributes.except('id', 'permissions')
    hash['permissions'] = Permission::PermissionSerializer.dump(permissions)
    hash['form_section_read_write'] = form_section_permission
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

  def update_forms_sections(form_section_read_write)
    return if form_section_read_write.nil?

    form_permissions.destroy_all
    self.form_permissions = form_section_read_write.to_h.map do |key, value|
      FormPermission.new(form_section: FormSection.find_by(unique_id: key), role: self, permission: value)
    end
  end

  def update_permissions(permissions)
    return if permissions.nil?

    permissions = Permission::PermissionSerializer.load(permissions.to_h) unless permissions.is_a?(Array)
    self.permissions = permissions
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
# rubocop:enable Metrics/ClassLength
