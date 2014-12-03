incidents = Incident.all.rows.map {|r| Incident.database.get(r["id"]) }
incidents.each do |incident|
  record_modified = false
  
  if incident['alleged_perpetrator'].present?
    incident['alleged_perpetrator'].each do |alleged_perpetrator|
      if alleged_perpetrator['perpetrator_sex'].present? && alleged_perpetrator['perpetrator_sex'] == "Both female and male perpetrators"
        puts "removing perpetrator_sex from alleged_perpetrator on incident id #{incident['_id']}..."
        alleged_perpetrator.delete 'perpetrator_sex'
        record_modified = true
      end
    end
  end

  if record_modified
    puts "Saving changes to incident record..."
    incident.save
  end
end