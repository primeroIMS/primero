class Violation
  #TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
  include Indexable

  attr_accessor :incident, :violation_object, :category

  PENDING = 'report_pending_verification'
  VERIFIED = 'verified'

  searchable auto_index: self.auto_index? do
    string :category, as: :category_sci

    FormSection.violation_forms.each do |form|
      form.all_filterable_fields.map(&:name).each do |fx|
        string(fx, as: "#{fx}_sci".to_sym) {violation_value(fx)}
      end
      form.all_filterable_multi_fields.map(&:name).each do |f|
        string(f, multiple: true) {violation_value(f)}
      end
      form.all_searchable_date_fields.map(&:name).each do |f|
        date(f) {violation_value(f)}
      end
      form.all_filterable_numeric_fields.map(&:name).each do |f|
        integer(f) {violation_value(f)}
      end
      form.all_tally_fields.each do |field|
        string(field.name, multiple: true) do
          field.tally.map do |t|
            attribute = "#{field.name}_#{t}"
            value = violation_value(attribute)
            value ||= 0
            "#{t}:#{value}"
          end
        end
      end
    end

    Incident.searchable_string_fields.each do |fx|
      string(fx, as: "#{fx}_sci".to_sym) {incident_value(fx)}
    end
    Incident.searchable_multi_fields.each do |f|
      string(f, multiple: true) {incident_value(f)}
    end
    Incident.searchable_date_fields.each do |f|
      date(f) {incident_value(f)}
    end
    Incident.searchable_numeric_fields.each do |f|
      integer(f) {incident_value(f)}
    end
    Incident.searchable_location_fields.each do |f|
      string(f, as: "#{f}_sci".to_sym) {incident_value(f)}
    end
    Incident.searchable_boolean_fields.each do |f|
      boolean(f) { incident_value(f)}
    end

    #TODO: Incident locations are not getting indexed in the location scheme introduced in v1.2

    string('armed_force_names', multiple: true){armed_force_names}

    string('armed_group_names', multiple: true){armed_group_names}

    string('perpetrator_categories', multiple: true){perpetrator_categories}

    integer('individual_age', multiple: true){ individual_victims_age }

    string('incident_total_tally', multiple: true) do
      types = ['boys', 'girls', 'unknown']
      tally = []
      types.each do |type|
        if self.incident["incident_total_tally_#{type}"].present?
          value = incident_value("incident_total_tally_#{type}")
          tally << "#{type}:#{value}"
        end
      end
      tally
    end
  end

  class << self
    def all(options={})
      violations = []
      incidents = Incident.all(options).all
      incidents.each do |incident|
        violations = violations + from_incident(incident)
      end
      return violations
    end

    def from_incident(incident)
      violations = []
      if incident.violations.present?
        incident.violations.keys.each do |category|
          incident.violations[category].each do |violation|
            violations << Violation.new(category, incident, violation)
          end
        end
      end
      return violations
    end

    def report_filters
      Incident.report_filters
    end

    def config
      @system_settings ||= SystemSettings.current
      @system_settings.try(:violation_config)
    end

  end

  def initialize(category, incident, violation)
    self.incident = incident
    self.category = category
    self.violation_object = violation
  end

  def id
    violation_value('unique_id')
  end

  def incident_value(field_name)
    if self.incident.present?
      incident.send field_name
    end
  end

  def violation_value(field_name)
    if self.violation_object.present? && self.violation_object.respond_to?(field_name)
      violation_object.send field_name
    end
  end

  def perpetrators
    #TODO: This code is brittle. There is no future guarantee that the perpetrators will be invoked this way
    incident_value('perpetrator_subform_section').select{|p| p.perpetrator_violations.include? id}
  end

  def individual_victims
    incident_value('individual_victims_subform_section').select{|iv| iv.individual_violations.include? id}
  end

  def armed_force_names
    perpetrators.map(&:armed_force_name).compact
  end

  def perpetrator_categories
    perpetrators.map(&:perpetrator_category).compact
  end

  def armed_group_names
    perpetrators.map(&:armed_group_name).compact
  end

  def individual_victims_age
    individual_victims.map(&:individual_age).compact
  end
end