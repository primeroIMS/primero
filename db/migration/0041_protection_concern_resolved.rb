Child.each_slice do |children|
  children_to_save = []
  children.each do |record|
    if record[:protection_concern_detail_subform_section].present?
      record[:protection_concern_detail_subform_section].each do |concern|
        if concern[:concern_is_resolved] == 'Yes' || concern[:concern_is_resolved] == true
          concern[:concern_is_resolved] = true
        else
          concern[:concern_is_resolved] = false
        end
        if concern[:concern_action_taken_already] == 'Yes' || concern[:concern_action_taken_already] == true
          concern[:concern_action_taken_already] = true
        else
          concern[:concern_action_taken_already] = false
        end
      end
      children_to_save << record
      puts "About to save record #{record.id}"
    end
  end
  if children_to_save.present?
    Child.save_all!(children_to_save)
  end
end
