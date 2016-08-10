children = Child.all
children.each do |child|
  record_modified = false

  # Change upload_document name to upload_other_document
  if child[:upload_document].present?
    child.update_attributes(upload_other_document: child['upload_document'])
    child[:upload_document] = nil

    if child.save
      puts "Saved changes to case record..."
    else
      puts "Case #{child.short_id} is not valid... not saving"
    end
  end
end

children.each do |child|
  if child['upload_document']
    child.delete('upload_document')
    if child.save
      puts "Deleted key upload_document from child #{child.short_id}"
    else
      puts "Key upload_document not deleted from child #{child.short_id}"
    end
  end
end
