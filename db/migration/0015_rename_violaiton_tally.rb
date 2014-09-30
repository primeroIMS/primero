incidents = Incident.all
incidents.each do |incident|
  record_modified = false
  
  # violation_recruit_tally => violation_tally
  # other_violation_tally => violation_tally
  # violation_maiming_tally => violation_tally
  # violation_killing_tally => violation_tally
  # violation_abductions_tally => violation_tally
  # violation_killed_attack_hospital_tally => violation_killed_tally
  # violation_injured_attack_hospital_tally => violation_injured_tally
  # violation_killed_attack_tally => violation_killed_tally
  # violation_injured_attack_tally => violation_injured_tally
  
  if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each do |v|
          if key == 'killing'
          elsif key == 'maiming'
          elsif key == 'recruitment'
          elsif key == 'abduction'
          elsif key == 'sexual_violence'
          elsif key == 'other_violation'
          elsif key == 'attack_on_hospitals'
          elsif key == 'attack_on_schools'
          end
          
          #Special case for "attack on hospitals" and "attack on schools"
          if(key == 'attack_on_hospitals' || key == 'attack_on_schools')
            child_count += v.send("violation_killed_tally_#{child_type}".to_sym) if v.send("violation_killed_tally_#{child_type}".to_sym).present?
            child_count += v.send("violation_injured_tally_#{child_type}".to_sym) if v.send("violation_injured_tally_#{child_type}".to_sym).present?
          else
            child_count += v.send("violation_tally_#{child_type}".to_sym) if v.send("violation_tally_#{child_type}".to_sym).present?
          end
          if child_count > 0
            #Return true and bail... no need to keep going
            return true
          end
        end
      end
    end
    #We only got here if none were found... so return false
    return false
  
  
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