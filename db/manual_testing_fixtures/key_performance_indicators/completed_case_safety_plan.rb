require_relative 'setup.rb'

# Create test case
Child.new_with_user(TEST_USER, {
    "age"=>100,
    "sex"=>"male",
    "name"=>"Mc Donalds",
    "status"=>"open",
    "occupation"=>"Fast Food",
    "hidden_name"=>true,
    "gbv_religion"=>"religion3",
    "date_of_birth"=>Date.parse("1940/05/15"),
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
    "unaccompanied_separated_status"=>"no",
    "safety_plan" => [{
      'safety_plan_needed' => 'yes',
      'safety_plan_developed_with_survivor' => 'yes',
      'safety_plan_completion_date' => Date.today,
      'safety_plan_main_concern' => 'covid-19',
      'safety_plan_preparedness_signal' => 'Firing workers',
      'safety_plan_preparedness_gathered_things' => 'Ill prespared'
    }]
}).save!

# Create test case
Child.new_with_user(TEST_USER, {
    "age"=>100,
    "sex"=>"male",
    "name"=>"Burger King",
    "status"=>"open",
    "occupation"=>"Fast Food",
    "hidden_name"=>true,
    "gbv_religion"=>"religion3",
    "date_of_birth"=>Date.parse("1953/05/15"),
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
    "unaccompanied_separated_status"=>"no",
    "safety_plan" => [{
      'safety_plan_needed' => 'yes'
    }]
}).save!

puts 'Created test cases with safety_plan forms'
