#PRIMERO-614 - ethnicity, nationality and religion changed from multi-select to single select.
#Fix the data because chosen is a array and single select are a string value.
#In order to make it work, the db:migrate should go before db:seed
#It won't break if happened in the other way, but value should not be okay.

Incident.all.all.each do |incident|
  if incident.module_id == "primeromodule-gbv"
    puts "Processing GBV Incident id '#{incident.id}' ..."
    if incident.ethnicity.is_a?(Array)
      #Avoid type cast verification
      incident['ethnicity'] = incident.ethnicity.first
    end
    if incident.religion.is_a?(Array)
      #Avoid type cast verification
      incident['religion'] = incident.religion.first
    end
    if incident.nationality.is_a?(Array)
      #Avoid type cast verification
      incident['nationality'] = incident.nationality.first
    end
    incident.save!
  end
end
