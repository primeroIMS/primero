require 'forms_to_properties'

module Record
  extend ActiveSupport::Concern

  require "uuidtools"
  include PrimeroModel
  include Extensions::CustomValidator::CustomFieldsValidator
  include Primero::Clock
  include Historical
  include Syncable
  include SyncableMobile
  include Importable

  EXPORTABLE_FIELD_TYPES = [
      Field::TEXT_FIELD,
      Field::TEXT_AREA,
      Field::RADIO_BUTTON,
      Field::SELECT_BOX,
      Field::NUMERIC_FIELD,
      Field::DATE_FIELD,
      Field::DATE_RANGE,
      Field::TICK_BOX,
      Field::TALLY_FIELD,
      Field::SUBFORM
  ]

  included do
    before_create :create_identification
    #TODO: Will this be around in production as well? In Prod we are deferring to the notifier to index
    after_save :index_nested_reportables
    after_destroy :unindex_nested_reportables

    #This code allows all models that implement records to mark all explicit properties as protected
    class_attribute(:primero_protected_properties)
    self.primero_protected_properties = []
    def self.property(name, *options, &block)
      primero_protected_properties << name
      couchrest_model_property(name, *options, &block)
    end

    property :unique_identifier
    property :duplicate, TrueClass
    property :duplicate_of, String
    property :short_id
    property :flag_at, DateTime
    property :reunited_at, DateTime
    property :record_state, TrueClass, default: true
    property :marked_for_mobile, TrueClass, default: false

    class_attribute(:form_properties_by_name)
    class_attribute(:properties_by_form)

    self.form_properties_by_name = {}
    self.properties_by_form = {}

    create_form_properties

    FormSection.add_observer(self, :handle_form_changes)
    ConfigurationBundle.add_observer(self, :handle_form_changes)

    validate :validate_duplicate_of
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD, :min => 0, :max => 130, :pattern_name => /_age$|age/
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD, :min => -2147483648, :max => 2147483647, :pattern_name => /.+/
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD
    validates_with FieldValidator, :type => Field::DATE_FIELD
    validates_with FieldValidator, :type => Field::TEXT_AREA
    validates_with FieldValidator, :type => Field::TEXT_FIELD
    validates_with FieldValidator, :type => Field::DATE_RANGE
    validates_with FieldValidator, :type => Field::TALLY_FIELD

    design do
      view :by_unique_identifier,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('unique_identifier'))
                   {
                      emit(doc['unique_identifier'], null);
                   }
                }"

      view :by_short_id,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('short_id'))
                   {
                      emit(doc['short_id'], null);
                   }
                }"

      view :by_owned_by,
           :map => "function(doc) {
                    if (doc.hasOwnProperty('owned_by'))
                   {
                      emit(doc['owned_by'], null);
                   }
                }"

      view :by_id,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('short_id'))
                   {
                      emit(doc['_id'], null);
                   }
                }"

      view :by_user_name,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('histories')){
                      for(var index=0; index<doc['histories'].length; index++){
                          emit(doc['histories'][index]['user_name'], null)
                      }
                   }
                }"

      view :by_duplicate,
              :map => "function(doc) {
                if (doc.hasOwnProperty('duplicate')) {
                  emit(doc['duplicate'], null);
                }
              }"

      view :by_duplicates_of,
              :map => "function(doc) {
                if (doc.hasOwnProperty('duplicate_of')) {
                  emit(doc['duplicate_of'], null);
                }
              }"

    end
  end

  STATUS_OPEN = 'open'
  STATUS_CLOSED = 'closed'

  def self.model_from_name(name)
    name == 'case' ? Child : Object.const_get(name.camelize)
  end

  module ClassMethods
    include FormToPropertiesConverter
    include Observable

    def new_with_user_name(user, fields = {})
      record = new(blank_to_nil(convert_arrays(fields)))
      record.create_class_specific_fields(fields)
      record.set_creation_fields_for user
      record.owned_by = user.user_name if record.owned_by.blank?
      record.owned_by_full_name = user.full_name || nil #if record.owned_by_full_name.blank?
      record
    end

    def generate_unique_id
      return UUIDTools::UUID.random_create.to_s
    end

    def parent_form
      self.name.underscore.downcase
    end

    def model_name_for_messages
      self.name.titleize.downcase
    end

    def locale_prefix
      self.name.underscore.downcase
    end

    # To avoid changing the front end, just take those hashes with the array
    # index as keys that it gives for nested subforms and convert it to real
    # arrays for assignment on the model
    def convert_arrays(fields)
      hash_arrays_to_arrays = lambda do |h|
        case h
        when Hash
          return h if h.length == 0
          # If it isn't integers, just return the original
          begin
            h.sort_by {|k,v| Integer(k)}.map{|k,v| hash_arrays_to_arrays.call(v)}
          rescue
            h.inject({}) {|acc, (k,v)| acc.merge({k => hash_arrays_to_arrays.call(v)})}
          end
        else
          h
        end
      end

      hash_arrays_to_arrays.call(fields)
    end

    def blank_to_nil(field)
      case field
      when Hash
        field.inject({}) {|acc, (k,v)| acc.merge({k => blank_to_nil(v)}) }
      when Array
        field.map {|el| blank_to_nil(el) }
      when String
        (field == "") ? nil : field
      else
        field
      end
    end

    def handle_form_changes(*args)
      Rails.logger.info("Refreshing properties from forms for #{parent_form}")
      refresh_form_properties
    end

    def refresh_form_properties
      remove_form_properties
      create_form_properties
    end

    def remove_form_properties
      properties_by_form.clear
      form_properties_by_name.each do |name, prop|
        unless primero_protected_properties.include? name.to_sym
          properties_by_name.delete(name)
          properties.delete(prop)

          if method_defined?(name)
            remove_method(name)
          end

          %w(= ?).each do |suffix|
            if method_defined?("#{name}#{suffix}")
              remove_method("#{name}#{suffix}")
            end
          end

          if prop.alias
            remove_method("#{prop.alias}=")
          end

          #TODO: also remove validations
        end
      end
    end

    def create_form_properties
      form_sections = FormSection.find_by_parent_form(parent_form)
      FormSection.link_subforms(form_sections)

      if form_sections.length == 0
        Rails.logger.warn "This model's parent_form (#{parent_form}) doesn't have any FormSections!"
      end

      properties_hash_from_forms(form_sections).each do |form_name, props|
        properties_by_form[form_name] ||= {}

        props.each do |name, options|
          unless primero_protected_properties.include? name.to_sym
            couchrest_model_property name.to_sym, options #using the original property to ensure that its not protected
          end
          properties_by_form[form_name][name] = form_properties_by_name[name] = properties_by_name[name]
        end
      end
    end

    def all_connected_with(user_name)
       #TODO Investigate why the hash of the objects got different.
       (self.by_user_name(:key => user_name).all + self.all_by_creator(user_name).all).uniq {|record| record.unique_identifier}
    end

    # this is a helper to see the duplicates for test purposes ... needs some more thought. - cg
    def duplicates
      by_duplicate(:key => true)
    end

    def duplicates_of(id)
      by_duplicates_of(:key => id).all
    end

    def create_new_model(attributes={}, current_user=nil)
      new_with_user_name(current_user, attributes)
    end

    #Override in implementing class
    def minimum_reportable_fields ; {} ; end
    def nested_reportable_types ; [] ; end

    def report_filters
      [
        {'attribute' => 'status', 'value' => [STATUS_OPEN]},
        {'attribute' => 'record_state', 'value' => ['true']}
      ]
    end

    # Attributes is just a hash
    def get_unique_instance(attributes)
      if attributes.include? 'unique_identifier'
        by_unique_identifier(:key => attributes['unique_identifier']).first
      else
        #commented out becuase this fails any arbitrary spreadsheet imports. Why was this here before?
        #raise TypeError.new("attributes must include unique_identifier for record types")
        nil
      end
    end

    def update_existing_model(instance, attributes, current_user=nil)
      if current_user.nil?
        Rails.logger.warn("Updating record without user tracking!")
      end

      instance.update_properties(attributes, current_user.try(:user_name))
    end

    #Generate a hash with properties that seems to no belong to any FormSection.
    def record_other_properties_form_section
     {"__record__" =>
        ["created_organization", "created_by_full_name", "last_updated_at",
          "last_updated_by", "last_updated_by_full_name", "posted_at",
          "unique_identifier", "record_state", "hidden_name",
          "owned_by_full_name", "previously_owned_by_full_name",
          "duplicate", "duplicate_of"].map do |name|
          [name, self.properties.find{|p| p.name == name}]
        end.to_h.compact
     }
    end

    #Returns the hash with the properties within the form sections based on module and current user.
    def get_properties_by_module(user, modules)
      read_only_user = user.readonly?(self.name.underscore)
      properties_by_module = {}
      modules.each do |primero_module|
        form_sections = allowed_formsections(user, primero_module)
        form_sections = form_sections.map{|key, forms| forms }.flatten
        properties_by_module[primero_module.id] = {}
        form_sections.each do |section|
          properties = self.properties_by_form[section.unique_id]
          if read_only_user
            readable_props = section.fields.map{|f| f.name if f.showable?}.flatten.compact
            properties = properties.select{|k,v| readable_props.include?(k)}
          end
          properties_by_module[primero_module.id][section.unique_id] = properties
        end
      end
      properties_by_module
    end

    def allowed_formsections(user, primero_module)
      FormSection.get_allowed_visible_forms_sections(primero_module, self.parent_form, user)
    end

    # Returns all of the properties that the given user is permitted to view/edit
    # read_only_user params is to indicate the user should not see properties
    # that don't display on the show page.
    def permitted_properties(user, primero_module, read_only_user = false)
      permitted = []
      form_sections = allowed_formsections(user, primero_module)
      form_sections = form_sections.map{|key, forms| forms }.flatten
      form_sections.each do |section|
        if section.is_violation_wrapper?
          properties = Incident.properties.select{|p| p.name == 'violations'}
        else
          properties = self.properties_by_form[section.unique_id].values
          if read_only_user
            readable_props = section.fields.map{|f| f.name if f.showable?}.flatten.compact
            properties = properties.select{|p| readable_props.include?(p.name)}
          end
        end
        permitted += properties
      end
      return permitted
    end

    def permitted_property_names(user, primero_module, read_only_user = false)
      self.permitted_properties(user, primero_module, read_only_user).map {|p| p.name }
    end

  end

  def initialize(*args)
    super
    self.record_state = true if self['record_state'].nil?
  end

  def valid_record?
    self.record_state == true
  end

  def validate_duplicate_of
    return errors.add(:duplicate, I18n.t("errors.models.child.validate_duplicate")) if self.duplicate && self.duplicate_of.blank?
  end

  def method_missing(m, *args, &block)
    self[m]
  end

  def mark_as_duplicate(parent_id)
    self.duplicate = true
    self.duplicate_of = self.class.by_short_id(:key => parent_id).first.try(:id)
  end

  def model_name_for_messages
    self.class.model_name_for_messages
  end

  def error_with_section(field, message)
    lookup = field_definitions.select{ |f| f.name == field.to_s }
    if lookup.any?
      lookup = lookup.first.form
      error_info = {
          internal_section: "#tab_#{lookup.unique_id}",
          translated_section: lookup["name_#{I18n.locale}"],
          message: message,
          order: lookup.order }
      errors.add(:section_errors, error_info)
    end
  end

  def display_field(field_or_name, lookups = nil)
    result = ""
    if field_or_name.present?
      if field_or_name.is_a?(Field)
        result = field_or_name.display_text(self.send(field_or_name.name), lookups)
      else
        field = Field.find_by_name_from_view(field_or_name)
        if field.present?
          result = field.display_text(self.send(field_or_name), lookups)
        end
      end
    end
    return result
  end

  def display_id
    short_id
  end

  def update_with_attachments(params, user)
    new_photo = params[:child].delete("photo")
    new_photo = (params[:child][:photo] || "") if new_photo.nil?
    new_audio = params[:child].delete("audio")
    delete_child_audio = params["delete_child_audio"].present?
    update_properties_with_user_name(user.user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, params[:child])
  end

  def update_properties_with_user_name(user_name, new_photo, photo_names, new_audio, delete_child_audio, properties)
    update_properties(properties, user_name)
    self.delete_photos(photo_names)
    self.update_photo_keys
    self.photo = new_photo
    self.delete_audio if delete_child_audio
    self.audio = new_audio
  end

  #TODO: This should use the FormSection.fields view instead
  def field_definitions
    if @field_definitions.blank?
      @field_definitions = []
      # It assumes that there is only one module associated with the user/record. If we have multiple modules per user in the future
      # this will not work.
      parent_form = self.class.parent_form
      forms = (self.module.present? ? self.module.associated_forms_grouped_by_record_type(true)[parent_form] : [])
      if forms.present?
        FormSection.link_subforms(forms)
        @field_definitions = forms.map{|form| form.fields }.flatten
      end
    end
    @field_definitions
  end

  def update_properties(properties, user_name)
    properties = self.class.blank_to_nil(self.class.convert_arrays(properties))
    if properties['histories'].present?
      properties['histories'] = remove_newly_created_media_history(properties['histories'])
    end
    properties['record_state'] = true if properties['record_state'].nil?

    attributes_to_update = {}
    properties.each_pair do |name, value|
      attributes_to_update[name] = value
      attributes_to_update["#{name}_at"] = DateTime.now if ([:flag, :reunited].include?(name.to_sym) && value.to_s == 'true')
    end
    self.attributes = attributes_to_update
    self.last_updated_by = user_name
  end

  def create_identification
    #TODO v1.3: why is case_id used here?
    self.unique_identifier ||= (self.case_id || UUIDTools::UUID.random_create.to_s)
    self.short_id ||= self.unique_identifier.last 7
    #Method should be defined by the derived classes.
    self.set_instance_id
  end

  def nested_reportables_hash
    #TODO: Consider returning this as a straight list
    self.class.nested_reportable_types.reduce({}) do |hash, type|
      if self.try(type.record_field_name).present?
        hash[type] = type.from_record(self)
      end
      hash
    end
  end

  def index_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.index! reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end

  protected

  def is_filled_in? field
    !(self[field.name].nil? || self[field.name] == field.default_value || self[field.name].to_s.empty?)
  end

  private

  def remove_newly_created_media_history(given_histories)
    (given_histories || []).delete_if do |history|
      (history["changes"]["current_photo_key"].present? and history["changes"]["current_photo_key"]["to"].present? and !history["changes"]["current_photo_key"]["to"].start_with?("photo-")) ||
          (history["changes"]["recorded_audio"].present? and history["changes"]["recorded_audio"]["to"].present? and !history["changes"]["recorded_audio"]["to"].start_with?("audio-"))
    end
    given_histories
  end

  #Copy the value of the fields from the source object.
  #The mapping parameter has the form as
  # { "field_name in source object" => "field_name in target object" }.
  def copy_fields(source, mapping, incident_id)
    if mapping.present?
      mapping.each do |original_field|
        source_value = source
        target_key = original_field["target"]
        if original_field["source"][0] == "incident_details"
          incident_key = original_field["source"][1]
          incidents = source_value["incident_details"]
          selected_incident = incidents.find{|incident| incident["unique_id"] == incident_id}
          source_value = selected_incident[incident_key]
        else
          form_key = original_field["source"][0]
          source_value = source[form_key]
        end

        self[target_key] = source_value unless source_value.nil?
      end
    end
  end
end
