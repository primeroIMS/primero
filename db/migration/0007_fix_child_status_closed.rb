children = Child.all
children.each do |child|
  record_modified = false
  #Fix 'closed' child_status on old records.
  if child[:child_status] == "Closed "
    puts "fixing child_status field in case #{child.short_id}..."
    child.merge! child_status: Record::STATUS_CLOSED
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