#PRIMERO-726 
# Change age_group_of_alleged_perpetrator from string to array

incidents = Incident.all
incidents.each do |incident|
  record_modified = false
  
  if incident['perpetrator_subform_section'].present?
    incident['perpetrator_subform_section'].each do |perpetrator|
      if perpetrator['age_group'].present? && perpetrator['age_group'].is_a?(String)
        puts "changing age_group to array on incident id #{incident.short_id}..."
        perpetrator['age_group'] = [perpetrator['age_group']]
        record_modified = true
      end
    end
  end

  if record_modified
    if incident.valid?
      puts "Saving changes to incident record..."
      incident.save!
    else
      puts "incident still not valid... not saving"
    end
  end
end
