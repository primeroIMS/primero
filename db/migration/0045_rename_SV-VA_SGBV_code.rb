records = Child.all.rows.map{|r| Child.database.get(r["id"])}
if records.present?
  records.each do |record|
    if record[:protection_concern_detail_subform_section].present?
      record[:protection_concern_detail_subform_section].each do |concern|
        if record[:protection_concerns].present?
          index = record[:protection_concerns].index("SV-VA: SGBV")
          if index.present?
            record[:protection_concerns][index] = "SV-VA: Victim/Survivor of SGBV in country of asylum"
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
end
