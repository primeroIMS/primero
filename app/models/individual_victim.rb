class IndividualVictim
  #TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
  include Indexable

  attr_accessor :incident, :individual_victims_object

  searchable do

    integer('individual_age'){ individual_victims_age }
    string('individual_sex') { individual_victims_sex }
    string('individual_violations', multiple: true) { individual_victims_violation_category }
    string('status', as: :status_sci) {incident_value('status')}
    string('incident_location', as: :incident_location_sci) { incident_location }

    Incident.searchable_boolean_fields.each do |f|
      boolean(f) { incident_value(f)}
    end
  end

  def self.from_incident(incident)
    individual_victims = []
    if incident.individual_victims_subform_section.present?
      incident.individual_victims_subform_section.each do |iv|
        individual_victims << IndividualVictim.new(incident, iv)
      end
    end
    individual_victims
  end

  def initialize(incident, individual_victims_object)
    self.incident = incident
    self.individual_victims_object = individual_victims_object
  end

  def id
    individual_victims_value('unique_id')
  end

  def incident_value(field_name)
    if self.incident.present?
      incident.send(field_name)
    end
  end

  def individual_victims_value(field_name)
    if self.individual_victims_object.present? && self.individual_victims_object.respond_to?(field_name)
      individual_victims_object.send field_name
    end
  end

  def individual_victims_age
    if self.individual_victims_object.present?
      self.individual_victims_object.try(:individual_age)
    end
  end

  def individual_victims_sex
    self.individual_victims_object.individual_sex if self.individual_victims_object.individual_sex.present?
  end

  def incident_location
    self.incident.try(:incident_location)
  end

  def individual_victims_violation_category
    individual_victims_violations = []
    incident_violations = incident_value('violations')

    if incident_violations.present? && incident_violations.is_a?(Object)
      incident_violations.keys.each do |category|
        incident_violations[category].each  do|violation|
          individual_victims_violations << category if violation.unique_id.in?(individual_victims_value('individual_violations'))
        end
      end
    end

    individual_victims_violations
  end
end
