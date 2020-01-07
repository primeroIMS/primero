class Field
  include CouchRest::Model::CastedModel
  include PrimeroModel
  include LocalizableProperty
  include Memoizable

  property :name
  property :visible, TrueClass, :default => true
  property :mobile_visible, TrueClass, :default => true
  property :hide_on_view_page, TrueClass, :default => false
  property :show_on_minify_form, TrueClass, :default => false
  property :type
  property :highlight_information , HighlightInformation
  property :editable, TrueClass, :default => true
  property :deletable, TrueClass, :default => true
  property :disabled, TrueClass, :default => false
  localize_properties [:display_name, :help_text, :guiding_questions, :tally, :tick_box_label, :upload_document_help_text]
  localize_properties [:option_strings_text], generate_keys: true
  property :multi_select, TrueClass, :default => false
  property :hidden_text_field, TrueClass, :default => false
  attr_reader :options
  property :option_strings_source  #If options are dynamic, this is where to fetch them
  property :base_language, :default => FormSection::DEFAULT_BASE_LANGUAGE
  property :subform_section_id
  property :autosum_total, TrueClass, :default => false
  property :autosum_group, :default => ""
  property :selected_value, :default => ""
  property :create_property, TrueClass, :default => true
  property :searchable_select, TrueClass, :default => false
  property :link_to_path, :default => ""  #Used to handle a text field as a link on the show pages
  property :link_to_path_external, TrueClass, :default => true
  property :field_tags, [String], :default => []
  property :custom_template, :default => nil #Custom type should set the path to the template.
  property :expose_unique_id, TrueClass, :default => false
  property :subform_sort_by
  property :subform_group_by
  property :required, TrueClass, :default => false
  property :date_validation, :default => 'default_date_validation'
  property :date_include_time, TrueClass, :default => false
  property :matchable, TrueClass, :default => false
  property :upload_document_type, :default => 'document'

  DATE_VALIDATION_OPTIONS = [ 'default_date_validation', 'not_future_date' ]

  attr_accessor :subform

  TEXT_FIELD = "text_field"
  TEXT_AREA = "textarea"
  RADIO_BUTTON = "radio_button"
  SELECT_BOX = "select_box"
  NUMERIC_FIELD = "numeric_field"
  PHOTO_UPLOAD_BOX = "photo_upload_box"
  AUDIO_UPLOAD_BOX = "audio_upload_box"
  DOCUMENT_UPLOAD_BOX = "document_upload_box"
  DATE_FIELD = "date_field"
  DATE_RANGE = "date_range"
  SUBFORM = "subform"
  SEPARATOR = "separator"
  TICK_BOX = "tick_box"
  TALLY_FIELD = "tally_field"
  CUSTOM = "custom"

  FIELD_FORM_TYPES = {  TEXT_FIELD       => "basic",
                        TEXT_AREA        => "basic",
                        RADIO_BUTTON     => "multiple_choice",
                        SELECT_BOX       => "multiple_choice",
                        PHOTO_UPLOAD_BOX => "basic",
                        AUDIO_UPLOAD_BOX => "basic",
                        DOCUMENT_UPLOAD_BOX => "basic",
                        DATE_FIELD       => "basic",
                        DATE_RANGE       => "basic",
                        NUMERIC_FIELD    => "basic",
                        SUBFORM          => "subform",
                        SEPARATOR        => "separator",
                        TICK_BOX         => "basic",
                        TALLY_FIELD      => "tally_field",
                        CUSTOM           => "custom"
                      }
  FIELD_DISPLAY_TYPES = {
												TEXT_FIELD       => "basic",
                        TEXT_AREA        => "basic",
                        RADIO_BUTTON     => "basic",
                        SELECT_BOX       => "basic",
                        PHOTO_UPLOAD_BOX => "photo",
                        AUDIO_UPLOAD_BOX => "audio",
                        DOCUMENT_UPLOAD_BOX => "document",
                        DATE_FIELD       => "basic",
                        DATE_RANGE       => "range",
                        NUMERIC_FIELD    => "basic",
                        SUBFORM          => "subform",
                        SEPARATOR        => "separator",
                        TICK_BOX         => "tick_box",
                        TALLY_FIELD      => "tally_field",
                        CUSTOM           => "custom"
                      }

  DEFAULT_VALUES = {
                        TEXT_FIELD       => "",
                        TEXT_AREA        => "",
                        RADIO_BUTTON     => "",
                        SELECT_BOX       => "",
                        PHOTO_UPLOAD_BOX => nil,
                        AUDIO_UPLOAD_BOX => nil,
                        DOCUMENT_UPLOAD_BOX => nil,
                        DATE_FIELD       => "",
                        DATE_RANGE       => "",
                        NUMERIC_FIELD    => "",
                        SUBFORM          => nil,
                        TICK_BOX         => "false",
                        TALLY_FIELD      => ""
                      }

  validate :validate_unique_name
  validate :validate_has_2_options
  validate :validate_display_name_format
  validate :validate_name_format
  validate :validate_display_name_in_base_language
  validate :valid_tally_field
  validate :validate_option_strings_text
  #TODO: Any subform validations?

  def localized_property_hash(locale=FormSection::DEFAULT_BASE_LANGUAGE)
    lh = localized_hash(locale)
    if self.option_strings_text.present?
      fh = {}
      self["option_strings_text_#{locale}"].each{|os| fh[os['id']] = os['display_text']}
      lh['option_strings_text'] = fh
    end
    lh
  end

  def validate_display_name_format
    special_characters = /[*!@#%$\^]/
    white_spaces = /^(\s+)$/
    if (display_name =~ special_characters) || (display_name =~ white_spaces)
      errors.add(:display_name, I18n.t("errors.models.field.display_name_format"))
      return false
    else
      return true
    end
  end

  #Only allow name to have lower case alpha, numbers and underscore
  def validate_name_format
    if name.blank?
      errors.add(:name, I18n.t("errors.models.field.name_presence"))
      return false
    elsif name =~ /[^a-z0-9_]/
      errors.add(:name, I18n.t("errors.models.field.name_format"))
      return false
    elsif name =~ /^\d/
      errors.add(:name, I18n.t("errors.models.field.name_format_number_first"))
      return false
    else
      return true
    end
  end

  def validate_display_name_in_base_language
    display_name = "display_name_#{FormSection::DEFAULT_BASE_LANGUAGE}"
    unless (self.send(display_name).present?)
      errors.add(:display_name, I18n.t("errors.models.field.display_name_presence"))
      return false
    end
  end

  def validate_option_strings_text
    base_options = self.send("option_strings_text_#{base_language}")
    if base_options.blank?
      #If base options are blank, then all translated options should also be blank
      if Primero::Application::locales.any? {|locale| self.send("option_strings_text_#{locale}").present?}
        errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.translations_not_empty"))
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
    default_ids = self.send("option_strings_text_#{base_language}").try(:map){|op| op['id']}
    Primero::Application::locales.each do |locale|
      next if locale == base_language
      options = self.send("option_strings_text_#{locale}")
      next if options.blank?
      return false unless valid_option_strings?(options, false)
      return false unless option_keys_match?(default_ids, options)
    end
    return true
  end

  def valid_option_strings?(options, is_base_language=true)
    unless options.is_a?(Array)
      errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.not_array"))
      return false
    end

    options.each {|option| return false unless valid_option?(option, is_base_language)}
    return true
  end

  def valid_option?(option, is_base_language=true)
    unless option.is_a?(Hash)
      errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.not_hash"))
      return false
    end

    if option['id'].blank?
      errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.id_blank"))
      return false
    end

    if is_base_language && option['display_text'].blank?
      errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.display_text_blank"))
      return false
    end
    return true
  end

  def option_keys_match?(default_ids, options)
    locale_ids = options.try(:map){|op| op['id']}
    if ((default_ids - locale_ids).present? || (locale_ids - default_ids).present?)
      errors.add(:option_strings_text, I18n.t("errors.models.field.translated_options_do_not_match"))
      return false
    end
    return true
  end

  def options_keys_unique?(options)
    unless options.map{|o| o['id']}.uniq.length == options.map{|o| o['id']}.length
      errors.add(:option_strings_text, I18n.t("errors.models.field.option_strings_text.id_not_unique"))
      return false
    end
    return true
  end

  def form
    base_doc
  end

  def subform_section
    if (self.subform.blank? && self.subform_section_id.present?)
      self.subform = FormSection.get_by_unique_id(subform_section_id)
    end
    return self.subform
  end

  def form_type
    FIELD_FORM_TYPES[type]
  end

	def display_type
		FIELD_DISPLAY_TYPES[type]
	end

  #DB field cannot be created such that its has anything but lower case alpha, numbers and underscores
  def sanitize_name
    if self.name.present?
      self.name = self.name.gsub(/[^A-Za-z0-9_ ]/, '').parameterize.underscore
    elsif self.display_name.present?
      self.name = self.display_name.gsub(/[^A-Za-z0-9 ]/, '').parameterize.underscore
    end
  end


  class << self

    # TODO: Refactor this - Slow when you rebuild a form
    def all_searchable_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_fields.map(&:name) }.flatten
    end

    def all_searchable_date_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_date_fields.map(&:name) }.flatten
    end

    def all_searchable_date_time_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_date_time_fields.map(&:name) }.flatten
    end

    def all_searchable_boolean_field_names(parent_form='case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_boolean_fields.map(&:name) }.flatten
    end

    def all_filterable_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_fields.map(&:name) }.flatten
    end

    def all_filterable_multi_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_multi_fields.map(&:name) }.flatten
    end

    def all_filterable_numeric_field_names(parent_form = 'case')
      FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_numeric_fields.map(&:name) }.flatten
    end

    def all_tally_fields(parent_form='case')
      FormSection.find_by_parent_form(parent_form, false).map {|form| form.all_tally_fields.map(&:name)}.flatten
    end

    def all_location_field_names(parent_form='case')
      FormSection.find_locations_by_parent_form(parent_form).map {|form| form.all_location_fields.map(&:name)}.flatten.uniq
    end

    # This is a rework of the original RapidFTR method that never worked.
    # It depends on a 'fields' view existing on the FormSection that indexes the fields out of the FormSection.
    # TODO: This has been renamed to allow a hack to wrap it
    def find_by_name_from_view(name)
      result = nil
      if name.is_a? Array
        raw_field_data = FormSection.fields(keys: name).rows
        result = raw_field_data.map{|rf| Field.new(rf['value'])}
      else
        raw_field_data = FormSection.fields(key: name).rows.first
        result = Field.new(raw_field_data['value']) if raw_field_data.present?
      end
      return result
    end
    memoize_in_prod :find_by_name_from_view

    #TODO: This is a HACK to pull back location fields from admin solr index names,
    #      completely based on assumptions.
    #      Also it's inefficient, and potentially inconsistent with itself
    #      What this is attempting to do:  If this is a location field, it may have the admin_level appended to it
    #                                      If so, strip off the admin_level so find_by_name_from_view will find something
    def find_by_name(field_name)
      return nil if field_name.blank?
      field_keys = nil
      if field_name.kind_of?(Array)
        field_keys = field_name.map{|f| (f.match(".*(\\d)+") && find_by_name_from_view(f).blank?) ? f.gsub(/ *\d+$/, '') : f}
      elsif field_name.kind_of?(String)
        field_keys = (field_name.match(".*(\\d)+") && find_by_name_from_view(field_name).blank?) ? field_name.gsub(/ *\d+$/, '') : field_name
      end
      return nil if field_keys.blank?
      find_by_name_from_view(field_keys)
    end

  end


  def display_name_for_field_selector
    hidden_text = self.visible? ? "" : " (Hidden)"
    "#{display_name}#{hidden_text}"
  end

  #TODO: Use CouchRest Model property defaults here instead
  #TODO: Testing from console shows the property defaults aren't working for this Field model making these initialize setters necessary
  #TODO: Dig deeper to determine why defaults are not working
  def initialize(properties={})
    self.visible = true if properties["visible"].nil?
    self.mobile_visible = true if properties["mobile_visible"].nil?
    self.highlight_information = HighlightInformation.new
    self.editable = true if properties["editable"].nil?
    self.deletable = true if properties["deletable"].nil?
    self.disabled = false if properties["disabled"].nil?
    self.multi_select = false if properties["multi_select"].nil?
    self.required = false if properties["required"].nil?
    self.show_on_minify_form = false if properties["show_on_minify_form"].nil?
    self.hidden_text_field ||= false
    self.autosum_total ||= false
    self.autosum_group ||= ""
    self.create_property ||= true
    self.hide_on_view_page ||= false
    self.attributes = properties
    self.base_language = FormSection::DEFAULT_BASE_LANGUAGE
  end

  def attributes= properties
    super properties
    #TODO: FieldOption should just be a regular embedded object that CouchRest Model supports
    @options = (option_strings_text.present? ? FieldOption.create_field_options(name, option_strings_text) : [])
  end

  def options_list(record=nil, lookups=nil, locations=nil, add_lookups=nil, opts={}, reporting_locations=nil)
    locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
    options_list = []
    if self.type == Field::TICK_BOX
      options_list << {id: 'true', display_text: I18n.t('true')}.with_indifferent_access
      options_list << {id: 'false', display_text: I18n.t('false')}.with_indifferent_access
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
      when 'Agency'
        # If the Agency field is marked to be empty is probably because we're gonna populate it through PopulateAgencySelectBoxes script
        options_list +=  source_options[1] == 'use_api' ? [] : Agency.all_names
      else
        #TODO: Might want to optimize this (cache per request) if we are repeating our types (locations perhaps!)
        clazz = Kernel.const_get(source_options.first) #TODO: hoping this guy exists and is a class!
        options_list += clazz.try(:all_names) || []
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
    return self.option_strings_text(base_language)
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

  def display_text(value=nil, lookups = nil)
    value = self.convert_true_false_key_to_string(value) if self.is_yes_no?
    if self.type == Field::TICK_BOX
      selected_option = self.options_list.select{|ol| ol[:id] == value.to_s}.first
      value = selected_option.present? ? selected_option[:display_text] : value
    elsif self.option_strings_text.present?
      display = self.option_strings_text.select{|opt| opt['id'] == value}
      #TODO: Is it better to display the untranslated key or to display nothing?
      value = (display.present? ? display.first['display_text'] : '')
    elsif self.option_strings_source.present?
      source_options = self.option_strings_source.split
      #TODO pass in locations and agencies
      case source_options.first
        when 'lookup'
          display = Lookup.values(source_options.last, lookups, locale: I18n.locale).select{|opt| opt['id'] == value}
          value = (display.present? ? display.first['display_text'] : '')
        when 'Location', 'ReportingLocation'
          value = Location.display_text(value, locale: I18n.locale)
        when 'Agency'
          value = Agency.display_text(value, locale: I18n.locale)
        else
          value
      end
    else
      value
    end
  end

  def default_value
    raise I18n.t("errors.models.field.default_value") + type unless DEFAULT_VALUES.has_key? type
    return DEFAULT_VALUES[type]
  end

  def tag_id
    "child_#{name}"
  end

  def tag_name_attribute(objName = "child")
    "#{objName}[#{name}]"
  end

  def subform_group_by_field
    # This is an extra DB query, but should be fine on record edit/show pages
    # where the subforms are pre-linked
    if self.type == SUBFORM && self.subform_group_by.present?
      unless @subform_group_by_field.present?
        subform = self.subform_section
        if subform.present?
          @subform_group_by_field = subform.fields.select{|f|
            (f.name == self.subform_group_by) && f.selectable?
          }.first
        end
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
      Primero::Application::locales.each do |locale|
        key = "#{property.to_s}_#{locale}"
        value = field_hash[key]
        if property == :option_strings_text
          #value = field.options_list(@lookups) #TODO: This includes Locations. Imagine a situation with 4K locations, like Nepal?
          value = self.options_list(nil, lookups, locations)
        elsif field_hash[key].nil?
          value = ""
        end
        field_hash[property][locale] = value if locales.include? locale
        field_hash.delete(key)
      end
    end
    field_hash
  end

  def is_highlighted?
      highlight_information[:highlighted]
  end

  def highlight_with_order order
      highlight_information[:highlighted] = true
      highlight_information[:order] = order
  end

  def unhighlight
    self.highlight_information = HighlightInformation.new
  end

  def searchable_select
    if self.option_strings_source == 'Location' && !multi_select
      true
    end
  end

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

  #TODO add rspec test
  def generate_options_keys
    if self.option_strings_text.present?
      self.option_strings_text.each do |option|
        if option.is_a?(Hash) && option['id'].blank? && option['display_text'].present?
          option['id'] = option['display_text'].parameterize.underscore + '_' + rand.to_s[2..6]
        end
      end

      Primero::Application::locales.each do |locale|
        option_strings_locale = self.send("option_strings_text_#{locale}")
        if locale != Primero::Application::LOCALE_ENGLISH && option_strings_locale.present?
          self.send("option_strings_text_#{locale}").each_with_index do |option, index|
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
      default_ids = self.send("option_strings_text_#{base_language}").try(:map){|op| op['id']}
      if default_ids.present?
        Primero::Application::locales.each do |locale|
          next if locale == base_language
          self.send("option_strings_text_#{locale}").try(:reject!){|op| default_ids.exclude?(op['id'])}
        end
      end
    end
  end

  def is_mobile?
    self.mobile_visible == true && self.visible == true
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

  private

  def create_unique_id
    self.name = UUIDTools::UUID.timestamp_create.to_s.split('-').first if self.name.nil?
  end

  def validate_has_2_options
    return true unless (type == RADIO_BUTTON || type == SELECT_BOX)
    return errors.add(:option_strings, I18n.t("errors.models.field.has_2_options")) if option_strings_source.blank? && (option_strings_text.blank? || option_strings_text.length < 2)
    true
  end

  def validate_unique_name
    return true unless form
    if (form.fields.any? {|field| !field.equal?(self) && field.name == name})
      return errors.add(:name, I18n.t("errors.models.field.unique_name_this"))
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
  end

end
