children = Child.all
children.each do |child|

  record_modified = false

  # Change other_documents name to documents
  if child[:other_documents].present?
    child.update_attributes(documents: child['other_documents'])
    child[:other_documents] = nil

    if child.save
      puts "Saved changes to case record..."
    else
      puts "Case #{child.short_id} is not valid... not saving"
    end
  end
end

children.each do |child|
  if child['other_documents']
    child.delete('other_documents')
    child.save
    puts "Deleted key other_documents from child #{child.short_id}"
  end
end
