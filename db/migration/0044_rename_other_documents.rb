Child.each_slice do |children|
  children_to_save = []
  children.each do |child|
    # Change upload_document name to upload_other_document
    if child[:upload_document].present?
      child['upload_other_document'] = child['upload_document']
      child.delete('upload_document')
      children_to_save << child
      puts "About to rename upload_document to upload_other_document from child #{child.id}"
    else
      puts "Skipping child #{child.id}"
    end
  end
  if children_to_save.present?
    Child.save_all!(children_to_save)
  end
end