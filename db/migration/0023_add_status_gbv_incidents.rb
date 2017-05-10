#PRIMERO-790
Incident.all.all.each do |incident|
  if incident["status"].blank?
    incident.update_attributes(status: "open")
    if incident.valid?
      puts "Incident #{incident.id} updating status ..."
      incident.save!
    else
      puts "Incident #{incident.id} not valid ..."
    end
  end
end
