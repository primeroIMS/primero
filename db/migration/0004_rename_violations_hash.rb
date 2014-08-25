#PRIMERO-315
#Look for any violation sections with the old naming convention
#If any exist, rename them using the new convention 

incidents = Incident.all

incidents.each do |incident|  
  if incident.violations.present?
    mappings = {
      "abduction_subform_section" => "abduction",
      "attack_on_hospitals_subform_section" => "attack_on_hospitals",
      "attack_on_schools_subform_section" => "attack_on_schools",
      "denial_humanitarian_access_section" => "denial_humanitarian_access",
      "killing_subform_section" => "killing",
      "maiming_subform_section" => "maiming",
      "other_violation_section" => "other_violation",
      "recruitment_subform_section" => "recruitment",
      "sexual_violence_subform_section" => "sexual_violence"
    }
    incident.violations.keys.each { |k| incident.violations[ mappings[k] ] = incident.violations.delete(k) if mappings[k] }

    if incident.valid?
      puts "Saving changes to incident record #{incident.id}..."
      incident.save!
    else
      puts "Incident #{incident.id} still not valid... not saving"
    end
  end
end
