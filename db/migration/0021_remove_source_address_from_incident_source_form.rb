#PRIMERO-727
# remove source_address from incident source form

incidents = Incident.all.rows.map {|r| Incident.database.get(r["id"]) }
incidents.each do |incident|
  record_modified = false
  
  if incident['source_subform_section'].present?
    incident['source_subform_section'].each do |source|
      if source['source_address'].present?
        puts "removing source_address from source on incident id #{incident['_id']}..."
        source.delete 'source_address'
        record_modified = true
      end
    end
  end

  if record_modified
    puts "Saving changes to incident record..."
    incident.save
  end
end
