children = Child.all.select { |c| c.other_documents != nil }

children.each do |child|
  record_modified = false

  child.other_documents.each do |doc|
    if doc.document_type == nil
      doc.document_type = "other"
      record_modified = true
    end

    if record_modified && child.save
      puts "Added type to old documents in case record..."
    else
      puts "Case #{child.short_id} is not valid... not saving"
    end
  end
end
