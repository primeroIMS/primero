children = Child.all
children.each do |child|
  record_modified = false
  #Fix 'Stage of displacement at time of incident' values on old records.
  if child[:displacement_incident] == "Other, please specify"
    puts "fixing displacement_incident field in case #{child.short_id}..."
    child.merge! displacement_incident: ''
    record_modified = true
  end

  if child[:displacement_at_time_of_incident_other].present?
    puts "fixing displacement_at_time_of_incident_other field in case #{child.short_id}..."
    child.merge! displacement_at_time_of_incident_other: ''
    record_modified = true
  end

  if record_modified
    if child.valid?
      puts "Saving changes to case record..."
      child.save!
      child.reindex!
    else
      puts "Case still not valid... not saving"
    end
  end
end