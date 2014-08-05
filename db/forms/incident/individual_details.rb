individual_details_fields = [
  Field.new({"name" => "id_number",
             "type" => "text_field",
             "display_name_all" => "Child ID",
            }),
  Field.new({"name" => "survivor_code",
             "type" => "text_field",
             "display_name_all" => "Survivor Code",
            }),
  Field.new({"name" => "individual_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "sex",
             "type" => "select_box",
             "display_name_all" => "What is the sex of the child?",
             "option_strings_text_all" =>
                          ["Female",
                           "Male",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "date_of_birth",
             "type" => "date_field",
             "display_name_all" => "What is the child's Date of Birth?",
            }),
  Field.new({"name" => "age",
             "type" => "numeric_field",
             "display_name_all" => "What is the child's age?",
            }),
  Field.new({"name" => "estimated",
             "type" => "radio_button",
             "display_name_all" => "Is the age estimated?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "ethnicity",
             "type" => "select_box",
             "display_name_all" => "What is the ethnic affiliation of the individual?",
             "option_strings_text_all" =>
                          ["Ethnicity1",
                           "Ethnicity2",
                           "Ethnicity3"].join("\n")
            }),
  Field.new({"name" => "nationality",
             "type" => "select_box",
             "display_name_all" => "What is the national affiliation of the individual?",
             "option_strings_text_all" =>
                          ["Nationality1",
                           "Nationality2",
                           "Nationality3"].join("\n")
            }),
  Field.new({"name" => "religion",
             "type" => "select_box",
             "display_name_all" => "What is the religious affiliation of the individual?",
             "option_strings_text_all" =>
                          ["Religion1",
                           "Religion2",
                           "Religion3"].join("\n")
            }),
  Field.new({"name" => "country_of_origin",
             "type" => "select_box",
             "display_name_all" => "Country of Origin",
             "option_strings_text_all" =>
                          ["Country1",
                           "Country2",
                           "Country3"].join("\n")
            }),
  Field.new({"name" => "displacement_status",
             "type" => "select_box",
             "display_name_all" => "Displacement Status at time of report",
             "option_strings_text_all" =>
                          ["Resident",
                           "IDP",
                           "Refugee",
                           "Stateless Person",
                           "Returnee",
                           "Foreign National",
                           "Asylum Seeker",
                           "N/A"].join("\n")
            }),
  Field.new({"name" => "care_arrangements_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "What were the care arrangements for the child at the time of the incident/violation(s)?",
             "option_strings_text_all" =>
                          ["Both Parents",
                           "Lone Parent",
                           "Other Family",
                           "Foster Family",
                           "Care Home",
                           "Independent Living",
                           "Other",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "child_consent_data_sharing",
             "type" => "select_box",
             "display_name_all" => "With whom is the child and/or adult caregiver willing to share their name and other personal details?",
             "option_strings_text_all" =>
                          ["Anonymous",
                           "Agency Only",
                           "Task Force",
                           "Perpetrator",
                           "Prosecutor"].join("\n")
            }),
  Field.new({"name" => "child_consent_follow_up",
             "type" => "radio_button",
             "display_name_all" => "Is the child and/or adult caregiver willing to be contacted again about the violations?",
             "option_strings_text_all" =>
                          ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "child_consent_referral",
             "type" => "radio_button",
             "display_name_all" => "Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support?",
             "option_strings_text_all" =>
                          ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "create_case",
             "type" => "radio_button",
             "display_name_all" => "Should a case be created for this child to receive further services?",
             "option_strings_text_all" =>
                          ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "maritial_status",
             "type" => "select_box",
             "display_name_all" => "Current civil/marital status",
             "option_strings_text_all" =>
                          ["Single",
                           "Married/Cohabitating",
                           "Divorced/Separated",
                           "Widowed"].join("\n")
            }),
  Field.new({"name" => "disability_type",
             "type" => "select_box",
             "display_name_all" => "Disability Type",
             "option_strings_text_all" =>
                          ["Mental Disability",
                           "Physical Disability",
                           "Both"].join("\n")
            }),
  Field.new({"name" => "unaccompanied_separated_status",
             "type" => "select_box",
             "display_name_all" => "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?",
             "option_strings_text_all" =>
                          ["No",
                           "Unaccompanied Minor",
                           "Separated Child",
                           "Other Vulnerable Child"].join("\n")
            })
]

individual_details_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 1,
  :unique_id => "individual_details_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => individual_details_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Individual Details Subform",
  "description_all" => "Nested Individual Details Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["sex", "age"]
})

FormSection.create_or_update_form_section({
  :unique_id => "individual_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Individual Details",
  "editable" => true,
  :fields => [Field.new({"name" => "individual_details_subform_section",
                         "type" => "subform", "editable" => true,
                         "subform_section_id" => individual_details_subform_section.id,
                         "display_name_all" => "Individual Details"
                        })
             ],
  :perm_enabled => true,
  "name_all" => "Individual Details",
  "description_all" => "Individual Details"
})