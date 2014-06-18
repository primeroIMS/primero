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

    validate :validate_created_at
    validate :validate_last_updated_at
    validates_with FieldValidator, :type => Field::NUMERIC_FIELD
    validates_with FieldValidator, :type => Field::TEXT_AREA
    validates_with FieldValidator, :type => Field::TEXT_FIELD

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

      view :by_user_name,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('histories')){
                      for(var index=0; index<doc['histories'].length; index++){
                          emit(doc['histories'][index]['user_name'], doc)
                      }
                   }
                }"

      view :by_created_by
    end

    def short_id
      (self['unique_identifier'] || "").last 7
    end

    def unique_identifier   
      self['unique_identifier']
    end   

  end 

  module ClassMethods
    def new_with_user_name(user, fields = {})      
      record = new(fields)
      record.create_unique_id
      record['short_id'] = record.short_id
      record.createClassSpecificFields(fields)
      record.set_creation_fields_for user
      record
    end

    def parent_form
      parent_form = self.name.downcase
      parent_form = 'case' if parent_form == 'child'
      parent_form
    end

    def all_connected_with(user_name)
       #TODO Investigate why the hash of the objects got different.
       (self.by_user_name(:key => user_name).all + self.all_by_creator(user_name).all).uniq {|record| record.unique_identifier}
    end

    def all_by_creator(created_by)
      self.by_created_by :key => created_by
    end
  end 

  def create_unique_id
    self['unique_identifier'] ||= UUIDTools::UUID.random_create.to_s
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

  def method_missing(m, *args, &block)
    self[m]
  end

end