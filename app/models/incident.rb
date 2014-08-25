class Incident < CouchRest::Model::Base
  use_database :incident

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward


  include Record
  include Searchable
  include Ownable

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

  def violations_list
    violations_list = []

    if self['violations'].present?
      self['violations'].each do |key, value|
        value.each do |k, v|
          if v['violation_id'].present?
            violations_list << v['violation_id']
          else
            violations_list << key.titleize + " " + k
          end
        end
      end
    end

    if violations_list.blank?
      violations_list << "NONE"
    end

    return violations_list
  end
end
