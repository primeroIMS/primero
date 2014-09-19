children = Child.all
children.each do |child|
  record_modified = false
  #Fix 'Type of Service' values on old records.
  if ["Social Support", "BID or BIA / Care-Plan", "Care Arrangement"].include? child[:service_type]
    puts "fixing service_type field in case #{child.short_id}..."
    child.merge! service_type: 'Other'
    record_modified = true
  end

  if record_modified
    if child.valid?
      puts "Saving changes to case record..."
      child.save!
      child.reindex!
    else
      puts "Case still not valid... not saving"
    end
  end
end