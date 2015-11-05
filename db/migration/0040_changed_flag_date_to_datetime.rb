modules = [
    Incident,
    Child,
    TracingRequest
]

def is_date_valid_format? aValue
  begin
    Date.strptime(aValue, '%Y/%m/%d %H:%M:%S %z')
    true
  rescue
    false
  end
end

modules.each do |m|
  records = m.all.rows.map {|r| m.database.get(r["id"]) }
  records.each do |record|
    record_modified = false
    if record[:flags].present?
      record[:flags].each do |flag|
        if flag['created_at'].present? && !is_date_valid_format?(flag['created_at'])
          flag['created_at'] = DateTime.parse(flag['created_at']).strftime('%Y/%m/%d %H:%M:%S %z')
          record_modified = true
        end
      end
    end
    if record_modified
      puts "Updating: #{m}: #{record.id}"
      record.save
    end
  end
end
