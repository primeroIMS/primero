

module Record
  extend ActiveSupport::Concern
    
  require "uuidtools"
  include RecordHelper  
  
  included do
    property :short_id
    property :unique_identifier
  end 
  
  module ClassMethods
    def new_with_user_name(user, fields = {})
      record = new(fields)
      record.create_unique_id
      record.create_short_id
      record.createClassId
      #record.create_class_id
      #record['#{record.class.name.downcase}_id'] = record.incident_id
      record['registration_date'] ||= DateTime.now.strftime("%d/%b/%Y")
      record.set_creation_fields_for user
      #binding.pry
      record
    end
  end 
  
  def create_unique_id
    self['unique_identifier'] ||= UUIDTools::UUID.random_create.to_s
  end
  
  def create_short_id
    self['short_id'] ||= (self['unique_identifier'] || "").last 7
  end

  def short_id
    binding.pry
    self['short_id']
  end
  
  
  def unique_identifier   
    self['unique_identifier']
  end
  
end