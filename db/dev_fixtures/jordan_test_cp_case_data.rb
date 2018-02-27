def read_file(filename)
  f = File.open(filename, "r")

  names = []
  f.each_line do |line|
      l=line.delete("\n").delete("\r")
      names.push(l)
  end

  f.close
  names
end

def get_random_user
  users = %w[primero_cp primero_admin_cp]
  return User.find_by_user_name(users.sample)
end

def age(birthday)
  (Time.now.to_s(:number).to_i - birthday.to_time.to_s(:number).to_i) / 10e9.to_i
end

def random_date(from=nil)
  to = DateTime.now
  from = from || 18.years.ago
  Time.at((from.to_f - to.to_f) * rand + to.to_f)
end

path="db/dev_fixtures/names/"
names = read_file("#{path}arabic_names.csv")
surnames = read_file("#{path}arabic_surnames.csv")
sexes = %w[male female]
child_status = %w[open closed]
risk_level = %w[high medium low]
date_concern_identified = %w[follow_up_after_reunification follow_up_in_care registration reunification verification]
service_types = Lookup.find('lookup-service-type').lookup_values.map{|lv| lv['id']}

needs_mapping = {
  sexually_exploited: 'sv-va',
  gbv_survivor: 'sv-va',
  arrested_detained: 'cr-cl',
  migrant: 'lp-md',
  disabled: 'ds-pm',
  serious_health_issue: 'sm-cc',
  refugee: 'lp-md',
  caafag: 'cr-af',
  street_child: 'cr-ne',
  child_mother: 'cr-cc',
  physically_or_mentally_abused: 'lp-an',
  worst_forms_of_child_labor: 'cr-lw',
  child_headed_household: 'sc-ch'
}

displacement_status = %w[
  resident
  idp
  refugee
  stateless_person
  returnee
  foreign_national
  asylum_seeker
]

protection_concerns = %w[
  sexually_exploited
  gbv_survivor
  trafficked_smuggled
  statelessness
  arrested_detained
  migrant
  disabled
  serious_health_issue
  refugee
  caafag
  street_child
  child_mother
  physically_or_mentally_abused
  living_with_vulnerable_person
  worst_forms_of_child_labor
  child_headed_household
  mentally_distressed
  other
]
protection_statuses = %w[unaccompanied separated]
agency = ['agency-unicef']

# locations
amman_locations = Location.by_ancestor(key: 'JOR005').to_a.select { |l| l.admin_level == 3 }
mafraq_locations = Location.by_ancestor(key: 'JOR011').to_a.select { |l| l.admin_level == 3 }
zaatari_locations = [Location.find_by_location_code('JORCEEDF86')]
irbid_locations = Location.by_ancestor(key: 'JOR007').to_a.select { |l| l.admin_level == 3 }
zarqa_locations = Location.by_ancestor(key: 'JOR012').to_a.select { |l| l.admin_level == 3 }
azraq_locations = [Location.find_by_location_code('JORB3C07B5')]
balqa_locations = Location.by_ancestor(key: 'JOR002').to_a.select { |l| l.admin_level == 3 }
madaba_locations = Location.by_ancestor(key: 'JOR010').to_a.select { |l| l.admin_level == 3 }
jarash_locations = Location.by_ancestor(key: 'JOR008').to_a.select { |l| l.admin_level == 3 }
karak_locations = Location.by_ancestor(key: 'JOR004').to_a.select { |l| l.admin_level == 3 }
maan_locations = Location.by_ancestor(key: 'JOR009').to_a.select { |l| l.admin_level == 3 }
ajlun_locations = Location.by_ancestor(key: 'JOR001').to_a.select { |l| l.admin_level == 3 }
tafilah_locations = Location.by_ancestor(key: 'JOR006').to_a.select { |l| l.admin_level == 3 }
all_level_3_locations = Location.by_admin_level(key: 3).to_a

(0..1000).each do |i|
  concerns = []
  concern_details = []
  unhcr_needs_codes = []
  (0..rand(5)).each do |_j|
    concern = protection_concerns[rand(protection_concerns.size)]
    concerns << concern
    concern_details << {
      concern_action_taken_already: [true, false].sample,
      concern_is_resolved: [true, false].sample,
      date_concern_identified: date_concern_identified.sample,
      protection_concern_type: concern
    }
    needs_code = needs_mapping[concern.to_sym]
    unhcr_needs_codes << needs_code if needs_code.present?
  end

  # Determine location. This all based on some quick,
  # back-of-the-napkin math from research on Jordanian refugee figures
  location_set = nil
  chance_in_thousand = rand(1000)
  location_set = if chance_in_thousand < 283 # Amman
                   amman_locations
                 elsif chance_in_thousand < 523 # Mafraq
                   if [true, false].sample
                     zaatari_locations # Zaatari Camp
                   else
                     mafraq_locations
                   end
                 elsif chance_in_thousand < 730 # Irbid
                   irbid_locations
                 elsif chance_in_thousand < 895 # Zarqa
                   if rand(10) < 3
                     azraq_locations # Azraq Camp
                   else
                     zarqa_locations
                   end
                 elsif chance_in_thousand < 923 # Balqa
                   balqa_locations
                 elsif chance_in_thousand < 941 # Madaba
                   madaba_locations
                 elsif chance_in_thousand < 955 # Jarash
                   jarash_locations
                 elsif chance_in_thousand < 968 # Karak
                   karak_locations
                 elsif chance_in_thousand < 980 # Maan
                   maan_locations
                 elsif chance_in_thousand < 991 # Ajlun
                   ajlun_locations
                 elsif chance_in_thousand < 993 # Tafilah
                   tafilah_locations
                 else # Array for choosing a random level-3 location
                   all_level_3_locations
                 end
  chosen_location = location_set[rand(location_set.length)]

  child_dob = random_date
  child_age = age(child_dob)
  registration_date = random_date(rand(400).days.ago)
  timestamps = [(registration_date - rand(3).days), registration_date].sample

  response_types = %w[care_plan action_plan service_provision]
  timeframes = %w[1_hour 1_day 3_days]
  implemented_date = [nil, random_date(registration_date)].sample

  services = []
  (0..rand(3)).each do |ss|
    services << {
      service_response_type: response_types.sample,
      service_type: service_types.sample,
      service_response_day_time: random_date(registration_date),
      service_response_timeframe: timeframes,
      service_implementing_agency: 'agency-unicef',
      service_implemented_day_time: implemented_date
    }
  end

  child = Child.new_with_user_name(get_random_user, {
    name: "#{names.sample} #{surnames.sample}",
    age: child_age,
    date_of_birth: I18n.l(child_dob),
    sex: sexes[rand(sexes.size)],
    child_status: child_status[rand(child_status.size)],
    location_current: chosen_location.location_code,
    record_state: true,
    module_id: 'primeromodule-cp',
    protection_status: protection_statuses[rand(protection_statuses.size)],
    registration_date: registration_date,
    risk_level: risk_level[rand(risk_level.size)],
    protection_concerns: concerns,
    protection_concern_detail_subform_section: concern_details,
    unhcr_needs_codes: unhcr_needs_codes,
    urgent_protection_concern: [true, false].sample,
    displacement_status: displacement_status[rand(displacement_status.size)],
    created_at: timestamps,
    posted_at: timestamps,
    last_updated_at: timestamps,
    services_section: services
  })
  child.save!
end
