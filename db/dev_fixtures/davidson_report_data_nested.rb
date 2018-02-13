sexes = ['male', 'female']
child_status = ['open', 'closed']
risk_level = ['high', 'medium', 'low']

needs_mapping = {
  sexually_exploited: "sv-va",
  gbv_survivor: "sv-va",
  arrested_detained: "cr-cl",
  migrant: "lp-md",
  disabled: "ds-pm",
  serious_health_issue: "sm-cc",
  refugee: "lp-md",
  caafag: "cr-af",
  street_child: "cr-ne",
  child_mother: "cr-cc",
  physically_or_mentally_abused: "lp-an",
  worst_forms_of_child_labor: "cr-lw",
  child_headed_household: "sc-ch"
}

user_names = ["primero_cp", "primero_admin_cp"]
displacement_status = [
  "resident",
  "idp",
  "refugee",
  "stateless_person",
  "returnee",
  "foreign_national",
  "asylum_seeker"
]

protection_concerns = [
  "sexually_exploited",
  "gbv_survivor",
  "trafficked_smuggled",
  "statelessness",
  "arrested_detained",
  "migrant",
  "disabled",
  "serious_health_issue",
  "refugee",
  "caafag",
  "street_child",
  "child_mother",
  "physically_or_mentally_abused",
  "living_with_vulnerable_person",
  "worst_forms_of_child_labor",
  "child_headed_household",
  "mentally_distressed",
  "other"
]
protection_statuses = ["unaccompanied", "separated"]
agency = ['agency-unicef']

#locations
amman_locations = Location.by_ancestor(key: 'JOR005').to_a.select{|l| l.admin_level==3}
mafraq_locations = Location.by_ancestor(key: 'JOR011').to_a.select{|l| l.admin_level==3}
zaatari_locations = [Location.find_by_location_code('JORCEEDF86')]
irbid_locations = Location.by_ancestor(key: 'JOR007').to_a.select{|l| l.admin_level==3}
zarqa_locations = Location.by_ancestor(key: 'JOR012').to_a.select{|l| l.admin_level==3}
azraq_locations = [Location.find_by_location_code('JORB3C07B5')]
balqa_locations = Location.by_ancestor(key: 'JOR002').to_a.select{|l| l.admin_level==3}
madaba_locations = Location.by_ancestor(key: 'JOR010').to_a.select{|l| l.admin_level==3}
jarash_locations = Location.by_ancestor(key: 'JOR008').to_a.select{|l| l.admin_level==3}
karak_locations = Location.by_ancestor(key: 'JOR004').to_a.select{|l| l.admin_level==3}
maan_locations = Location.by_ancestor(key: 'JOR009').to_a.select{|l| l.admin_level==3}
ajlun_locations = Location.by_ancestor(key: 'JOR001').to_a.select{|l| l.admin_level==3}
tafilah_locations = Location.by_ancestor(key: 'JOR006').to_a.select{|l| l.admin_level==3}
all_level_3_locations = Location.by_admin_level(key: 3).to_a
binding.pry
(0..1000).each do |i|
  concerns = []
  concern_details = []
  unhcr_needs_codes = []
  (0..rand(5)).each do |j|
    concern = protection_concerns[rand(protection_concerns.size)]
    concerns << concern
    concern_details << {
      concern_action_taken_already: [true, false].sample,
      concern_is_resolved: [true, false].sample,
      date_concern_identified: rand(400).days.ago,
      protection_concern_type: concern,
    }
    needs_code = needs_mapping[concern]
    unhcr_needs_codes >> needs_code if needs_code
  end

  # Determine location. This all based on some quick,
  # back-of-the-napkin math from research on Jordanian refugee figures
  location_set = nil
  chance_in_thousand = rand(1000)
  if chance_in_thousand < 283 #Amman
    location_set = amman_locations
  elsif chance_in_thousand < 523 #Mafraq
    if [true, false].sample
      location_set = zaatari_locations #Zaatari Camp
    else
      location_set = mafraq_locations
    end
  elsif chance_in_thousand < 730 #Irbid
    location_set = irbid_locations
  elsif chance_in_thousand < 895 #Zarqa
    if (rand(10) < 3)
      location_set = azraq_locations #Azraq Camp
    else
      location_set = zarqa_locations
    end
  elsif chance_in_thousand < 923 #Balqa
    location_set = balqa_locations
  elsif chance_in_thousand < 941 #Madaba
    location_set = madaba_locations
  elsif chance_in_thousand < 955 #Jarash
    location_set = jarash_locations
  elsif chance_in_thousand < 968 #Karak
    location_set = karak_locations
  elsif chance_in_thousand < 980 #Maan
    location_set = maan_locations
  elsif chance_in_thousand < 991 #Ajlun
    location_set = ajlun_locations
  elsif chance_in_thousand < 993 #Tafilah
    location_set = tafilah_locations
  else #Array for choosing a random level-3 location
    location_set = all_level_3_locations
  end
  chosen_location = location_set[rand(location_set.length)]

  Child.create!(
    name: "Test Case #{i.to_s}",
    age: rand(18),
    sex: sexes[rand(sexes.size)],
    child_status: child_status[rand(child_status.size)],
    location_current: chosen_location.location_code,
    record_state: true,
    module_id: 'primeromodule-cp',
    owned_by: user_names[rand(user_names.size)],
    owned_by_agency: agency[rand(agency.size)],
    protection_status: protection_statuses[rand(protection_statuses.size)],
    registration_date: rand(400).days.ago,
    risk_level: risk_level[rand(risk_level.size)],
    protection_concerns: concerns,
    protection_concern_detail_subform_section: concern_details,
    unhcr_needs_codes: unhcr_needs_codes,
    urgent_protection_concern: [true, false].sample,
    displacement_status: displacement_status[rand(displacement_status.size)]
  )
end