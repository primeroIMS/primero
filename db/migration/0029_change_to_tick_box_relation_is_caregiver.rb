#Family Details "relation_is_caregiver" change from radio buttons to tick box
cases = Child.all.rows.map {|r| Child.database.get(r["id"]) }
cases.each do |case_record|
  if case_record['family_details_section'].present?
    case_record['family_details_section'].each do |family_detail|
      family_detail['relation_is_caregiver'] = family_detail['relation_is_caregiver'] == "Yes"
    end
    puts "Updating relation_is_caregiver for case #{case_record['_id']}"
    case_record.save
  end
end
