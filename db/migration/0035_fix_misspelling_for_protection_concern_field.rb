modules = [Child]

modules.each do |m|
  records = m.all.rows.map {|r| m.database.get(r["id"]) }
  records.each do |record|
    record_modified = false      
    if record['protection_concerns'].is_a?(Array)
      index = record['protection_concerns'].index('refuggee')
      if index.present?
        record['protection_concerns'][index] = 'refugee'
        record_modified = true
      end
    end
    if record_modified
      puts "Updating: #{m}: #{record.id}"
      record.save
    end
  end
end

