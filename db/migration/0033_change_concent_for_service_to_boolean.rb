#NOTE This migration has bugs
# yes/no should be Yes/No
# Also have to access couch directly due to properties change
# All that is fixed in migration 0034
Child.all.each do |record|
  record_modified = false
  if record['consent_for_services'] == 'yes'
    record['consent_for_services'] = true
    record_modified = true
  elsif record['consent_for_services'] == 'no'
    record['consent_for_services'] = false
    record_modified = true
  end
  if record_modified
    #puts "Updating: #{m}: #{record.id}"
    record.save
  end
end

