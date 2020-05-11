# frozen_string_literal: true

# The model for Role
class Role < ApplicationRecord
  #include Importable #TODO: This will need to be rewritten
  # include Memoizable
  include Cloneable
  include Configuration

  has_and_belongs_to_many :form_sections, -> { distinct }
  has_and_belongs_to_many :primero_modules, -> { distinct }

  alias_attribute :modules, :primero_modules

  serialize :permissions, Permission::PermissionSerializer

  validates :permissions, presence: { message: 'errors.models.role.permission_presence' }
  validates :name, presence: { message: 'errors.models.role.name_present' },
                   uniqueness: { message: 'errors.models.role.unique_name' }

  before_create :generate_unique_id

  scope :by_referral, -> { where(referral: true) }
  scope :by_transfer, -> { where(transfer: true) }

  def has_permitted_form_id?(form_unique_id_id)
    form_sections.map(&:unique_id).include?(form_unique_id_id)
  end

  class << self

    def memoized_dependencies
      [FormSection, PrimeroModule, User]
    end

    #TODO: Used by importer. Refactor?
    def get_unique_instance(attributes)
      find_by_name(attributes['name'])
    end

    def names_and_ids_by_referral
      self.by_referral.pluck(:name, :unique_id)
    end
    # memoize_in_prod :names_and_ids_by_referral

    def names_and_ids_by_transfer
      self.by_transfer.pluck(:name, :unique_id)
    end
    # memoize_in_prod :names_and_ids_by_transfer

    def create_or_update(attributes = {})
      record = self.find_by(unique_id: attributes[:unique_id])
      if record.present?
        record.update_attributes(attributes)
      else
        self.create!(attributes)
      end
    end

    def id_from_name(name)
      "#{self.name}-#{name}".parameterize.dasherize
    end

    alias super_clear clear
    def clear
      # According documentation this is the best way to delete the values on HABTM relation
      self.all.each do |f|
        f.form_sections.destroy(f.form_sections)
      end
      super_clear
    end

    alias super_import import
    def import(data)
      data['form_sections'] = FormSection.where(unique_id: data['form_sections']) if data['form_sections'].present?
      super_import(data)
    end

    def export
      self.all.map do |record|
        record.attributes.tap do |r|
          r.delete('id')
          r['form_sections'] = record.form_sections.pluck(:unique_id)
        end
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
  end

  def permitted_roles
    return Role.none if permitted_role_unique_ids.blank?

    Role.where(unique_id: permitted_role_unique_ids)
  end

  def permitted_role_unique_ids
    role_permission = permissions.find { |permission| permission.resource == Permission::ROLE }
    return [] if role_permission.blank?

    role_permission.role_unique_ids
  end

  def dashboards
    dashboard_permissions = permissions.find { |p| p.resource == Permission::DASHBOARD }
    dashboards = dashboard_permissions&.actions&.map do |action|
      next Dashboard.send(action) if Dashboard::DYNAMIC.include?(action)

      begin
        "Dashboard::#{action.upcase}".constantize
      rescue NameError
        nil
      end
    end || []
    dashboards.compact
  end

  def is_super_user_role?
    superuser_resources = [
      Permission::CASE, Permission::INCIDENT, Permission::REPORT,
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    has_managed_resources?(superuser_resources)
  end

  def is_user_admin_role?
    admin_only_resources = [
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    has_managed_resources?(admin_only_resources)
  end

  def permitted_to_export?
    permissions&.map(&:actions).flatten.compact.any? { |p| p.start_with?('export') } ||
      permissions&.any? { |p| Permission.records.include?(p.resource) && p.actions.include?(Permission::MANAGE) }
  end

  def generate_unique_id
    if self.name.present? && self.unique_id.blank?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end

  def associate_all_forms
    permissions_with_forms = permissions.select{ |p| p.resource.in?(Permission.records) }
    forms_by_parent = FormSection.all_forms_grouped_by_parent
    permissions_with_forms.map do |permission|
      self.form_sections << forms_by_parent[permission.resource].reject {|f| self.form_sections.include?(f)}
      self.save
    end
  end

  def form_section_unique_ids
    form_sections.pluck(:unique_id)
  end

  def module_unique_ids
    modules.pluck(:unique_id)
  end

  def update_properties(role_properties)
    assign_attributes(role_properties.except(:permissions, :form_section_unique_ids, :module_unique_ids))
    self.form_sections = FormSection.where(unique_id: role_properties[:form_section_unique_ids])
    if role_properties[:permissions].present?
      self.permissions = Permission::PermissionSerializer.load(role_properties[:permissions].to_h)
    end
    self.modules = PrimeroModule.where(unique_id: role_properties[:module_unique_ids])
  end

  private

  def has_managed_resources?(resources)
    current_managed_resources = self.permissions.select{ |p| p.actions == [Permission::MANAGE] }.map(&:resource)
    (resources - current_managed_resources).empty?
  end
end
