# frozen_string_literal: true

# A form is a collection of fields. Forms describe how a user may interact with a record.
# rubocop:disable Metrics/ClassLength
class FormSection < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  RECORD_TYPES = %w[case incident tracing_request].freeze

  FORM_SECTION_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'unique_id' => { 'type' => 'string' },
    'name' => { 'type' => 'object' }, 'help_text' => { 'type' => 'object' },
    'description' => { 'type' => 'object' }, 'parent_form' => { 'type' => 'string' },
    'visible' => { 'type' => 'boolean' }, 'order' => { 'type' => 'integer' },
    'order_form_group' => { 'type' => 'integer' }, 'order_subform' => { 'type' => 'integer' },
    'form_group_keyed' => { 'type' => 'boolean' }, 'is_nested' => { 'type' => 'boolean' },
    'is_first_tab' => { 'type' => 'boolean' }, 'is_summary_section' => { 'type' => 'boolean' },
    'mobile_form' => { 'type' => 'boolean' }, 'hide_subform_placeholder' => { 'type' => 'boolean' },
    'subform_prevent_item_removal' => { 'type' => 'boolean' }, 'subform_append_only' => { 'type' => 'boolean' },
    'display_help_text_view' => { 'type' => 'boolean' }, 'subform_header_links' => { 'type' => 'boolean' },
    'initial_subforms' => { 'type' => 'integer' }, 'form_group_id' => { 'type' => 'string' },
    'shared_subform' => { 'type' => 'string' }, 'shared_subform_group' => { 'type' => 'string' },
    'collapsed_field_names' => { 'type' => 'array' }, 'fields' => { 'type' => 'array' },
    'module_ids' => { 'type' => 'array' }
  }.freeze

  localize_properties :name, :help_text, :description

  has_many :fields, -> { order(:order) },
           dependent: :destroy, autosave: true, after_add: :touch_on_field_add, after_remove: :touch_on_field_add
  accepts_nested_attributes_for :fields
  has_many :collapsed_fields, class_name: 'Field', foreign_key: 'collapsed_field_for_subform_section_id'
  has_one :subform_field,
          class_name: 'Field', dependent: :nullify, foreign_key: 'subform_section_id', inverse_of: :subform
  has_many :form_permissions
  has_many :roles, through: :form_permissions, dependent: :destroy
  has_and_belongs_to_many :primero_modules, inverse_of: :form_sections

  attr_accessor :module_name
  attribute :collapsed_field_names
  self.unique_id_from_attribute = 'name_en'
  alias_attribute :to_param, :unique_id # TODO: Something to do with audit logs?

  validate :validate_fields_unique_name
  validate :validate_name_format
  validates :name_en, presence: { message: 'errors.models.form_section.presence_of_name' }
  validates :unique_id, presence: true, uniqueness: { message: 'errors.models.form_section.unique_id' }

  after_initialize :defaults, unless: :persisted?
  before_validation :calculate_fields_order, :generate_unique_id
  before_save :sync_form_group
  after_save :sync_modules
  after_save :calculate_subform_collapsed_fields
  after_touch :touch_roles
  after_save :touch_roles, if: -> { saved_change_to_attribute?('visible') }

  def defaults
    %w[order order_form_group order_subform initial_subforms].each { |p| self[p] ||= 0 }
  end

  def inspect
    "FormSection(#{name}, form_group_id => '#{form_group_id}')"
  end

  class << self
    def permitted_api_params
      [
        'id', 'unique_id', { 'name' => {} }, { 'help_text' => {} }, { 'description' => {} }, 'parent_form',
        'visible', 'order', 'order_form_group', 'order_subform', 'form_group_keyed', 'form_group_id', 'is_nested',
        'is_first_tab', 'initial_subforms', 'subform_prevent_item_removal', 'subform_append_only',
        'subform_header_links', 'display_help_text_view', 'shared_subform', 'shared_subform_group',
        'is_summary_section', 'hide_subform_placeholder', 'mobile_form', { 'collapsed_field_names' => [] }
      ]
    end

    def new_with_properties(form_params, opts = {})
      FormSection.new.tap do |form|
        form.update_properties(form_params)
        form.roles << opts[:user]&.role if opts[:user].present?
      end
    end

    # TODO: Used by the RolePermissionsExporter
    def all_forms_grouped_by_parent(include_subforms = false)
      forms = FormSection.where(is_nested: false)
      forms = forms.unscope(:where) if include_subforms
      forms.group_by(&:parent_form)
    end

    def violation_forms
      # TODO: Fix this when we make MRM work
      # ids = Incident.violation_id_fields.keys
      # FormSection.by_unique_id(keys: ids).all
      []
    end

    def form_group_lookups
      Lookup.where("unique_id like 'lookup-form-group-%'")
    end

    # FormSection.list() breaks the Fields order, so you have to specify the order when selecting the fields
    # This is due to an issue that breaks ordering when using includes with a where clause
    # Example:  FormSection.list(params).first.fields.order(:order)
    def list(params = {})
      form_sections = all.includes(:fields, :collapsed_fields, :primero_modules)
      form_sections = form_sections.where(unique_id: params[:unique_id]) if params[:unique_id]
      form_sections = form_sections.where(parent_form: params[:record_type]) if params[:record_type]
      form_sections = form_sections.where(primero_modules: { unique_id: params[:module_id] }) if params[:module_id]
      form_sections = form_sections.where(is_nested: false) if params[:exclude_subforms]
      form_sections
    end

    def sort_configuration_hash(configuration_hash)
      configuration_hash&.sort_by { |hash| hash['is_nested'] ? 0 : 1 }
    end

    def api_path
      '/api/v2/forms'
    end
  end

  def insert_field!(field)
    return if field_exists?(field.name)
    return fields << field unless field.order

    field.form_section = self
    fields_to_reorder = fields.where(order: field.order..)

    Field.transaction do
      fields_to_reorder.each { |f| f.order += 1; f.save! }
      field.save!
    end
  end

  def field_exists?(name)
    fields.exists?(name: name)
  end

  def configuration_hash
    hash = attributes.except('id')
    hash['collapsed_field_names'] = collapsed_fields.pluck(:name) if is_nested?
    hash['fields_attributes'] = fields.map(&:configuration_hash)
    hash['module_ids'] = primero_modules.pluck(:unique_id)
    hash.with_indifferent_access
  end

  # If a new form_group_id was added during edit/create, then add that form group to the form_group lookup
  def sync_form_group
    return unless changed_attribute_names_to_save.include?('form_group_id')
    return if form_group_id.blank?
    return if Lookup.form_group_name(form_group_id, parent_form, module_name)

    # If added manually by the user, form_group_id at this point is just what the user typed in
    # Use that value for the form group description.  Parameterize it to use as the id
    new_id = form_group_id.parameterize(separator: '_')
    Lookup.add_form_group(new_id, form_group_id, parent_form, module_name)
    self.form_group_id = new_id
  end

  # If a form's modules changed, update the modules of the subforms
  def sync_modules
    subforms.each do |subform|
      next if subform.primero_modules == primero_modules

      subform.primero_modules = primero_modules
      subform.save!
    end
  end

  def subforms
    FormSection.where(id: fields.where(type: 'subform').select(:subform_section_id))
  end

  def update_translations(locale, form_hash = {})
    return Rails.logger.error('Form translation not updated: No Locale passed in') if locale.blank?

    invalid_locale = I18n.available_locales.exclude?(locale)
    return Rails.logger.error("Form translation not updated: Invalid locale [#{locale}]") if invalid_locale

    form_hash.each do |key, value|
      # Form Group Name is now a calculated field based on form_group_id
      # Form Group Translations are handled through Lookup
      # Using elsif to exclude form_group_name in legacy translation files that may still include form_group_name
      next if key == 'form_group_name'

      key == 'fields' ? update_field_translations(locale, value) : send("#{key}_#{locale}=", value)
    end
  end

  def update_properties(form_params)
    form_params = form_params.with_indifferent_access if form_params.is_a?(Hash)
    update_field_properties(form_params)
    if form_params['module_ids'].present?
      self.primero_modules = PrimeroModule.where(unique_id: form_params['module_ids'])
    end
    form_params = form_params.except('module_ids', 'fields_attributes', 'fields')
    self.attributes = params_with_i18n(form_params)
  end

  def params_with_i18n(form_params)
    form_params = FieldI18nService.convert_i18n_properties(FormSection, form_params)
    form_params_i18n = FieldI18nService.merge_i18n_properties(attributes, form_params)
    form_params.merge(form_params_i18n)
  end

  def update_field_properties(form_params)
    return unless form_params['fields'] || form_params['fields_attributes']

    fields = if form_params['fields']&.first.is_a?(Field)
               form_params['fields']
             else
               form_params['fields_attributes'] ||= form_params['fields']
               fields_from_params(form_params['fields_attributes'])
             end
    self.fields = fields
  end

  def fields_from_params(fields_params)
    # TODO: We are allowing updating non-editable fields via the API
    fields_params.map do |field_params|
      field = fields.find { |f| f.name == field_params['name'] } || Field.new
      field.update_properties(field_params)
      field
    end
  end

  def subform_fields
    fields.select { |f| f.type == 'subform' }
  end

  def non_subform_fields
    fields.reject { |f| f.type == 'subform' }
  end

  def permitted_destroy!
    return unless !editable? || core_form?

    raise Errors::ForbiddenOperation
  end

  def parent_forms
    return FormSection.none unless is_nested?

    FormSection.joins(:fields).where(fields: { subform_section_id: self }, is_nested: false)
  end

  def parent_roles
    return Role.none unless is_nested?

    Role.joins(:form_sections).distinct.where(form_sections: { unique_id: parent_forms.pluck(:unique_id) })
  end

  protected

  def calculate_subform_collapsed_fields
    return unless is_nested

    fields_to_link = collapsed_fields_to_link
    fields_to_unlink = collapsed_fields_to_unlink

    fields_to_link.present? &&
      Field.where(id: fields_to_link).update_all(collapsed_field_for_subform_section_id: id)
    fields_to_unlink.present? &&
      Field.where(id: fields_to_unlink).update_all(collapsed_field_for_subform_section_id: nil)
  end

  def collapsed_fields_to_link
    return [fields&.first&.id].compact unless collapsed_field_names.present?

    fields.where(name: collapsed_field_names).pluck(:id)
  end

  def collapsed_fields_to_unlink
    return (fields[1..-1]&.pluck(:id) || []) unless collapsed_field_names.present?

    fields.where.not(name: collapsed_field_names).pluck(:id)
  end

  def calculate_fields_order
    return if fields.blank?

    fields.each_with_index do |field, index|
      field.order ||= index
    end
  end

  def validate_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    return unless name =~ special_characters || name =~ white_spaces

    errors.add(:name, 'errors.models.form_section.format_of_name')
  end

  def validate_fields_unique_name
    field_names = fields.map(&:name)
    return unless field_names.length > field_names.dup.uniq.length

    errors.add(:fields, 'errors.models.form_section.unique_field_names')
  end

  private

  def update_field_translations(locale, fields_hash = {})
    fields_hash.each do |key, value|
      field = Field.find_by(name: key, form_section_id: id)
      next if field.blank?

      field.update_translations(locale, value)
      field.save!
    end
  end

  def touch_on_field_add(_field)
    new_record? || touch
  end

  def touch_roles
    roles_to_touch = is_nested? ? parent_roles : roles
    roles_to_touch.touch_all
  end
end
# rubocop:enable Metrics/ClassLength
