old_code = "SV-VA: SGBV"
new_code = "SV-VA: Victim/Survivor of SGBV in country of asylum"
records = Child.all.rows.map{|r| Child.database.get(r["id"])}
if records.present?
  records.each do |record|
    if record[:protection_concerns].present?
      index = record[:protection_concerns].index(old_code)
      if index.present?
        record[:protection_concerns][index] = new_code
      end
    end
    if record[:protection_concern_detail_subform_section].present?
      record[:protection_concern_detail_subform_section].each do |concern|
        if concern["protection_concern_type"].present? && concern["protection_concern_type"] == old_code
          concern["protection_concern_type"] = new_code
        end
      end
    end
    if record.save
      puts "Updating protection concern values #{record.id}"
    else
      puts "Skipping record #{record.id}"
    end
  end
end
