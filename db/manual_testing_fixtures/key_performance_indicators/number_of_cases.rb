# We assume that bundle exec rails db:seed has already been run and that
# this file is run with bundle exec rails r <filename>

# The number of cases KPI requires:
# * Locations
# * Users with locations
# * Cases created by users with location


def find_or_create_location(location_code, attributes)
  location = Location.find_or_initialize_by(location_code: location_code)
  location.update_attributes(attributes)
  location.save!
  location
end

# Check if any county level (admin level 2) locations exist
county_level_location =
  if !Location.exists?(admin_level: 2)
    puts 'Creating locations'
    find_or_create_location('GBR', name: 'United Kingdom', placename: 'United Kingdom', type: 'Country', hierarchy_path: 'GBR', admin_level: 0)
    find_or_create_location('01', name: 'England', placename: 'England', type: 'Region', hierarchy_path: 'GBR.01', admin_level: 1)
    find_or_create_location('41', name: 'London', placename: 'London', type: 'County', hierarchy_path: 'GBR.01.41', admin_level: 2)
  else
    Location.where(admin_level: 2).first
  end

puts "Using location #{county_level_location}"

# Find Agency
unicef = Agency.find_by(agency_code: 'UNICEF')
puts "Using agency #{unicef}"

# Create testing user with location
primero_kpi = User.find_or_initialize_by('user_name' => 'primero_kpi')
primero_kpi.update_attributes(
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'Key Performance Indicator Manual Testing Account',
    'email' => 'primero_kpi@primero.com',
    'disabled' => 'false',
    'agency_id' => unicef.id,
    'role_id' => Role.find_by_name('GBV Manager').id,
    'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
    'locale' => Primero::Application::LOCALE_ENGLISH,
    'location' => county_level_location.location_code
)
primero_kpi.save!
puts "Using user #{primero_kpi} in location #{county_level_location}"
puts <<-LOGIN
  Log in with:
  username: #{primero_kpi.user_name}
  password: #{primero_kpi.password}
LOGIN

# Create test cases
Child.new_with_user(primero_kpi, {
    "age"=>100,
    "sex"=>"female",
    "name"=>"Papa John",
    "status"=>"open",
    "occupation"=>"Pizza Person",
    "hidden_name"=>true,
    "gbv_religion"=>"religion3",
    "date_of_birth"=>Date.parse("Fri, 30 Jan 1920"),
    "dependents_no"=>1,
    "gbv_ethnicity"=>"ethnicity2",
    "notes_section"=>[],
    "gbv_nationality"=>"nationality4",
    "maritial_status"=>"divorced_separated",
    "survivor_code_no"=>1,
    "country_of_origin"=>"algeria",
    "survivor_caretaker"=>"other",
    "gbv_disability_type"=>"physical_disability",
    "caretaker_occupation"=>"Unknown",
    "survivor_lives_alone"=>false,
    "gbv_displacement_status"=>"idp",
    "caretaker_marital_status"=>"unknown_not_applicable",
    "survivor_caretaker_other"=>"None else",
    "unaccompanied_separated_status"=>"no"
}).save!
puts 'Created test case'
