#PRIMERO-725# 
# Change consequences_of_killing and consequences_of_maiming from string to array


incidents = Incident.all.rows.map {|r| Incident.database.get(r["id"]) }
incidents.each do |incident|
  record_modified = false
  if incident['violations'].present?
    if incident['violations']['killing'].present?
      incident['violations']['killing'].each do |violation|
        if violation['consequences_of_killing'].present? and violation['consequences_of_killing'].is_a? String
          puts "changing consequences_of_killing to array on incident id #{incident['short_id']}..."
          violation['consequences_of_killing'] = [violation['consequences_of_killing']]
          record_modified = true
        end
      end
    end
    if incident['violations']['maiming'].present?
      incident['violations']['maiming'].each do |violation|
        if violation['consequences_of_maiming'].present? and violation['consequences_of_maiming'].is_a? String
          puts "changing consequences_of_maiming to array on incident id #{incident['short_id']}..."
          violation['consequences_of_maiming'] = [violation['consequences_of_maiming']]
          record_modified = true
        end
      end
    end
    if record_modified
      puts "Saving changes to incident record..."
      incident.save
    end
  end
end
