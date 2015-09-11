Child.all.rows.map{|c| Child.database.get(c["id"]) }.each do |child|
  child_modified = false
  if child['transitions'].present?
    child['transitions'].each do |transition|
      if transition['is_remote_primero'] == "true" || transition['is_remote_primero'] == true
        transition['type_of_export'] = "Primero"
      else
        transition['type_of_export'] = "Non-Primero"
      end
      transition.delete 'is_remote_primero'
      child_modified = true
    end
  end
  if child_modified
    puts "Updating child #{child.id} ..."
    puts "Remove 'transitions.is_remote_primero'"
    puts "Add 'transitions.type_of_export'"
    child.save
  end
end
