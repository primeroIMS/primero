require_relative 'setup.rb'

# Create test case
child = Child.new_with_user(TEST_USER, {
    "age"=>100,
    "sex"=>"male",
    "name"=>"Greggs",
    "status"=>"open",
    "occupation"=>"Steak Bake Baker",
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
    "action_plan" => [{
      'service_type' => 'fiscal',
      'service_referral' => 'advice',
      'service_referral_written_consent' => 'yes'
    }],
})
child.save!

approval = Approval.get!(Approval::CASE_PLAN, child, TEST_USER.user_name, {})
approval.perform!(Approval::APPROVAL_STATUS_APPROVED)

puts 'Created test case with action_plan form completed and approved by supervisor.'
