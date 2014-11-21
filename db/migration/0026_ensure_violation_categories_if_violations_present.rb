Incident.all.all.each do |incident|
  current_violations = []
  record_modified = false

  if incident[:violations].present?
    incident[:violations].each do |violation|
      current_violations << violation.first if violation.last.present?
    end
  end

  if current_violations.present?
    incident.update_attributes(violation_category: current_violations)
    record_modified = true
  end

  if record_modified
    puts "Updating incident: #{incident.id}..."
    incident.save!
  end
end