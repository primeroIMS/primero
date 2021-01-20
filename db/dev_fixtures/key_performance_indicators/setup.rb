def sample_box_muller(lower, upper, mean, standard_deviation)
  theta = 2 * Math::PI * rand()
  rho = Math.sqrt(-2 * Math.log(1 - rand()))
  scale = standard_deviation * rho
  return [[lower, mean + scale * Math.cos(theta)].max, upper].min
end

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

TEST_USER = primero_kpi
