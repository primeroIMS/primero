#Migrate is_manager from string to boolean value.
User.all.rows.map{|r| User.database.get(r["id"]) }.each do |record|
  record_modified = false
  if record['is_manager'] == "true"
    record['is_manager'] = true
    record_modified = true
  elsif record['is_manager'] == "false" || record['is_manager'].blank?
    record['is_manager'] = false
    record_modified = true
  end
  if record_modified
    puts "Updating User: #{record.id}"
    record.save
  end
end
