#PRIMERO-409
#Look for any violation sections at the base incident level
#If any exist, add them to the "violations" hash of the incident
#Then remove the violation sections from the base incident level

incidents = Incident.all

incidents.each do |incident|
  violation_temp = {}
  keys_to_remove = []
  
  if incident.killing_subform_section.present?
    violation_temp.merge!(:killing_subform_section => incident.killing_subform_section)
    keys_to_remove << 'killing_subform_section'
  end
  
  if incident.maiming_subform_section.present?
    violation_temp.merge!(:maiming_subform_section => incident.maiming_subform_section)
    keys_to_remove << 'maiming_subform_section'
  end
  
  if incident.recruitment_subform_section.present?
    violation_temp.merge!(:recruitment_subform_section => incident.recruitment_subform_section)
    keys_to_remove << 'recruitment_subform_section'
  end
  
  if incident.sexual_violence_subform_section.present?
    violation_temp.merge!(:sexual_violence_subform_section => incident.sexual_violence_subform_section)
    keys_to_remove << 'sexual_violence_subform_section'
  end
  
  if incident.attack_on_schools_subform_section.present?
    violation_temp.merge!(:attack_on_schools_subform_section => incident.attack_on_schools_subform_section)
    keys_to_remove << 'group_details_section'
  end
  
  if incident.attack_on_hospitals_subform_section.present?
    violation_temp.merge!(:attack_on_hospitals_subform_section => incident.attack_on_hospitals_subform_section)
    keys_to_remove << 'attack_on_schools_subform_section'
  end
  
  if incident.abduction_subform_section.present?
    violation_temp.merge!(:abduction_subform_section => incident.abduction_subform_section)
    keys_to_remove << 'abduction_subform_section'
  end
  
  if incident.denial_humanitarian_access_subform_section.present?
    violation_temp.merge!(:denial_humanitarian_access_subform_section => incident.denial_humanitarian_access_subform_section)
    keys_to_remove << 'denial_humanitarian_access_subform_section'
  end
  
  if incident.other_violation_section.present?
    violation_temp.merge!(:other_violation_section => incident.other_violation_section)
    keys_to_remove << 'other_violation_section'
  end
  
  #If any instances were found and added to the temp violation hash,
  #Add them to the violations hash and save the changes to the db
  if violation_temp.size > 0
    v1 = {}
    incident.merge!('violations' => v1)
    incident.violations.merge!(violation_temp)    
    
    keys_to_remove.each{|k| incident.delete(k)}    
    
    if incident.valid?
      puts "Saving changes to incident record #{incident.id}..."
      incident.save!
    else
      puts "Incident #{incident.id} still not valid... not saving"
    end
  end
  
end
