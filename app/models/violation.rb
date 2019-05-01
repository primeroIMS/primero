class Violation
  #TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  #include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
  #include Indexable

  attr_accessor :incident, :violation_object, :category

  # searchable auto_index: self.auto_index? do
  #   string :category, as: :category_sci

    #FormSection.violaton_forms.each do |form|
    #  #TODO: Refactor with Field: form_section.fields.where(blah) Fix with MRM
    #  # form.all_filterable_fields.map(&:name).each do |fx|
    #  #   string(fx, as: "#{fx}_sci".to_sym) {violation_value(fx)}
    #  # end
    #  # form.all_filterable_multi_fields.map(&:name).each do |f|
    #  #   string(f, multiple: true) {violation_value(f)}
    #  # end
    #  # form.all_searchable_date_fields.map(&:name).each do |f|
    #  #   date(f) {violation_value(f)}
    #  # end
    #  # form.all_filterable_numeric_fields.map(&:name).each do |f|
    #  #   integer(f) {violation_value(f)}
    #  # end
    #  # form.all_tally_fields.each do |field|
    #  #   string(field.name, multiple: true) do
    #  #     field.tally.map do |t|
    #  #       attribute = "#{field.name}_#{t}"
    #  #       value = violation_value(attribute)
    #  #       value ||= 0
    #  #       "#{t}:#{value}"
    #  #     end
    #  #   end
    #  # end
    #end

    #Incident.searchable_string_fields.each do |fx|
    #  string(fx, as: "#{fx}_sci".to_sym) {incident_value(fx)}
    #end
    #Incident.searchable_multi_fields.each do |f|
    #  string(f, multiple: true) {incident_value(f)}
    #end
    #Incident.searchable_date_fields.each do |f|
    #  date(f) {incident_value(f)}
    #end
    #Incident.searchable_numeric_fields.each do |f|
    #  integer(f) {incident_value(f)}
    #end
    #Incident.searchable_location_fields.each do |f|
    #  text(f, as: "#{f}_lngram".to_sym) {incident_value(f)}
    #end

    #string('armed_force_group_names', multiple: true){armed_force_group_names}

    #boolean('record_state') {incident_value('record_state')}

    #string('incident_total_tally', multiple: true) do
    #  types = ['boys', 'girls', 'unknown']
    #  tally = []
    #  types.each do |type|
    #    if self.incident["incident_total_tally_#{type}"].present?
    #      value = incident_value("incident_total_tally_#{type}")
    #      tally << "#{type}:#{value}"
    #    end
    #  end
    #  tally
    #end
  #end

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
        violations << Violation.new(category, incident, violation)
      end
    end
    return violations
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

  def armed_force_group_names
    perpetrators.map(&:armed_force_group_name).compact
  end

end
