killing_field_mapping = {
  'kill_method' => 'violation_method',
  'kill_cause_of_death' => 'cause',
  'kill_cause_of_details' => 'cause_details',
  'circumstances_of_killing' => 'circumstances',
  'consequences_of_killing' => 'consequences',
  'context_of_killing' => 'context',
  'mine_incident_yes_no' => 'mine_incident',
  'kill_participant' => 'victim_a_participant',
  'kill_abduction' => 'related_to_abduction'
}

maiming_field_mapping = {
  'maim_method' => 'violation_method',
  'maim_cause_of' => 'cause',
  'maim_cause_of_details' => 'cause_details',
  'circumstances_of_maiming' => 'circumstances',
  'consequences_of_maiming' => 'consequences',
  'context_of_maiming' => 'context',
  'maim_participant' => 'victim_a_participant',
  'maim_abduction' => 'related_to_abduction'
}

hospital_field_mapping = {
  'site_number_attacked_hospital' => 'site_number_attacked',
  'site_attack_type_hospital' => 'site_attack_type',
  'hospital_staff_killed_attack' => 'facility_staff_killed_attack',
  'hospital_staff_injured_attack' => 'facility_staff_injured_attack',
  'hospital_other_adults_killed_attack' => 'facility_other_adults_killed_attack',
  'hospital_other_adults_injured_attack' => 'facility_other_adults_injured_attack',
  'number_children_service_disruption_hospital' => 'number_children_service_disruption',
  'number_adults_service_disruption_hospital' => 'number_adults_service_disruption',
  'number_children_recruited_hospitals' => 'number_children_recruited',
  'hospital_management' => 'facility_management',
  'hospital_attack_objective' => 'facility_attack_objective',
  'hospital_impact' => 'facility_impact',
  'hospital_closed' => 'facility_closed',
  'hospital_closed_duration' => 'facility_closed_duration'
}

def convert_violations(doc, type, mapping)
  changed = false
  violations_hash = doc['violations']
  if violations_hash.present?
    violations = violations_hash[type]
    if violations.present?
      violations = violations.map do |violation|
        violation.map do |field, value|
          field = mapping[field] if mapping.key? field
          [field, value]
        end.to_h
      end
      violations_hash[type] = violations
      doc['violations'] = violations_hash
      changed = true
    end
  end
  return changed
end

Incident.all.rows.map{|r| Incident.database.get(r["id"])}.each do |doc|
  killings_converted = convert_violations(doc, 'killing', killing_field_mapping)
  maimings_converted = convert_violations(doc, 'maiming', maiming_field_mapping)
  hospitals_converted = convert_violations(doc, 'attack_on_hospitals', hospital_field_mapping)
  if killings_converted || maimings_converted || hospitals_converted
    doc.save
  end
end

