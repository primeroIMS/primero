#PRIMERO-269# 
# if a case does not have a "record_state", add one


children = Child.all
children.each do |child|

  record_modified = false

  #Add a record_state to old records
  unless child[:record_state].present?
    puts "adding missing record_state field to case #{child.short_id}..."
    child.merge! record_state: 'Valid record'
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
