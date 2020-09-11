# frozen_string_literal: true

# A form is a collection of fields. Forms describe how a user may interact with a record.
class FormSection < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  RECORD_TYPES = %w[case incident tracing_request].freeze

  localize_properties :name, :help_text, :description

  has_many :fields, -> { order(:order) }, dependent: :destroy, autosave: true
  accepts_nested_attributes_for :fields
  has_many :collapsed_fields, class_name: 'Field', foreign_key: 'collapsed_field_for_subform_section_id'
  has_one :subform_field,
          class_name: 'Field', dependent: :nullify, foreign_key: 'subform_section_id', inverse_of: :subform
  has_and_belongs_to_many :roles
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
  after_save :calculate_subform_collapsed_fields

  def defaults
    %w[order order_form_group order_subform initial_subforms].each { |p| self[p] ||= 0 }
  end

  def form_group_name_i18n(lookups = nil)
    return name_i18n if form_group_id.blank?

    Lookup.form_group_name_all(form_group_id, parent_form, module_name, lookups)
  end

  # TODO: DELETE THIS, once we refactor YML exporter
  def localized_property_hash(locale = Primero::Application::BASE_LANGUAGE, show_hidden_fields = false)
    lh = localized_hash(locale)
    fldz = {}
    fields.each { |f| fldz[f.name] = f.localized_property_hash locale if show_hidden_fields || f.visible? }
    lh['fields'] = fldz
    lh
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

    def new_with_properties(form_params)
      FormSection.new.tap { |form| form.update_properties(form_params) }
    end

    # TODO: Refactor/delete with Yaml exporter
    # Given a list of forms, return their subforms
    def get_subforms(forms)
      form_ids = forms.map(&:id)
      subform_fields = Field.includes(:subform).where(form_section_id: form_ids, type: Field::SUBFORM)
      subform_fields.map(&:subform).compact
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

    # TODO: Refactor with YML i18n import
    def import_translations(form_hash={}, locale)
      if locale.present? && I18n.available_locales.include?(locale.try(:to_sym))
        unique_id = form_hash.keys.first
        if unique_id.present?
          form = FormSection.find_by(unique_id: unique_id)
          if form.present?
            form.update_translations(form_hash.values.first, locale)
            Rails.logger.info "Updating Form translation: Form [#{form.unique_id}] locale [#{locale}]"
            form.save!
          else
            Rails.logger.error "Error importing translations: Form for ID [#{unique_id}] not found"
          end
        else
          Rails.logger.error "Error importing translations: Form ID not present"
        end
      else
        Rails.logger.error "Error importing translations: locale not present"
      end
    end

    def list(params = {})
      form_sections = all.includes(:fields, :collapsed_fields, :primero_modules)
      form_sections = form_sections.where(parent_form: params[:record_type]) if params[:record_type]
      form_sections = form_sections.where(primero_modules: { unique_id: params[:module_id] }) if params[:module_id]
      form_sections
    end
  end

  def configuration_hash
    hash = attributes.except('id')
    hash['fields_attributes'] = fields.map(&:configuration_hash)
    hash['module_ids'] = primero_modules.pluck(:unique_id)
    hash.with_indifferent_access
  end

  # If a new form_group_id was added during edit/create, then add that form group to the form_group lookup
  def sync_form_group
    return unless changed_attribute_names_to_save.include?('form_group_id')
    return if form_group_id.blank?
    return if Lookup.form_group_name(form_group_id, parent_form, module_name).present?

    # If added manually by the user, form_group_id at this point is just what the user typed in
    # Use that value for the form group description.  Parameterize it to use as the id
    new_id = form_group_id.parameterize(separator: '_')
    Lookup.add_form_group(new_id, form_group_id, parent_form, module_name)
    self.form_group_id = new_id
  end

  # TODO: Refactor with Yaml I18n importer.
  def update_translations(form_hash={}, locale)
    if locale.present? && Primero::Application::locales.include?(locale)
      form_hash.each do |key, value|
        # Form Group Name is now a calculated field based on form_group_id
        # Form Group Translations are handled through Lookup
        # Using elsif to exclude form_group_name in legacy translation files that may still include form_group_name
        if key == 'fields'
          update_field_translations(value, locale)
        elsif key != 'form_group_name'
          self.send("#{key}_#{locale}=", value)
        end
      end
    else
      Rails.logger.error "Form translation not updated: Invalid locale [#{locale}]"
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

  def permitted_destroy!
    return unless !editable? || core_form?

    raise Errors::ForbiddenOperation
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

  # TODO: Refactor with Yaml I18n importer.
  def update_field_translations(fields_hash = {}, locale)
    fields_hash.each do |key, value|
      field = Field.find_by(name: key, form_section_id: id)
      if field.present?
        field.update_translations(value, locale)
      end
    end
  end
end
