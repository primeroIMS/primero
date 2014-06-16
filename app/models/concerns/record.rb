module Record
  extend ActiveSupport::Concern
    
  require "uuidtools"
  include RecordHelper  
  
  included do
    before_save :update_history, :unless => :new?
    before_save :update_organisation
    before_save :add_creation_history, :if => :new?
    
    property :short_id
    property :unique_identifier
    property :created_organisation
    property :created_by
    property :created_at    
    
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
  end 
  
  def create_unique_id
    self['unique_identifier'] ||= UUIDTools::UUID.random_create.to_s
  end
  
  
  def parent_form
    parent_form = self.class.name.downcase
    parent_form = 'case' if parent_form == 'child'
    parent_form
  end
  
end