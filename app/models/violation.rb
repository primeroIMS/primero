class Violation
  #TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  include CouchRest::Model::Embeddable
  include Indexable

  property :unique_id
  alias_method :id, :unique_id
  attr_accessor :incident, :category


  searchable do
    FormSection.violation_forms.each do |form|
      form.all_filterable_fields.map(&:name).each {|f| string f, as: "#{f}_sci".to_sym}
      form.all_filterable_multi_fields.map(&:name).each {|f| string f, multiple: true}
      form.all_searchable_date_fields.map(&:name).each {|f| date f}
      form.all_filterable_numeric_fields.map(&:name).each {|f| integer f}
    end

    Incident.searchable_string_fields.each do |field_name|
      string field_name, as: "#{field_name}_sci".to_sym do
        incident_value field_name
      end
    end

    Incident.searchable_multi_fields.each do |field_name|
      string field_name, multiple: true do
        incident_value field_name
      end
    end

    Incident.searchable_date_fields.each do |field_name|
      date field_name do
        incident_value field_name
      end
    end

    Incident.searchable_numeric_fields.each do |field_name|
      integer field_name do
        incident_value field_name
      end
    end

    Incident.searchable_location_fields.each do |field_name|
      text field_name, as: "#{field_name}_lngram".to_sym do
        incident_value field_name
      end
    end
  end

  def self.all(options={})
    violations = []
    incidents = Incident.all(options).all
    incidents.each do |incident|
      violations = violations + from_incident(incident)
    end
    return violations
  end

  def self.from_incident(incident)
    violations = []
    incident.violations.keys.each do |category|
      incident.violations[category].each do |violation|
        violations << Violation.new(incident, category, violation.attributes)
      end
    end
    return violations
  end

  def initialize(incident, category, *args)
    super(*args)
    self.incident = incident
    self.category = category
  end

  # def verified
  #   nil
  # end
  # alias_method :verified?, :verified

  def incident_value(field_name)
    if self.incident.present?
      incident.send field_name
    end
  end

end