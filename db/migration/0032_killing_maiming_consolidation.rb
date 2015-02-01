killing_field_mapping = {
  'kill_method' => 'method',
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
  'maim_method' => 'method',
  'maim_cause_of' => 'cause',
  'maim_cause_of_details' => 'cause_details',
  'circumstances_of_maiming' => 'circumstances',
  'consequences_of_maiming' => 'consequences',
  'context_of_maiming' => 'context',
  'maim_participant' => 'victim_a_participant',
  'maim_abduction' => 'related_to_abduction'
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
  if killings_converted || maimings_converted
    doc.save
  end
end

