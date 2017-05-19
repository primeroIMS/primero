#PRIMERO-396# 

children = Child.all
valid_record_status = ["Open", "Closed", "Transferred", "Duplicate"]
children.each do |child|
  record_modified = false
  #Update child_status on old records.
  if child[:child_status].blank?
    puts "adding missing child_status field to case #{child.short_id}..."
    child.merge! child_status: Record::STATUS_OPEN
    record_modified = true
  elsif not valid_record_status.include? child[:child_status].strip
    puts "updating child_status field to case #{child.short_id} from '#{child[:child_status]}' to 'Open'..."
    child.merge! child_status: Record::STATUS_OPEN
    record_modified = true
  end

  if record_modified
    if child.valid?
      puts "Saving changes to case record..."
      child.save!
    else
      puts "Case still not valid... not saving"
    end
  end
end
