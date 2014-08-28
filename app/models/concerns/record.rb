require 'forms_to_properties'

module Record
  extend ActiveSupport::Concern

  require "uuidtools"
  include RecordHelper
  include Extensions::CustomValidator::CustomFieldsValidator

  included do
    before_save :update_history, :unless => :new?
    before_save :update_organisation
    before_save :add_creation_history, :if => :new?

    property :short_id
    property :unique_identifier
    property :created_organisation
    property :created_by
    property :created_at
    property :duplicate, TrueClass

    class_attribute(:form_properties_by_name)
    self.form_properties_by_name = {}

    create_form_properties

    validate :validate_created_at
    validate :validate_last_updated_at
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

      view :by_created_by

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

    def short_id
      (self['unique_identifier'] || "").last 7
    end

    def unique_identifier
      self['unique_identifier']
    end

  end

  module ClassMethods
    include FormToPropertiesConverter

    def new_with_user_name(user, fields = {})
      record = new(convert_arrays(fields))
      record.create_unique_id
      record['short_id'] = record.short_id
      record['record_state'] = "Valid record" if record['record_state'].blank?
      record.create_class_specific_fields(fields)
      record.set_creation_fields_for user
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

    def refresh_form_properties
      remove_form_properties
      create_form_properties
    end

    def remove_form_properties
      form_properties_by_name.each do |name, prop|
        properties_by_name.delete(name)
        properties.delete(prop)
        remove_method("#{name}=")

        if method_defined?("#{name}?")
          remove_method("#{name}?")
        end

        if prop.alias
          remove_method("#{prop.alias}=")
        end

        #TODO: also remove validations
      end
    end

    def create_form_properties
      form_sections = FormSection.find_by_parent_form(parent_form)

      if !form_sections.length
        raise "This controller's parent_form (#{parent_form}) doesn't have any FormSections!"
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

    def all_by_creator(created_by)
      self.by_created_by :key => created_by
    end

    # this is a helper to see the duplicates for test purposes ... needs some more thought. - cg
    def duplicates
      by_duplicate(:key => true)
    end

    def duplicates_of(id)
      by_duplicates_of(:key => id).all
    end

    #TODO: Do we need to ditch this method in favor of the Solr/Sunspot pagination?
    # def fetch_paginated(options, page, per_page)
    #   row_count = send("#{options[:view_name]}_count", options.merge(:include_docs => false))['rows'].size
    #   per_page = row_count if per_page == "all"
    #   [row_count, self.paginate(options.merge(:design_doc => self.name, :page => page, :per_page => per_page, :include_docs => true))]
    # end
  end

  def create_unique_id
    self['unique_identifier'] ||= UUIDTools::UUID.random_create.to_s
  end

  def valid_record?
    self['record_state'] == "Valid record"
  end

  def validate_created_at
    begin
      if self['created_at']
        DateTime.parse self['created_at']
      end
      true
    rescue
      errors.add(:created_at, '')
    end
  end

  def validate_last_updated_at
    begin
      if self['last_updated_at']
        DateTime.parse self['last_updated_at']
      end
      true
    rescue
      errors.add(:last_updated_at, '')
    end
  end

  def validate_duplicate_of
    return errors.add(:duplicate, I18n.t("errors.models.child.validate_duplicate")) if self["duplicate"] && self["duplicate_of"].blank?
  end

  def method_missing(m, *args, &block)
    self[m]
  end

  def mark_as_duplicate(parent_id)
    self['duplicate'] = true
    self['duplicate_of'] = self.class.by_short_id(:key => parent_id).first.try(:id)
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

end
