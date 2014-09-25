require 'forms_to_properties'

module Record
  extend ActiveSupport::Concern

  require "uuidtools"
  include PrimeroModel
  include Extensions::CustomValidator::CustomFieldsValidator
  include RapidFTR::Clock
  include Historical
  include Syncable

  included do
    before_create :create_identification

    property :unique_identifier
    property :duplicate, TrueClass
    property :duplicate_of, String
    property :short_id
    property :record_state, String
    property :flag_at, DateTime
    property :reunited_at, DateTime

    class_attribute(:form_properties_by_name)
    self.form_properties_by_name = {}

    create_form_properties

    validate :validate_duplicate_of
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD, :min => 0, :max => 130, :pattern_name => /_age$|age/
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD
    validates_with FieldValidator, :type => Field::DATE_FIELD
    validates_with FieldValidator, :type => Field::TEXT_AREA
    validates_with FieldValidator, :type => Field::TEXT_FIELD
    validates_with FieldValidator, :type => Field::DATE_RANGE

    design do
      view :by_unique_identifier,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('unique_identifier'))
                   {
                      emit(doc['unique_identifier'],doc);
                   }
                }"

      view :by_short_id,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('short_id'))
                   {
                      emit(doc['short_id'],doc);
                   }
                }"

      view :by_id,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('short_id'))
                   {
                      emit(doc['_id'],doc);
                   }
                }"

      view :by_user_name,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('histories')){
                      for(var index=0; index<doc['histories'].length; index++){
                          emit(doc['histories'][index]['user_name'], doc)
                      }
                   }
                }"

      view :by_duplicate,
              :map => "function(doc) {
                if (doc.hasOwnProperty('duplicate')) {
                  emit(doc['duplicate'], doc);
                }
              }"

      view :by_duplicates_of,
              :map => "function(doc) {
                if (doc.hasOwnProperty('duplicate_of')) {
                  emit(doc['duplicate_of'], doc);
                }
              }"

    end
  end

  module ClassMethods
    include FormToPropertiesConverter
 
    def new_with_user_name(user, fields = {})
      record = new(blank_to_nil(convert_arrays(fields)))
      record.create_class_specific_fields(fields)
      record.set_creation_fields_for user
      record.owned_by = user.user_name if record.owned_by.blank?
      record
    end

    def parent_form
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

    def refresh_form_properties
      remove_form_properties
      create_form_properties
    end

    def remove_form_properties
      form_properties_by_name.each do |name, prop|
        properties_by_name.delete(name)
        properties.delete(prop)

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

    def create_form_properties
      form_sections = FormSection.find_by_parent_form(parent_form)
      FormSection.link_subforms(form_sections)

      if form_sections.length == 0
        Rails.logger.warn "This controller's parent_form (#{parent_form}) doesn't have any FormSections!"
      end

      properties_hash_from_forms(form_sections).each do |name,options|
        property name.to_sym, options
        form_properties_by_name[name] = properties_by_name[name]
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
  end

  def initialize(*args)
    super
    self['record_state'] = "Valid record" if self['record_state'].blank?
  end

  def valid_record?
    self.record_state == "Valid record"
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
    model_name = self.class.name.titleize.downcase
    model_name = "case" if model_name == "child"
    model_name
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

  def update_with_attachments(params, user)
    new_photo = params[:child].delete("photo")
    new_photo = (params[:child][:photo] || "") if new_photo.nil?
    new_audio = params[:child].delete("audio")
    delete_child_audio = params["delete_child_audio"].present?
    update_properties_with_user_name(user.user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, params[:child], params[:delete_child_document])
  end

  def update_properties_with_user_name(user_name, new_photo, photo_names, new_audio, delete_child_audio, properties, delete_child_document_names = nil)
    update_properties(properties, user_name)
    self.delete_photos(photo_names)
    self.update_photo_keys
    self.photo = new_photo
    self.delete_audio if delete_child_audio
    self.audio = new_audio
    self.delete_documents delete_child_document_names if delete_child_document_names.present?
  end

  def field_definitions
    parent_form = self.class.parent_form
    @field_definitions ||= FormSection.all_visible_form_fields(parent_form)
  end

  def update_properties(properties, user_name)
    properties = self.class.blank_to_nil(self.class.convert_arrays(properties))
    properties['histories'] = remove_newly_created_media_history(properties['histories'])
    properties['record_state'] = "Valid record" if properties['record_state'].blank?

    attributes_to_update = {}
    properties.each_pair do |name, value|
      if name == "histories"
        merge_histories(properties['histories'])
      else
        attributes_to_update[name] = value
      end
      attributes_to_update["#{name}_at"] = DateTime.now if ([:flag, :reunited].include?(name.to_sym) && value.to_s == 'true')
    end
    self.set_updated_fields_for user_name
    self.attributes = attributes_to_update
  end

  def create_identification
    self.unique_identifier ||= UUIDTools::UUID.random_create.to_s
    self.short_id ||= self.unique_identifier.last 7
    #Method should be defined by the derived classes.
    self.set_instance_id
  end

  protected

  def model_field_names
    field_definitions.map { |f| f.name }
  end

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
  def copy_fields(source, mapping)
    mapping.each do |source_key, target_key|
      self[target_key] = source[source_key] if source[source_key].present?
    end
  end

end
