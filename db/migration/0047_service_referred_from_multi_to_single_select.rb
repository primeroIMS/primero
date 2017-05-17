puts 'Searching for service_referred_from that are type Array'
Incident.all.rows.map{|r| Incident.database.get(r["id"]) }.each do |record|
  if record['service_referred_from'].is_a?(Array)
    record['service_referred_from'] = record['service_referred_from'].first
    puts "Updating incident #{record['short_id']}"
    record.save
  end
end
