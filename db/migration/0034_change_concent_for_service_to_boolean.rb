cases = Child.all.rows.map {|r| Child.database.get(r["id"]) }
cases.each do |case_record|
  case_record['consent_for_services'] = (case_record['consent_for_services'] == true || case_record['consent_for_services'] == "Yes" || case_record['consent_for_services'] == "yes")
  puts "Updating consent_for_services for case #{case_record['_id']}"
  case_record.save
end