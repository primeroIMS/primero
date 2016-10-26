old_code = "SV-VA: SGBV"
new_code = "SV-VA: Victim/Survivor of SGBV in country of asylum"
Child.each_slice do |children|
  children_to_save = []
  children.each do |record|
    changed = false
    if record[:protection_concerns].present?
      index = record[:protection_concerns].index(old_code)
      if index.present?
        record[:protection_concerns][index] = new_code
        changed = true
      end
    end
    if record[:protection_concern_detail_subform_section].present?
      record[:protection_concern_detail_subform_section].each do |concern|
        if concern["protection_concern_type"].present? && concern["protection_concern_type"] == old_code
          concern["protection_concern_type"] = new_code
          changed = true
        end
      end
    end
    if changed
      children_to_save << record
      puts "About to save record #{record.id}"
    else
      puts "Skipping record #{record.id}"
    end
  end
  if children_to_save.present?
    Child.save_all!(children_to_save)
  end
end
