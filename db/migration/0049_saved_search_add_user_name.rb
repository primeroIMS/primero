
records = SavedSearch.all.rows.map {|r| SavedSearch.database.get(r["id"])}
records.each do |record|
  record_modified = false
  if record[:user_id].present?
    user = User.database.get(record[:user_id])
    record[:user_name] = user[:user_name]
    record.delete("user_id")
    record_modified = true
  end

  if record[:unique_id].present?
    record.delete("unique_id")
    record_modified = true
  end

  if record_modified
    puts "Updating Saved Searches: #{record.id}"
    record.save
  end
end
