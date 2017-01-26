class Field
  include CouchRest::Model::CastedModel
  include PrimeroModel
  include LocalizableProperty

  property :name
  property :visible, TrueClass, :default => true
  property :mobile_visible, TrueClass, :default => true
  property :hide_on_view_page, TrueClass, :default => false
  property :show_on_minify_form, TrueClass, :default => false
  property :type
  property :highlight_information , HighlightInformation
  property :editable, TrueClass, :default => true
  property :disabled, TrueClass, :default => false
  localize_properties [:display_name, :help_text, :guiding_questions, :tally, :tick_box_label]
  localize_properties [:option_strings_text], generate_keys: true
  property :multi_select, TrueClass, :default => false
  property :hidden_text_field, TrueClass, :default => false
  attr_reader :options
  property :option_strings_source  #If options are dynamic, this is where to fetch them
  property :base_language, :default=>'en'
  property :subform_section_id
  property :autosum_total, TrueClass, :default => false
  property :autosum_group, :default => ""
  property :selected_value, :default => ""
  property :create_property, TrueClass, :default => true
  property :searchable_select, TrueClass, :default => false
  property :link_to_path, :default => ""  #Used to handle a text field as a link on the show pages
  property :field_tags, [String], :default => []
  property :custom_template, :default => nil #Custom type should set the path to the template.
  property :expose_unique_id, TrueClass, :default => false
  property :subform_sort_by
  property :required, TrueClass, :default => false
  property :date_validation, :default => 'default_date_validation'
  property :matchable, TrueClass, :default => false

  DATE_VALIDATION_OPTIONS = [ 'default_date_validation', 'not_future_date' ]

  attr_accessor :subform

  TEXT_FIELD = "text_field"
  TEXT_AREA = "textarea"
  RADIO_BUTTON = "radio_button"
  SELECT_BOX = "select_box"
  CHECK_BOXES = "check_boxes"
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
                        CHECK_BOXES      => "multiple_choice",
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
                        CHECK_BOXES      => "basic",
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
                        CHECK_BOXES      => [],
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

  validates_presence_of "display_name_#{I18n.default_locale}", :message=> I18n.t("errors.models.field.display_name_presence")
  validate :validate_unique_name
  validate :validate_unique_display_name
  validate :validate_has_2_options
  validate :validate_has_a_option
  validate :validate_display_name_format
  validate :validate_name_format
  validate :valid_presence_of_base_language_name
  validate :valid_tally_field
  validate :validate_same_datatype

  #TODO: Any subform validations?

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

  def valid_presence_of_base_language_name
    if base_language==nil
      self.base_language='en'
    end
    base_lang_display_name = self.send("display_name_#{base_language}")
    if (base_lang_display_name.nil?||base_lang_display_name.empty?)
      errors.add(:display_name, I18n.t("errors.models.form_section.presence_of_base_language_name", :base_language => base_language))
    end
  end

  def form
    base_doc
  end

  def subform_section
    if (not self.subform and self.subform_section_id.present?)
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

  # TODO: Refator this - Slow when you rebuild a form
  def self.all_searchable_field_names(parent_form = 'case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_fields.map(&:name) }.flatten
  end

  def self.all_searchable_date_field_names(parent_form = 'case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_date_fields.map(&:name) }.flatten
  end

  def self.all_searchable_boolean_field_names(parent_form='case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_searchable_boolean_fields.map(&:name) }.flatten
  end

  def self.all_filterable_field_names(parent_form = 'case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_fields.map(&:name) }.flatten
  end

  def self.all_filterable_multi_field_names(parent_form = 'case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_multi_fields.map(&:name) }.flatten
  end

  def self.all_filterable_numeric_field_names(parent_form = 'case')
    FormSection.find_by_parent_form(parent_form, false).map { |form| form.all_filterable_numeric_fields.map(&:name) }.flatten
  end

  def self.all_tally_fields(parent_form='case')
    FormSection.find_by_parent_form(parent_form, false).map {|form| form.all_tally_fields.map(&:name)}.flatten
  end

  def self.all_location_field_names(parent_form='case')
    FormSection.find_locations_by_parent_form(parent_form).map {|form| form.all_location_fields.map(&:name)}.flatten.uniq
  end

  def display_name_for_field_selector
    hidden_text = self.visible? ? "" : " (Hidden)"
    "#{display_name}#{hidden_text}"
  end

  def initialize properties={}
    self.visible = true if properties["visible"].nil?
    self.mobile_visible = true if properties["mobile_visible"].nil?
    self.highlight_information = HighlightInformation.new
    self.editable = true if properties["editable"].nil?
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
  end

  def attributes= properties
    super properties
    if (option_strings)
      @options = FieldOption.create_field_options(name, option_strings)
    end
  end

  def option_strings= value
    if value
      value = value.gsub(/\r\n?/, "\n").split("\n") if value.is_a?(String)
      self.option_strings_text = value.select {|x| not "#{x}".strip.empty? }.map(&:rstrip).join("\n")
    end
  end

  def option_strings
    return [] unless self.option_strings_text
    return self.option_strings_text if self.option_strings_text.is_a?(Array)
    self.option_strings_text.gsub(/\r\n?/, "\n").split("\n")
  end

  #TODO: Eventually, this method should be the ultimate list of options for this field.
  #      Any HTML form-specific formatting should take place ina helper.
  def options_list(record=nil, lookups=nil, locations=nil)
    options_list = []

    if self.option_strings_source.present?
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
        options_list += Lookup.values(source_options.last.titleize, lookups)
        if source_options.second == 'group'
          #TODO: What about I18n? What is this?
          options_list += ['Other', 'Mixed', 'Unknown']
        end
      when 'Location'
        options_list += locations || [] if locations.present?
      else
        #TODO: Might want to optimize this (cache per request) if we are repeating our types (locations perhaps!)
        clazz = Kernel.const_get(source_options.first) #TODO: hoping this guy exists and is a class!
        options_list += clazz.all.map{|r| r.name}
      end
    else
      options_list += self.option_strings
    end
    return options_list
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


  #TODO: This should be merged with options_list above. Any HTML form specific stuff shoudl be moved to a helper
  def select_options(record=nil, lookups=nil)
    select_options = []
    if self.type == TICK_BOX
      select_options = [[I18n.t('true'), 'true'], [I18n.t('false'), 'false']]
    else
      select_options << [I18n.t("fields.select_box_empty_item"), ''] unless self.multi_select
      select_options += options_list(record, lookups).map do |option|
        if option.is_a? Hash
          [option['display_text'], option['id']]
        else
          [option, option]
        end
      end
    end
    return select_options
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


  #TODO - remove this is just for testing
  def self.new_field(type, name, options=[])
    Field.new :type => type, :name => name.dehumanize, :display_name => name.humanize, :visible => true, :option_strings_text => options.join("\n"), :editable => true, :disabled => false
  end

  def self.new_check_boxes_field field_name, display_name = nil, option_strings = []
    Field.new :name => field_name, :display_name=>display_name, :type => CHECK_BOXES, :visible => true, :option_strings_text => option_strings.join("\n")
  end

  def self.new_text_field field_name, display_name = nil
    field = Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => TEXT_FIELD
  end

  def self.new_textarea field_name, display_name = nil
    Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => TEXT_AREA
  end

  def self.new_photo_upload_box field_name, display_name  = nil
    Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => PHOTO_UPLOAD_BOX
  end

  def self.new_audio_upload_box field_name, display_name = nil
    Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => AUDIO_UPLOAD_BOX
  end

  def self.new_radio_button field_name, option_strings, display_name = nil
    Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => RADIO_BUTTON, :option_strings_text => option_strings.join("\n")
  end

  def self.new_select_box field_name, option_strings, display_name = nil
    Field.new :name => field_name, :display_name=>display_name||field_name.humanize, :type => SELECT_BOX, :option_strings_text => option_strings.join("\n")
  end

  # This is a rework of the original RapidFTR method that never worked.
  # It depends on a 'fields' view existing on the FormSection that indexes the fields out of the FormSection.
  # TODO: This has been renamed to allow a hack to wrap it
  def self.find_by_name_from_view(name)
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

  #TODO: This is a HACK to pull back location fields from admin solr index names, 
  #      completely based on assumptions.
  def self.find_by_name(field_name)
    field = nil
    if field_name.present?
      field = find_by_name_from_view(field_name)
      unless field.present?
        if field_name.last.is_number? && field_name.length > 1
          field = find_by_name_from_view(field_name[0..-2])
          unless field.present? && field.is_location?
            field = nil
          end
        end
      end
    end
    return field
  end


  # Whether or not this should display on the show/view pages
  # Should not affect the new/edit pages
  def showable?
    self.visible? && !self.hide_on_view_page
  end

  def is_location?
    self.option_strings_source == 'Location'
  end

  private

  def create_unique_id
    self.name = UUIDTools::UUID.timestamp_create.to_s.split('-').first if self.name.nil?
  end

  def validate_has_2_options
    return true unless (type == RADIO_BUTTON || type == SELECT_BOX)
    return errors.add(:option_strings, I18n.t("errors.models.field.has_2_options")) if option_strings_source.blank? && (option_strings == nil || option_strings.length < 2)
    true
  end

  def validate_has_a_option
    return true unless (type == CHECK_BOXES)
    return errors.add(:option_strings, I18n.t("errors.models.field.has_1_option")) if option_strings == nil || option_strings.length < 1
    true
  end

  def validate_unique_name
    #Does not make sense use new? for validity ?
    #it is perfectly valid FormSection.new(...) then add several field then save and
    #the validation should work rejecting the duplicate fields.
    #Also with new? still possible duplicate things for example change the
    #name/display_name for existing fields.
    #What we really need is avoid check the field with itself.
    #return true unless new? && form
    return true unless form
    #return errors.add(:name, I18n.t("errors.models.field.unique_name_this")) if (form.fields.any? {|field| !field.new? && field.name == name})
    return errors.add(:name, I18n.t("errors.models.field.unique_name_this")) if (form.fields.any? {|field| !field.equal?(self) && field.name == name})
    # other_form = FormSection.get_form_containing_field name
    # return errors.add(:name, I18n.t("errors.models.field.unique_name_other", :form_name => other_form.name)) if (other_form != nil && form.id != other_form.id && self.form.is_nested)
    true
  end

  def validate_unique_display_name
    #See comment at validate_unique_name.
    #return true unless new? && form
    return true unless form
    #return errors.add(:display_name, I18n.t("errors.models.field.unique_name_this")) if (form.fields.any? {|field| !field.new? && field.display_name == display_name})
    return errors.add(:display_name, I18n.t("errors.models.field.unique_name_this")) if (form.fields.any? {|field| !field.equal?(self) && field.display_name == display_name})
    true
  end

  def valid_tally_field
    if self.type == TALLY_FIELD
      self.autosum_group = "#{self.name}_number_of" unless self.autosum_group.present?
      self.autosum_total ||= true
    end
    true
  end

  def validate_same_datatype
    #Find field with the same name.
    fields = FormSection.get_fields_by_name_and_parent_form(name, form.parent_form, false)
    #Check if the types are the same.
    fields = fields.select{|field| field.type != type}
    #Error if the type is different.
    return errors.add(:name, I18n.t("errors.models.field.change_type_existing_field", :form_name => fields.first.form.name)) if fields.present?
    #We are OK - All the fields with the same name are consistent with the type.
    true
  end

end
