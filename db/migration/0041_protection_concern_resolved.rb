

records = Child.all.rows.map{|r| Child.database.get(r["id"])}
if records.present?
  records.each do |record|
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
      if record.save
        puts "Updating protection concern booleans on #{record.id}"
      else
        puts "Skipping record #{record.id}"
      end
    end
  end
end
