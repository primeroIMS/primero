class Incident < CouchRest::Model::Base
  use_database :incident

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward

  include Record
  include Searchable

  property :incident_id
  property :description

  def initialize *args
    self['histories'] = []
    super *args
  end

  design do
    view :by_incident_id
    view :by_description,
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'Incident')
                 {
                    if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                      emit(doc['description'], doc);
                    }
                 }
              }"
  end

  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end

  def self.search_field
    "description"
  end

  def self.view_by_field_list
    ['created_at', 'description']
  end
  
  def create_class_specific_fields(fields)
    self['incident_id'] = self.incident_id
    self['description'] = fields['description'] || self.description || ''
  end

  def incident_id
    self['unique_identifier']
  end

  def incident_code
    (self['unique_identifier'] || "").last 7
  end
end
