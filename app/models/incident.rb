class Incident < CouchRest::Model::Base
  use_database :incident
  
  require "uuidtools"
  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward
  
  property :incident_id
  property :description
  
  design do
    view :by_incident_id
    view :by_description
  end
  
  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end
end
