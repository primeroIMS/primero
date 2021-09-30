# frozen_string_literal: true

# Model for Field
class Field < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  TEXT_FIELD = 'text_field'
  TEXT_AREA = 'textarea'
  RADIO_BUTTON = 'radio_button'
  SELECT_BOX = 'select_box'
  NUMERIC_FIELD = 'numeric_field'
  PHOTO_UPLOAD_BOX = 'photo_upload_box'
  AUDIO_UPLOAD_BOX = 'audio_upload_box'
  DOCUMENT_UPLOAD_BOX = 'document_upload_box'
  DATE_FIELD = 'date_field'
  DATE_RANGE = 'date_range'
  SUBFORM = 'subform'
  SEPARATOR = 'separator'
  TICK_BOX = 'tick_box'
  TALLY_FIELD = 'tally_field'
  CUSTOM = 'custom'

  DATE_VALIDATION_DEFAULT = 'default_date_validation'
  DATE_VALIDATION_NOT_FUTURE = 'not_future_date'

  localize_properties :display_name, :help_text, :guiding_questions, :tally, :tick_box_label
  localize_properties :option_strings_text, options_list: true

  attr_reader :options
  store_accessor :subform_section_configuration, :subform_sort_by, :subform_group_by

  # Since Rails 5 belongs_to acts as a validate_presence_of.
  # This relation will be optional because the scoped association in FormSection will fail otherwise.
  # TODO: If performing JSON enumration validation on lookups, make sure to touch form_section on change
  belongs_to :form_section, optional: true
  belongs_to :subform, foreign_key: 'subform_section_id', class_name: 'FormSection', optional: true
  belongs_to :collapsed_field_for_subform, foreign_key: 'collapsed_field_for_subform_section_id',
                                           class_name: 'FormSection', optional: true

  alias_attribute :form, :form_section
  alias_attribute :subform_section, :subform

  attr_readonly :name, :type, :multi_select

  scope :binary, -> { where(type: [Field::PHOTO_UPLOAD_BOX, Field::AUDIO_UPLOAD_BOX, Field::DOCUMENT_UPLOAD_BOX]) }

  validate :validate_unique_name_in_form
  validates :name, format: { with: /\A[a-z][a-z0-9_]*\z/, message: 'errors.models.field.name_format' },
                   presence: { message: 'errors.models.field.name_presence' }
  validates :display_name_en, presence: { message: 'errors.models.field.display_name_presence' }
  validate :validate_display_name_format
  validate :validate_option_strings_text

  before_save :sanitize_option_strings_text
  before_create :sanitize_name, :set_default_date_validation, :set_tally_field_defaults
  after_save :sync_modules

  # rubocop:disable Metrics/MethodLength
  def self.permitted_api_params
    [
      'id', 'name', 'type', 'multi_select', 'form_section_id', 'visible', 'mobile_visible',
      'hide_on_view_page', 'show_on_minify_form', 'disabled', { 'display_name' => {} }, { 'help_text' => {} },
      { 'guiding_questions' => {} }, { 'tally' => {} }, { 'tick_box_label' => {} },
      { 'option_strings_text' => [:id, :disabled, display_text: {}] },
      'option_strings_source', 'order', 'hidden_text_field', 'subform_section_id',
      'collapsed_field_for_subform_section_id', 'autosum_total', 'autosum_group', 'selected_value', 'link_to_path',
      'link_to_path_external', 'field_tags', 'searchable_select', 'expose_unique_id', 'subform_sort_by',
      'subform_group_by', 'required', 'date_validation', 'date_include_time', 'matchable',
      { 'subform_section_configuration' => {} }
    ]
  end
  # rubocop:enable Metrics/MethodLength

  # TODO: Move the logic for all_*_field_names methods to the Searchable concern
  class << self
    # This allows us to use the property 'type' on Field, normally reserved by ActiveRecord
    def inheritance_column
      'type_inheritance'
    end

    def fields_for_record(parent_form, is_subform = false)
      Field.joins(:form_section).where(form_sections: { parent_form: parent_form, is_nested: is_subform })
    end

    def all_searchable_date_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: [Field::DATE_FIELD, Field::DATE_RANGE], date_include_time: false)
                                    .pluck(:name)
    end

    def all_searchable_date_time_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: [Field::DATE_FIELD, Field::DATE_RANGE], date_include_time: true)
                                    .pluck(:name)
    end

    def all_searchable_boolean_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: Field::TICK_BOX).pluck(:name)
    end

    def all_filterable_option_field_names(parent_form = 'case')
      # TODO: TEXT_FIELD is being indexed for exact search? Makes sense for docuemt identifiers, but not much else.
      fields_for_record(parent_form).where(type: [RADIO_BUTTON, SELECT_BOX], multi_select: false)
                                    .pluck(:name)
    end
    
    def all_filterable_multi_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: Field::SELECT_BOX, multi_select: true).pluck(:name)
    end

    def all_filterable_numeric_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: Field::NUMERIC_FIELD).pluck(:name)
    end

    def all_tally_fields(parent_form = 'case')
      fields_for_record(parent_form).where(type: Field::TALLY_FIELD).pluck(:name)
    end

    def all_location_field_names(parent_form = 'case')
      fields_for_record(parent_form).where(type: Field::SELECT_BOX, option_strings_source: 'Location').pluck(:name)
    end

    def find_by_name(field_names)
      field_names = [field_names] unless field_names.is_a?(Array)
      result = where(name: field_names)
      remainder = field_names - result.map(&:name)
      remainder = remainder.select { |field_name| field_name =~ /\d+$/ }
      return result unless remainder.present?

      result + find_as_location_fields(remainder)
    end

    def find_as_location_fields(field_names)
      field_names = field_names.map { |field_name| field_name.gsub(/\d+$/, '') }
      where(name: field_names, option_strings_source: 'Location')
    end
  end

  def update_properties(field_params)
    field_params['subform_unique_id'] &&
      self.subform = FormSection.find_by(unique_id: field_params['subform_unique_id'])
    if field_params['collapsed_field_for_subform_unique_id']
      self.collapsed_field_for_subform = FormSection.find_by(
        unique_id: field_params['collapsed_field_for_subform_unique_id']
      )
    end
    self.attributes = params_with_i18n(
      field_params.except('id', 'form_section_id', 'subform_unique_id', 'collapsed_field_for_subform_unique_id')
    )
  end

  def params_with_i18n(field_params)
    field_params = FieldI18nService.convert_i18n_properties(Field, field_params)
    field_params_i18n = FieldI18nService.merge_i18n_properties(attributes, field_params)
    field_params.merge(field_params_i18n)
  end

  def configuration_hash
    hash = attributes.except('id', 'form_section_id', 'subform_section_id', 'collapsed_field_for_subform')
    hash['subform_unique_id'] = subform&.unique_id
    hash['collapsed_field_for_subform_unique_id'] = collapsed_field_for_subform&.unique_id
    hash.with_indifferent_access
  end

  def options_list(locale: I18n.locale, lookups: nil)
    return unless [SELECT_BOX, RADIO_BUTTON, TICK_BOX].include?(type)
    return option_strings_text(locale) if option_strings_text.present?
    return options_list_tickbox(locale) if type == Field::TICK_BOX

    options_list_source_string(locale: locale, lookups: lookups)
  end

  def options_list_tickbox(locale = I18n.locale)
    %w[true false].map { |x| { id: x, display_text: I18n.t(x, locale: locale) } }
  end

  def options_list_source_string(locale: I18n.locale, lookups: nil)
    source_options = option_strings_source.split
    if source_options[0] == 'lookup'
      lookups ? Lookup.values(source_options.last, lookups, locale: locale) : source_options
    else
      source_options[0]
    end
  end

  # TODO: This is the TSFV service grouping. Is this still v2 functionality? Delete, after porting to front end?
  def subform_group_by_field
    # TODO: This is an extra DB query
    if type == SUBFORM && subform_group_by.present?
      unless @subform_group_by_field.present?
        @subform_group_by_field =
          subform_section.joins(:fields)
                         .where(fields: { name: subform_group_by, type: [Field::RADIO_BUTTON, Field::SELECT_BOX] })
                         .first
      end
    end
    @subform_group_by_field
  end

  def subform_group_by_values
    subform_group_by_values = {}
    subform_group_by_field = self.subform_group_by_field
    if subform_group_by_field.present?
      subform_group_by_values = subform_group_by_field.options_list(nil, nil, nil, true).map do |o|
        [o['id'], o['display_text']]
      end.to_h
    end
    subform_group_by_values
  end

  # Whether or not this should display on the show/view pages
  # Should not affect the new/edit pages
  def showable?
    visible? && !hide_on_view_page
  end

  def location?
    option_strings_source == 'Location'
  end

  def agency?
    option_strings_source == 'Agency'
  end

  def nested?
    form_section&.is_nested
  end

  def update_translations(locale, field_hash = {})
    return Rails.logger.error('Field translation not updated: No Locale passed in') if locale.blank?

    if I18n.available_locales.exclude?(locale)
      return Rails.logger.error("Field translation not updated: Invalid locale [#{locale}]")
    end

    field_hash.each do |key, value|
      if key == 'option_strings_text'
        update_option_strings_translations(value, locale)
      else
        send("#{key}_#{locale}=", value)
      end
    end
  end

  private

  def update_option_strings_translations(options_hash, locale)
    return Rails.logger.warn("Field #{name} does not have option strings. Skipping.") if option_strings_text.blank?

    options = (send("option_strings_text_#{locale}").present? ? send("option_strings_text_#{locale}") : [])
    option_keys_en = option_strings_text_en.map { |o| o['id'] }

    options_hash.each do |key, value|
      next if option_keys_en.exclude?(key) # Do not add any translations that do not have an English translation

      os = options&.find { |o| o['id'] == key }
      if os.present?
        os['display_text'] = value
      else
        options << { 'id' => key, 'display_text' => value }
      end
    end
    send("option_strings_text_#{locale}=", options)
  end

  # Names should only have lower case alpha, numbers and underscores
  def sanitize_name
    raw_name = (name.present? && name) || (display_name_en.present? && display_name_en) || nil
    return unless raw_name

    self.name = raw_name.gsub(/[^A-Za-z0-9_ ]/, '').parameterize.underscore
  end

  def sanitize_option_strings_text
    return unless option_strings_text_i18n.present?

    self.option_strings_text_i18n = option_strings_text_i18n.map do |option|
      option = option.with_indifferent_access
      option[:display_text] = option[:display_text].with_indifferent_access.slice(*I18n.available_locales)
      option
    end
  end

  def set_default_date_validation
    (type == DATE_FIELD) && self.date_validation ||= DATE_VALIDATION_DEFAULT
  end

  def set_tally_field_defaults
    return unless type == TALLY_FIELD

    self.autosum_group ||= "#{name}_number_of"
    self.autosum_total ||= true
  end

  def sync_modules
    return unless type == SUBFORM

    subform_section&.primero_modules = form_section.primero_modules if form_section.present?
  end

  def validate_unique_name_in_form
    return unless form_section_id
    return unless Field.where(name: name, form_section_id: form_section_id).where.not(id: id).any?

    errors.add(:name, 'errors.models.field.unique_name_this')
  end

  def validate_display_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    return unless display_name_en =~ special_characters || display_name_en =~ white_spaces

    errors.add(:display_name, 'errors.models.field.display_name_format')
  end

  def validate_option_strings_text
    return unless [SELECT_BOX, RADIO_BUTTON].include?(type) && option_strings_text_i18n.present?

    all_options_valid = option_strings_text_i18n.is_a?(Array) &&
                        option_strings_text_i18n.all? { |opt| valid_option?(opt) }
    return if all_options_valid

    errors.add(:option_strings_text, 'errors.models.field.option_strings_text.not_hash')
  end

  def valid_option?(option)
    return unless option.is_a?(Hash)

    option = option.with_indifferent_access
    option[:id].present? && option[:display_text].is_a?(Hash) &&
      option[:display_text].with_indifferent_access[:en].present?
  end
end
