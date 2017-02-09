gbv_individual_details_fields = [
  Field.new({"name" => "survivor_code",
             "type" => "text_field",
             "display_name_all" => "Survivor Code",
            }),
  Field.new({"name" => "sex",
             "type" => "radio_button",
             "display_name_all" => "What is the sex of the survivor?",
             "option_strings_text_all" =>
                          ["Female",
                           "Male",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "date_of_birth",
             "type" => "date_field",
             "display_name_all" => "What is the survivor's Date of Birth?",
             "date_validation" => "not_future_date"
            }),
  Field.new({"name" => "age",
             "type" => "numeric_field",
             "display_name_all" => "What is the survivor's age?",
            }),
  Field.new({"name" => "estimated",
             "type" => "radio_button",
             "display_name_all" => "Is the age estimated?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "ethnicity",
             "type" => "select_box",
             "display_name_all" => "What is the ethnic affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-ethnicity"
            }),
  Field.new({"name" => "nationality",
             "type" => "select_box",
             "display_name_all" => "What is the national affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-nationality"
            }),
  Field.new({"name" => "religion",
             "type" => "select_box",
             "display_name_all" => "What is the religious affiliation of the survivor?",
             "option_strings_source" => "lookup lookup-religion"
            }),
  Field.new({"name" => "country_of_origin",
             "type" => "select_box",
             "display_name_all" => "Country of Origin",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "displacement_status",
             "type" => "select_box",
             "display_name_all" => "Displacement Status at time of report",
             "option_strings_source" => "lookup lookup-displacement-status"
            }),
  Field.new({"name" => "maritial_status",
             "type" => "select_box",
             "display_name_all" => "Current civil/marital status",
             "option_strings_text_all" =>
                          ["Single",
                           "Married / Cohabitating",
                           "Divorced / Separated",
                           "Widowed"].join("\n")
            }),
  Field.new({"name" => "disability_type",
             "type" => "radio_button",
             "display_name_all" => "Disability Type",
             "option_strings_text_all" =>
                          ["Mental Disability",
                           "Physical Disability",
                           "Both"].join("\n")
            }),
  Field.new({"name" => "unaccompanied_separated_status",
             "type" => "select_box",
             "display_name_all" => "Is the survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?",
             "option_strings_source" => "lookup lookup-unaccompanied-separated-status",
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "gbv_individual_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 50,
  :order => 15,
  :order_subform => 0,
  :form_group_name => "GBV Individual Details",
  "editable" => true,
  :fields => gbv_individual_details_fields,
  "name_all" => "GBV Individual Details",
  "description_all" => "GBV Individual Details"
})
