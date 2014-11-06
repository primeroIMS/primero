#PRIMERO-790
Incident.all.all.each do |incident|
  if !incident["status"].present?
    incident.update_attributes(status: "Open")
    if incident.valid?
      puts "Incident #{incident.id} updating status ..."
      incident.save!
    else
      puts "Incident #{incident.id} not valid ..."
    end
  end
end
