modules = [
  Incident,
  Child,
  TracingRequest
]

modules.each do |m|
  records = m.all.rows.map {|r| m.database.get(r["id"]) }
  records.each do |record|
    record_modified = false
    record.each do |key, value|
      if value.kind_of?(String) && value.match(/\[/)
        record[key] = value.gsub('[','').gsub(']', '').gsub('"', '').split(',')
        puts "Bad value: #{value}"
        record_modified = true
      end
    end
    if record_modified
      puts "Updating: #{m}: #{record.id}"
      record.save
    end
  end
end

