Child.each_slice do |children|
  children_to_save = []
  children.each do |record|
    changed = false

    ["bia_documents","bid_documents","other_documents"].each do |doc_type|
      if record[doc_type].present?
        record[doc_type].each do |document|
          if document.attachment_key.is_number?
            key = document.attachment_key
            # Replace the numeric key with one that contains letters
            if record['document_keys'].include? key
              record['document_keys'].delete key
              
              new_key = "doc_" + key
              record['document_keys'] << new_key
              document.attachment_key = new_key
              changed = true
            end
          end
        end
      end
    end

    if changed
      children_to_save << record
      binding.pry
      puts "About to save record #{record.id}"
    else
      puts "Skipping record #{record.id}"
    end
  end
  if children_to_save.present?
    Child.save_all!(children_to_save)
  end
end
