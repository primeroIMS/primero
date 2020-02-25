# We assume that bundle exec rails db:seed has already been run and that
# this file is run with bundle exec rails r <filename>

# The number of cases KPI requires:
# * Locations
# * Users with locations
# * Cases created by users with location

require_relative './setup.rb')

# Create test cases
Child.new_with_user(TEST_USER, {
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
