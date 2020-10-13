require_relative "setup.rb"

# Create test cases
Child.new_with_user(TEST_USER, {
  "action_plan" => [{
    "gbv_follow_up_subform_section" => [{
      "service_type_provided" => "safehouse_service"
    },{
      "service_type_provided" => "health_medical_service"
    },{
      "service_type_provided" => "psychosocial_service"
    },{
      "service_type_provided" => "police_other_service"
    },{
      "service_type_provided" => "legal_assistance_service"
    },{
      "service_type_provided" => "livelihoods_service"
    },{
      "service_type_provided" => "child_protection_service"
    },{
      "service_type_provided" => "family_mediation_service"
    },{
      "service_type_provided" => "family_seunification_service"
    },{
      "service_type_provided" => "education_service"
    },{
      "service_type_provided" => "nfi_clothes_shoes_service"
    },{
      "service_type_provided" => "water_sanitation_service"
    },{
      "service_type_provided" => "registration_service"
    },{
      "service_type_provided" => "food_service"
    },{
      "service_type_provided" => "other_service"
    }]
  }]
}).save!
