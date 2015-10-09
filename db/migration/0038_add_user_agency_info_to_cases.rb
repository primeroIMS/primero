modules = [
    Incident,
    Child,
    TracingRequest
]

modules.each do |m|
  records = m.all.rows.map {|r| m.database.get(r["id"]) }
  records.each do |record|
    record_modified = false
    if (!record[:owned_by_agency].present? || !record[:owned_by_location].present?) && record[:owned_by].present?
      user = User.find_by_user_name(record[:owned_by])
      record[:owned_by_agency] = user.organization
      record[:owned_by_location] = user.location
      record_modified = true
    end
    if record_modified
      puts "Updating: #{m}: #{record.id}"
      record.save
    end
  end
end
