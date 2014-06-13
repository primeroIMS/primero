class Incident < CouchRest::Model::Base
  use_database :incident
  
  #require "uuidtools"
  #include RecordHelper
  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward
  
  include Record
  
  #property :short_id
  #property :unique_identifier
  property :incident_id
  property :description
  
  design do
    view :by_incident_id
    view :by_description
  end
  
  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end
  
  #def self.new_with_user_name(user, fields = {})
  #  incident = new(fields)
  #  incident.create_unique_id
  #  incident['short_id'] = incident.short_id
  #  incident['incident_id'] = incident.incident_id
    #child['registration_date'] = DateTime.now.strftime("%d/%b/%Y")
  #  incident.set_creation_fields_for user
  #  incident
  #end
  
  
  #def create_unique_id
  #  self['unique_identifier'] ||= UUIDTools::UUID.random_create.to_s
  #end

  #def short_id
  #  sid = (self['unique_identifier'] || "").last 7
    # binding.pry
    # sid
  # end
  
  def createClassId
    self['incident_id'] ||= self['unique_identifier']
  end

  def incident_id
    self['unique_identifier']
  end

  #def unique_identifier
  #  self['unique_identifier']
  #end
end
