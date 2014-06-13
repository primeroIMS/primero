class Incident < CouchRest::Model::Base
  use_database :incident
  
  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward
  
  include Record
  
  #include Searchable

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
  
  # def self.build_solar_schema
    # text_fields = build_text_fields_for_solar
    # date_fields = build_date_fields_for_solar
    # Sunspot.setup(Incident) do
      # text *text_fields
      # date *date_fields
      # date_fields.each { |date_field| date date_field }
      # boolean :duplicate
    # end
  # end
# 
  # def self.build_text_fields_for_solar
    # ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name", "created_organisation"] + Field.all_searchable_field_names('incident')
  # end
# 
  # def self.build_date_fields_for_solar
    # ["created_at", "last_updated_at"]
  # end
   
  def createClassId
    self['incident_id'] ||= self['unique_identifier']
  end

  def incident_id
    self['unique_identifier']
  end
end
