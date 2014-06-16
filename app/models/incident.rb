class Incident < CouchRest::Model::Base
  use_database :incident
  
  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward
  
  include SearchableRecord

  # Sunspot::Adapters::InstanceAdapter.register(DocumentInstanceAccessor, Incident)
  # Sunspot::Adapters::DataAccessor.register(DocumentDataAccessor, Incident)
  
  property :incident_id
  property :description
  
  def initialize *args 
    self['histories'] = []
    super *args
  end
  
  design do
    view :by_incident_id
    view :by_description
  end
  
  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end 
   
  def createClassId
    self['incident_id'] ||= self['unique_identifier']
  end

  def incident_id
    self['unique_identifier']
  end
end
