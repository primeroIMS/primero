# r = Report.create!(
#   name: 'Test 2x2',
#   module_id: 'primeromodule-cp',
#   record_type: 'case',
#   aggregate_by: ["location_current", "protection_concerns"],
#   disaggregate_by: ["age", "sex"],
# )

sexes = ['Male', 'Female']
status = ['Open', 'Closed']
risk_level = ['High', 'Medium', 'Low']
#owned_by_agency
#owned_by_location_district
district = ["Western Area Rural", "Western Area Urban (Freetown)", "Tonkolili", "Port Loko", "Moyamba", "Koinadugu", "Kono", "Kenema", "Kambia", "Kailahun", "Bonthe", "Bombali", "Pujehun", "Bo"]
user_names = ["ahmed_caseworker_cp", "aisha_mgr_cp", "hideki_referral_cp", "jin_medical_cp", "juan_mgr_cp", "leila_admin_cp", "mohammed_transfer_cp", "primero_admin_cp", "primero_cp", "primero_medical_cp", "primero_mgr_cp", "primero_referral_cp", "primero_registrar_cp", "priya_caseworker_cp", "yulia_registrar_cp"]
protection_concerns = ["Separated", "Unaccompanied", "Child not attending school", "Child has been abandoned", "Extreme levels of poverty", "Child is neglected", "Child is GBV survivor", "Child is orphan", "Child physically abused", "Child labour", "Child is mentally abused", "Child with elderly parents", "Child has medical condition", "Child-headed household", "Child living on streets", "Child in conflict with the law", "Pregnant/child parent", "Post-quarantine", "Post-OICC", "Child facing stigma", "Other"]
#case_module_ids = ['primeromodule-cp', 'primeromodule-gbv']
service = ['Safehouse Service', 'Health/Medical Service', 'Psychosocial Service', 'Police/Other Service', 'Legal Assistance Service', 'Livelihoods Service', 'Child Protection Service', 'Family Mediation Service', 'Family Reunification Service', 'Education Service', 'NFI/Clothes/Shoes Service', 'Water/Sanitation Service', 'Registration Service', 'Food Service', 'Other Service']
yes_no = ['Yes', 'No']
agency = ["GreenLife West Africa", "MSWGCA", "Plan International", "St. George Foundation", "UNICEF", "Save the Children"]



(0..1000).each do |i|
  concerns = []
  (0..rand(5)).each do |j|
    concerns << {
      protection_concern_type: protection_concerns[rand(protection_concerns.size)],
      risk_level_protection_concern: risk_level[rand(risk_level.size)],
      date_field_concern_identified: rand(400).days.ago
    }
  end

  services = []
  (0..rand(5)).each do |j|
    services << {
      service_type: service[rand(service.size)],
      service_appointment_date: rand(400).days.ago
    }
  end

  followups = []
  (0..rand(5)).each do |j|
    followups << {
      service_type: service[rand(service.size)],
      followup_date: rand(400).days.ago
    }
  end


  Child.create!(
    name: "Test Case #{i.to_s}",
    age: rand(18),
    sex: sexes[rand(sexes.size)],
    status: status[rand(status.size)],
    record_state: true,
    module_id: 'primeromodule-cp',
    owned_by: user_names[rand(user_names.size)],
    owned_by_agency: agency[rand(agency.size)],
    owned_by_location_district: district[rand(district.size)],
    registration_date: rand(400).days.ago,
    protection_concern_detail_subform_section: concerns,
    services_section: services,
    followup_subform_section: followups
  )
end