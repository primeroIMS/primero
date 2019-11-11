TOTAL_COUNT_OF_RECORDS = 1000
PATH = 'db/dev_fixtures/names/'.freeze


@users = {
  cp: %w[primero_cp primero_cp_admin],
  gbv: ['primero_gbv']
}

@agencies = Agency.all.all

## Locations
@amman_locations = Location.by_ancestor(key: 'JOR005').to_a.select { |l| l.admin_level == 3 }
@mafraq_locations = Location.by_ancestor(key: 'JOR011').to_a.select { |l| l.admin_level == 3 }
@zaatari_locations = [Location.find_by_location_code('JORCEEDF86')]
@irbid_locations = Location.by_ancestor(key: 'JOR007').to_a.select { |l| l.admin_level == 3 }
@zarqa_locations = Location.by_ancestor(key: 'JOR012').to_a.select { |l| l.admin_level == 3 }
@azraq_locations = [Location.find_by_location_code('JORB3C07B5')]
@balqa_locations = Location.by_ancestor(key: 'JOR002').to_a.select { |l| l.admin_level == 3 }
@madaba_locations = Location.by_ancestor(key: 'JOR010').to_a.select { |l| l.admin_level == 3 }
@jarash_locations = Location.by_ancestor(key: 'JOR008').to_a.select { |l| l.admin_level == 3 }
@karak_locations = Location.by_ancestor(key: 'JOR004').to_a.select { |l| l.admin_level == 3 }
@maan_locations = Location.by_ancestor(key: 'JOR009').to_a.select { |l| l.admin_level == 3 }
@ajlun_locations = Location.by_ancestor(key: 'JOR001').to_a.select { |l| l.admin_level == 3 }
@tafilah_locations = Location.by_ancestor(key: 'JOR006').to_a.select { |l| l.admin_level == 3 }
@all_level_3_locations = Location.by_admin_level(key: 3).to_a

sexes = %w[male female]
status = %w[open closed]
risk_level = %w[high medium low]
date_concern_identified = %w[follow_up_after_reunification follow_up_in_care registration reunification verification]
service_types = Lookup.find('lookup-service-type').lookup_values.map { |lv| lv['id'] }

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

closure_reasons = %w[death_of_child formal_closing not_seen_during_verification repatriated transferred other]

type_of_violence = %w[
  rape
  sexual_assault
  physical_assault
  forced_marriage
  denial_of_resources_opportunities_or_services
  psychological_emotional_abuse
  non-gbv
]

case_referred_by = %w[unhcr unicef health_facility specialized_service]

def read_file(filename)
  f = File.open(filename, 'r')

  names = []
  f.each_line do |line|
    l = line.delete("\n").delete("\r")
    names.push(l)
  end

  f.close
  names
end

def get_random_user(type)
  User.find_by_user_name(@users[type].sample)
end

def age(birthday)
  (Time.now.to_s(:number).to_i - birthday.to_time.to_s(:number).to_i) / 10e9.to_i
end

def random_date(from = nil, to = nil)
  to ||= DateTime.now
  from ||= 18.years.ago
  Time.at((from.to_f - to.to_f) * rand + to.to_f)
end

def get_location
  location_set = nil
  chance_in_thousand = rand(1000)
  location_set = if chance_in_thousand < 283 # Amman
                   @amman_locations
                 elsif chance_in_thousand < 523 # Mafraq
                   if [true, false].sample
                     @zaatari_locations # Zaatari Camp
                   else
                     @mafraq_locations
                   end
                 elsif chance_in_thousand < 730 # Irbid
                   @irbid_locations
                 elsif chance_in_thousand < 895 # Zarqa
                   if rand(10) < 3
                     @azraq_locations # Azraq Camp
                   else
                     @zarqa_locations
                   end
                 elsif chance_in_thousand < 923 # Balqa
                   @balqa_locations
                 elsif chance_in_thousand < 941 # Madaba
                   @madaba_locations
                 elsif chance_in_thousand < 955 # Jarash
                   @jarash_locations
                 elsif chance_in_thousand < 968 # Karak
                   @karak_locations
                 elsif chance_in_thousand < 980 # Maan
                   @maan_locations
                 elsif chance_in_thousand < 991 # Ajlun
                   @ajlun_locations
                 elsif chance_in_thousand < 993 # Tafilah
                   @tafilah_locations
                 else # Array for choosing a random level-3 location
                   @all_level_3_locations
                 end
  location_set[rand(location_set.length)].try(:location_code)
end

def create_users(type = 'cp')
  user_type = type == 'cp' ? :cp : :gbv
  user_index = 10

  15.times do
    user = User.find_by_user_name "primero_#{type}_#{user_index}"

    unless user.present?
      user = User.create!(
        'user_name' => "primero_#{type}_#{user_index}",
        'password' => 'qu01n23!',
        'password_confirmation' => 'qu01n23!',
        'full_name' => "#{type.upcase} Worker #{user_index}",
        'email' => "primero_#{type}_#{user_index}@primero.com",
        'disabled' => 'false',
        'organization' => @agencies.sample.id,
        'role_ids' => [
          Role.by_name(key: type == 'cp' ? 'CP Case Worker' : 'GBV Social Worker').first.id
        ],
        'module_ids' => [PrimeroModule.by_name(key: type.upcase).first.id],
        'user_group_ids' => [UserGroup.by_name(key: "Primero #{type.upcase}").first.id],
        'location' => get_location
      )
    end

    @users[user_type] << user.user_name

    user_index += 1
  end
end

def user_agency(user)
  user.agency.try(:id)
end

# File Paths
names = read_file("#{PATH}arabic_names.csv")
surnames = read_file("#{PATH}arabic_surnames.csv")

create_users
create_users('gbv')

(0..TOTAL_COUNT_OF_RECORDS).each do |_i|
  selected_user = get_random_user(:cp)

  next unless selected_user.present?
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
  chosen_location = get_location

  child_dob = random_date
  child_age = age(child_dob)
  registration_date = random_date(rand(400).days.ago)
  timestamps = [(registration_date - rand(3).days), registration_date].sample
  closure_date = random_date(registration_date + 1)
  response_types = %w[care_plan action_plan service_provision]
  timeframes = %w[1_hour 1_day 3_days]

  services = []
  (0..rand(3)).each do |_ss|
    services << {
      service_response_type: response_types.sample,
      service_type: service_types.sample,
      service_response_day_time: random_date(registration_date),
      service_response_timeframe: timeframes.sample,
      service_implementing_agency: user_agency(selected_user),
      service_implemented_day_time: [nil, random_date(registration_date, closure_date)].sample
    }
  end

  child = Child.new_with_user_name(selected_user,
                                   name_first: names.sample,
                                   name_last: surnames.sample,
                                   age: child_age,
                                   date_of_birth: I18n.l(child_dob),
                                   sex: sexes[rand(sexes.size)],
                                   status: status[rand(status.size)],
                                   location_current: chosen_location,
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
                                   services_section: services,
                                   case_referred_by: case_referred_by.sample)

  if child.status == 'closed'
    child.closure_reason = closure_reasons.sample
    child.date_closure = closure_date
  end

  child.save!
end

(0..TOTAL_COUNT_OF_RECORDS).each do |_i|
  selected_user = get_random_user(:gbv)

  next unless selected_user.present?
  registration_date = random_date(rand(400).days.ago)
  timestamps = [(registration_date - rand(3).days), registration_date].sample

  date_of_first_report = random_date(rand(400).days.ago)

  incident = Incident.new_with_user_name(selected_user,
                                         module_id: 'primeromodule-gbv',
                                         created_at: timestamps,
                                         posted_at: timestamps,
                                         last_updated_at: timestamps,
                                         status: %w[open closed].sample,
                                         date_of_first_report: date_of_first_report.strftime('%d-%b-%Y'),
                                         incident_date: random_date(date_of_first_report - rand(400), date_of_first_report).strftime('%d-%b-%Y'),
                                         incident_location: get_location,
                                         gbv_sexual_violence_type: type_of_violence.sample)
  incident.save!
end
