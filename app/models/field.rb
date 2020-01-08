# frozen_string_literal: true

class Field < ApplicationRecord

  include LocalizableJsonProperty
  include Configuration
  # include Memoizable

  localize_properties :display_name, :help_text, :guiding_questions, :tally, :tick_box_label, :option_strings_text

  attr_reader :options

  # Since Rails 5 belongs_to acts as a validate_presence_of.
  # This relation will be optional because the scoped association in FormSection will fail otherwise.
  belongs_to :form_section, optional: true
  belongs_to :subform, foreign_key: 'subform_section_id', class_name: 'FormSection', optional: true, dependent: :destroy
  belongs_to :collapsed_field_for_subform, foreign_key: 'collapsed_field_for_subform_section_id', class_name: 'FormSection', optional: true

  alias_attribute :form, :form_section
  alias_attribute :subform_section, :subform


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

  DATE_VALIDATION_OPTIONS = %w[default_date_validation not_future_date].freeze

  validate :validate_unique_name
  validate :validate_display_name_format
  validate :validate_name_format
  validate :validate_display_name_in_english
  validate :valid_tally_field
  validate :validate_option_strings_text

  after_initialize :defaults, unless: :persisted?
  before_validation :generate_options_keys
  before_validation :sync_options_keys
  before_create :sanitize_name

  def self.permitted_api_params
    [
      'id', 'name', 'type', 'multi_select', 'form_section_id', 'visible', 'mobile_visible',
      'hide_on_view_page', 'show_on_minify_form', 'disabled', { 'display_name' => {} }, { 'help_text' => {} },
      { 'guiding_questions' => {} }, { 'tally' => {} }, { 'tick_box_label' => {} }, { 'option_strings_text' => {} },
      'option_strings_source', 'order', 'hidden_text_field', 'subform_section_id',
      'collapsed_field_for_subform_section_id', 'autosum_total', 'autosum_group', 'selected_value', 'link_to_path',
      'link_to_path_external', 'field_tags', 'searchable_select', 'expose_unique_id', 'subform_sort_by',
      'subform_group_by', 'required', 'date_validation', 'date_include_time', 'matchable'
    ]
  end

  #TODO: Move to migration
  def defaults
    self.date_validation ||= 'default_date_validation'
    self.autosum_group ||= ''
    #self.attributes = properties #TODO: what is this?
  end

  def localized_property_hash(locale=Primero::Application::BASE_LANGUAGE)
    lh = localized_hash(locale)
    if self.option_strings_text.present?
      fh = {}
      self.option_strings_text(locale).each{|os| fh[os['id']] = os['display_text']}
      lh['option_strings_text'] = fh
    end
    lh
  end

  def validate_display_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    if (display_name_en =~ special_characters) || (display_name_en =~ white_spaces)
      #TODO: I18n!
      errors.add(:display_name, I18n.t('errors.models.field.display_name_format'))
      return false
    else
      return true
    end
  end

  #Only allow name to have lower case alpha, numbers and underscore
  def validate_name_format
    if name.blank?
      errors.add(:name, I18n.t('errors.models.field.name_presence'))
      return false
    elsif name =~ /[^a-z0-9_]/
      errors.add(:name, I18n.t('errors.models.field.name_format'))
      return false
    elsif name =~ /^\d/
      errors.add(:name, I18n.t('errors.models.field.name_format_number_first'))
      return false
    else
      return true
    end
  end

  def validate_display_name_in_english
    unless (self.display_name(Primero::Application::BASE_LANGUAGE).present?)
      errors.add(:display_name, I18n.t('errors.models.field.display_name_presence'))
      return false
    end
  end

  def validate_option_strings_text
    base_options = self.option_strings_text(Primero::Application::BASE_LANGUAGE)
    if base_options.blank?
      #If base options are blank, then all translated options should also be blank
      if Primero::Application::locales.any? {|locale| self.option_strings_text(locale).present?}
        errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.translations_not_empty'))
        return false
      else
        return true
      end
    end
    return false unless valid_option_strings?(base_options)
    return false unless options_keys_unique?(base_options)
    return false unless valid_option_strings_text_translations?
    return true
  end

  def valid_option_strings_text_translations?
    default_ids = self.option_strings_text(Primero::Application::BASE_LANGUAGE).try(:map){|op| op['id']}
    Primero::Application::locales.each do |locale|
      next if locale == Primero::Application::BASE_LANGUAGE
      options = self.option_strings_text(locale)
      next if options.blank?
      return false unless valid_option_strings?(options, false)
      return false unless option_keys_match?(default_ids, options)
    end
    return true
  end

  def valid_option_strings?(options, is_base_language=true)
    unless options.is_a?(Array)
      errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.not_array'))
      return false
    end

    options.each {|option| return false unless valid_option?(option, is_base_language)}
    return true
  end

  def valid_option?(option, is_base_language=true)
    unless option.is_a?(Hash)
      errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.not_hash'))
      return false
    end

    if option['id'].blank?
      errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.id_blank'))
      return false
    end

    if is_base_language && option['display_text'].blank?
      errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.display_text_blank'))
      return false
    end
    return true
  end

  def option_keys_match?(default_ids, options)
    locale_ids = options.try(:map){|op| op['id']}
    if ((default_ids - locale_ids).present? || (locale_ids - default_ids).present?)
      errors.add(:option_strings_text, I18n.t('errors.models.field.translated_options_do_not_match'))
      return false
    end
    return true
  end

  def options_keys_unique?(options)
    unless options.map{|o| o['id']}.uniq.length == options.map{|o| o['id']}.length
      errors.add(:option_strings_text, I18n.t('errors.models.field.option_strings_text.id_not_unique'))
      return false
    end
    return true
  end

  def form_type
    if [SUBFORM, SEPARATOR, TALLY_FIELD, CUSTOM].include?(self.type)
      self.type
    elsif [RADIO_BUTTON, SELECT_BOX].include?(self.type)
      'multiple_choice'
    else
      'basic'
    end
  end

	def display_type
    #TODO: A hack, because we have a non-standard template names. Cleanup with UIUX
    case self.type
    when TEXT_FIELD, TEXT_AREA, RADIO_BUTTON, SELECT_BOX, DATE_FIELD, NUMERIC_FIELD
      'basic'
    when DATE_RANGE
      'range'
    when AUDIO_UPLOAD_BOX
      'audio'
    when PHOTO_UPLOAD_BOX
      'photo'
    when DOCUMENT_UPLOAD_BOX
      'document'
    else
      self.type
    end
	end

  #DB field cannot be created such that its has anything but lower case alpha, numbers and underscores
  def sanitize_name
    if self.name.present?
      self.name = self.name.gsub(/[^A-Za-z0-9_ ]/, '').parameterize.underscore
    elsif self.display_name_en.present?
      self.name = self.display_name_en.gsub(/[^A-Za-z0-9 ]/, '').parameterize.underscore
    end
  end


  class << self
    def fields_for_record(parent_form, is_subform=false)
      Field.joins(:form_section).where(form_sections: {parent_form: parent_form, is_nested: is_subform})
    end

    def all_searchable_date_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: [Field::DATE_FIELD, Field::DATE_RANGE], date_include_time: false).pluck(:name)
    end

    def all_searchable_date_time_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: [Field::DATE_FIELD, Field::DATE_RANGE], date_include_time: true).pluck(:name)
    end

    def all_searchable_boolean_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: Field::TICK_BOX).pluck(:name)
    end

    def all_filterable_field_names(parent_form='case')
      #TODO: TEXT_FIELD is being indexed for exact search?
      fields_for_record(parent_form).where(type: [TEXT_FIELD, RADIO_BUTTON, SELECT_BOX], multi_select: false).pluck(:name)
    end

    def all_filterable_multi_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: Field::SELECT_BOX, multi_select: true).pluck(:name)
    end

    def all_filterable_numeric_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: Field::NUMERIC_FIELD).pluck(:name)
    end

    def all_tally_fields(parent_form='case')
      fields_for_record(parent_form).where(type: Field::TALLY_FIELD).pluck(:name)
    end

    def all_location_field_names(parent_form='case')
      fields_for_record(parent_form).where(type: Field::SELECT_BOX, option_strings_source: 'Location').pluck(:name)
    end

    # TODO: This has been renamed to allow a hack to wrap it
    def get_by_name(name)
      result = Field.where(name: name)
      unless name.is_a? Array
        result = result.first
      end
      result
    end
    #memoize_in_prod :get_by_name

    #TODO: This is a HACK to pull back location fields from admin solr index names,
    #      completely based on assumptions.
    #      Also it's inefficient, and potentially inconsistent with itself
    def find_by_name(field_name)
      field_name = field_name.deep_dup
      field = nil
      if field_name.present?
        if field_name.kind_of?(Array)
          field_name.select{|s|
            s.match('.*(\\d)+') && !get_by_name(s).present?
          }.each{|s|
            s.gsub!(/ *\d+$/, '')
          }
        elsif field_name.match('.*(\\d)+') && !get_by_name(field_name).present?
          field_name.gsub!(/ *\d+$/, '')
        end

        field = get_by_name(field_name)
        unless field.present?
          if field_name.last.is_number? && field_name.length > 1
            field = get_by_name(field_name[0..-2])
            unless field.present? && field.is_location?
              field = nil
            end
          end
        end
      end
      return field
    end

    #This allows us to use the property 'type' on Field, normally reserved by ActiveRecord
    def inheritance_column ; 'type_inheritance' ; end

    def find_with_append_only_subform
      Field.joins(:subform).where({ type: 'subform', form_sections: { subform_append_only: true, is_nested: true } })
    end

    alias super_import import
    def import(data, form)
      data.each do |field|
        field['subform_section_id'] = FormSection.find_by(unique_id: field['subform_section_id']).id if field['subform_section_id'].present?
        field['form_section_id'] = form.id
        super_import(field)
      end
    end
  end

  def export
    self.attributes.tap do |form|
      form.delete('id')
      form['form_section_id'] = self.form_section.unique_id
      form['subform_section_id'] = self.subform.unique_id if self.subform.present?
    end
  end

  def merge_with(another_field)

  end

  def options_list(record=nil, lookups=nil, locations=nil, add_lookups=nil, opts={}, reporting_locations=nil)
    locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
    options_list = []
    if self.type == Field::TICK_BOX
      options_list << {id: 'true', display_text: I18n.t('true')}
      options_list << {id: 'false', display_text: I18n.t('false')}
    elsif self.option_strings_source.present?
      source_options = self.option_strings_source.split
      #TODO - PRIMERO - need to refactor, see if there is a way to not have incident specific logic in field
      #       Bad smell: really we need this to be generic for any kind of lookup for any kind of class

      # TODO: This will have to be refactored as we move more of these to the /source_options endpoint. JT
      case source_options.first
      when 'violations'
        if record.present? && record.class == Incident
          options_list = record.violations_list_by_unique_id.map{|k,v| {'id' => v, 'display_text' => k}}
        end
      when 'lookup'
        options_list += Lookup.values(source_options.last, lookups, locale: locale) if add_lookups.present?
      when 'Location'
        options_list += locations || [] if locations.present?
      when 'ReportingLocation'
        options_list += reporting_locations || [] if reporting_locations.present?
      when 'User'
        options_list += []
      else
        #TODO: Might want to optimize this (cache per request) if we are repeating our types (locations perhaps!)
        clazz = Kernel.const_get(source_options.first) #TODO: hoping this guy exists and is a class!
        options_list += clazz.all_names
      end
    else
      options_list += (self.option_strings_text.present? ? display_option_strings(locale) : [])
    end
    return options_list
  end

  #Use the current locale's options only if its display text is present.
  #Else use the default locale's options
  def display_option_strings(current_locale)
    locale_options = self.option_strings_text(current_locale)
    return locale_options if locale_options.any?{|op| op['display_text'].present?}
    return self.option_strings_text_en
  end

  def convert_true_false_key_to_string(value)
    case value
      when true
        'true'
      when false
        'false'
      else
        nil
    end
  end

  def display_text(value = nil, lookups = nil, locale = nil)
    locale ||= I18n.locale
    value = convert_true_false_key_to_string(value) if is_yes_no?
    if type == Field::TICK_BOX
      selected_option = options_list.select { |ol| ol[:id] == value.to_s }.first
      selected_option.present? ? selected_option[:display_text] : value
    elsif option_strings_text.present?
      display = option_strings_text.select { |opt| opt['id'] == value }
      # TODO: Is it better to display the untranslated key or to display nothing?
      display.present? ? display.first['display_text'] : ''
    elsif option_strings_source.present?
      source_options = option_strings_source.split
      # TODO: pass in locations and agencies
      case source_options.first
      when 'lookup'
        display = Lookup.values(source_options.last, lookups, locale: locale).select { |opt| opt['id'] == value }
        display.present? ? display.first['display_text'] : ''
      when 'Location', 'ReportingLocation'
        Location.display_text(value, locale: locale)
      when 'Agency'
        Agency.display_text(value, locale: locale)
      else
        value
      end
    else
      value
    end
  end

  def default_value
    case self.type
    when TEXT_FIELD, TEXT_AREA, RADIO_BUTTON, SELECT_BOX, DATE_FIELD, DATE_RANGE, NUMERIC_FIELD, TALLY_FIELD
      ''
    when PHOTO_UPLOAD_BOX, AUDIO_UPLOAD_BOX, DOCUMENT_UPLOAD_BOX, SUBFORM
      nil
    when TICK_BOX
      'false'
    else
      raise I18n.t('errors.models.field.default_value') + type unless DEFAULT_VALUES.has_key? type
    end
  end

  #TODO: Refactor with UIUX
  def tag_name_attribute(objName = 'child')
    "#{objName}[#{name}]"
  end

  def subform_group_by_field
    # TODO: This is an extra DB query
    if self.type == SUBFORM && self.subform_group_by.present?
      unless @subform_group_by_field.present?
        @subform_group_by_field = subform_section.joins(:fields)
          .where(fields: {name: self.subform_group_by, type: [ Field::RADIO_BUTTON, Field::SELECT_BOX] })
          .first
      end
    end
    return @subform_group_by_field
  end

  def subform_group_by_values
    subform_group_by_values = {}
    subform_group_by_field = self.subform_group_by_field
    if subform_group_by_field.present?
      subform_group_by_values = subform_group_by_field.options_list(nil,nil,nil,true).map do |o|
        [o['id'], o['display_text']]
      end.to_h
    end
    return subform_group_by_values
  end


  def localized_attributes_hash(locales, lookups=nil, locations=nil)
    field_hash = self.attributes.clone
    Field.localized_properties.each do |property|
      field_hash[property] = {}
      key = "#{property.to_s}_i18n"
      Primero::Application::locales.each do |locale|
        if property == :option_strings_text
          #value = field.options_list(@lookups) #TODO: This includes Locations. Imagine a situation with 4K locations, like Nepal?
          value = self.options_list(nil, lookups, locations)
        elsif  field_hash[key].present?
          value = field_hash[key][locale]
        else
          value = ''
        end
        field_hash[property][locale] = value if locales.include? locale
      end
      field_hash.delete(key)
    end
    field_hash
  end

  #TODO: Delete after UIUX refactor
  def searchable_select
    if self.option_strings_source == 'Location' && !multi_select
      true
    end
  end

  #TODO: Delete after refactor of Record
  def create_property ; true ; end

  def selectable?
    self.option_strings_source.present? || self.option_strings_text.present?
  end

  # Whether or not this should display on the show/view pages
  # Should not affect the new/edit pages
  def showable?
    self.visible? && !self.hide_on_view_page
  end

  def is_location?
    self.option_strings_source == 'Location'
  end

  def is_yes_no?
    self.option_strings_source == 'lookup lookup-yes-no' || self.option_strings_source == 'lookup lookup-yes-no-unknown'
  end

  def is_mobile?
    self.mobile_visible == true && self.visible == true
  end

  def is_multi_select?
    self.type.eql?(SELECT_BOX) && self.multi_select
  end

  #TODO add rspec test
  def generate_options_keys
    if self.option_strings_text.present?
      self.option_strings_text.each do |option|
        if option.is_a?(Hash) && option['id'].blank? && option['display_text'].present?
          option['id'] = option['display_text'].parameterize.underscore + '_' + rand.to_s[2..6]
        end
      end

      #DOes the same thing for the other languages...
      Primero::Application::locales.each do |locale|
        option_strings_locale = self.option_strings_text(locale)
        if locale != Primero::Application::BASE_LANGUAGE && option_strings_locale.present?
          self.option_strings_text(locale).each_with_index do |option, index|
            if option.is_a?(Hash) && option['id'].blank? && option['display_text'].present?
              option['id'] = self.option_strings_text[index]['id']
            end
          end
        end
      end
    end
  end

  def sync_options_keys
    if self.option_strings_text.present? && self.option_strings_text.is_a?(Array) && self.option_strings_text.first.is_a?(Hash)
      #Do not create any new option strings that do not have a matching lookup value in the default language
      default_ids = self.option_strings_text_en.try(:map){|op| op['id']}
      if default_ids.present?
        Primero::Application::locales.each do |locale|
          next if locale == Primero::Application::BASE_LANGUAGE
          self.option_strings_text(locale).try(:reject!){|op| default_ids.exclude?(op['id'])}
        end
      end
    end
  end

  def update_translations(field_hash={}, locale)
    if locale.present? && Primero::Application::locales.include?(locale)
      field_hash.each do |key, value|
        if key == 'option_strings_text'
          if self.option_strings_text.present?
            update_option_strings_translations(value, locale)
          else
            Rails.logger.warn "Field #{self.name} no longer has embedded option strings. Skipping."
          end
        else
          self.send("#{key}_#{locale}=", value)
        end
      end
    else
      Rails.logger.error "Field translation not updated: Invalid locale [#{locale}]"
    end
  end

  def self.binary_fields
    Field.where(type: [Field::PHOTO_UPLOAD_BOX, Field::AUDIO_UPLOAD_BOX, Field::DOCUMENT_UPLOAD_BOX])
  end

  private

  def validate_unique_name
    #TODO: Consider moving this logic to FormSection for performance reasons
    return true unless self.form_section_id.present? #TODO: This line might not be necessary for AR
    if (Field.where(name: self.name, form_section_id: self.form_section_id).where.not(id: self.id).any?)
      return errors.add(:name, I18n.t('errors.models.field.unique_name_this'))
    end
    true
  end

  def valid_tally_field
    if self.type == TALLY_FIELD
      self.autosum_group = "#{self.name}_number_of" unless self.autosum_group.present?
      self.autosum_total ||= true
    end
    true
  end

  #TODO: We are moving this code back to the Field. It was on the FormSection for performance reasons
  def validate_datatypes
    #Assuming that the same field name can't appear on different record types
    same_name_fields = Field.joins(:form_section).where(name: self.name, form_sections: {is_nested: false})
    same_name_fields.each do |same_name_field|
      this_type = [self.type, self.multi_select]
      same_name_type = [same_name_field.type, same_name_field.multi_select]
      if this_type == same_name_type
        next if changing_between_text_field_and_textarea?(current_type.first, same_name_type.first)
        errors.add(:fields, I18n.t('errors.models.field.change_type_existing_field', field_name: self.name, form_name: self.form_section.name))
        return false
      end
    end
  end

  def changing_between_text_field_and_textarea?(current_type, new_type)
    [TEXT_FIELD, TEXT_AREA].include?(current_type) && [TEXT_FIELD, TEXT_AREA].include?(new_type)
  end

  def update_option_strings_translations(options_hash, locale)
    options = (self.send("option_strings_text_#{locale}").present? ? self.send("option_strings_text_#{locale}") : [])
    options_hash.each do |key, value|
      os = options.try(:find){|os| os['id'] == key}
      if os.present?
        os['display_text'] = value
      else
        options << {'id' => key, 'display_text' => value}
      end
    end
    self.send("option_strings_text_#{locale}=", options)
    self.save!
  end

end
