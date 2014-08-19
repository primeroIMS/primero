survivor_information_fields = [
  Field.new({"name" => "case_ID",
             "type" => "text_field", 
             "display_name_all" => "Case ID",
             "editable" => false
            }),
  Field.new({"name" => "short_ID",
             "type" => "text_field", 
             "display_name_all" => "Short ID",
             "editable" => false
            }),
  Field.new({"name" => "child_status",
             "type" =>"select_box" ,
             "display_name_all" => "Case Status",
             "option_strings_text_all" => 
                          ["Open",
                           "Closed ",
                           "Transferred",
                           "Duplicate"].join("\n")
            }),
  Field.new({"name" => "name",
             "type" => "text_field",
             "display_name_all" => "Name",
             "highlight_information" => HighlightInformation.new("highlighted" => true,"order"=>1),
             "hidden_text_field" => true
            }),
  Field.new({"name" => "survivor_code_no",
             "type" => "text_field", 
             "display_name_all" => "Survivor Code"
            }),
  Field.new({"name" => "gbv_date_of_birth",
            "type" => "date_field",
            "display_name_all" => "Date of Birth"
            }),
  Field.new({"name" => "gbv_sex",
             "type" => "select_box",
             "option_strings_text_all" => "Female\nMale",
             "display_name_all" => "Sex"
            }),
  Field.new({"name" => "ethnicity",
             "type" => "select_box",
             "display_name_all" => "Clan or Ethnicity",
             "option_strings_text_all" =>
                          ["Ethnicity1",
                           "Ethnicity2",
                           "Ethnicity3"].join("\n")
            }),
  Field.new({"name" => "country_of_origin",
             "type" => "select_box", 
             "display_name_all" => "Country of Origin",
             "option_strings_text_all" =>
                          ["Country1",
                           "Country2",
                           "Country3"].join("\n")
            }),
  Field.new({"name" => "nationality",
             "type" => "select_box",
             "display_name_all" => "Nationality (if different than country of origin)",
             "option_strings_text_all" =>
                          ["Nationality1",
                           "Nationality2",
                           "Nationality3"].join("\n")
            }),
  Field.new({"name" => "religion",
             "type" => "select_box", 
             "display_name_all" => "Religion",
             "option_strings_text_all" =>
                          ["Religion1",
                           "Religion2",
                           "Religion3"].join("\n")
            }),
  Field.new({"name" => "maritial_status",
             "type" =>"select_box" ,
             "display_name_all" => "Current Civil/Marital Status",
             "option_strings_text_all" => 
                          ["Single",
                           "Married/Cohabitating",
                           "Divorced/Separated",
                           "Widowed"].join("\n")
            }),
  Field.new({"name" => "dependents_no",
             "type" =>"textarea" ,
             "display_name_all" => "Number and age of children and other dependents"
            }),
  Field.new({"name" => "occupation",
             "type" => "text_field",
             "display_name_all" => "Occupation"
            }),
  Field.new({"name" => "gbv_displacement_status",
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
  Field.new({"name" => "gbv_disability_type",
             "type" => "select_box", 
             "display_name_all" => "Is the Client a Person with Disabilities?",
             "option_strings_text_all" =>
                          ["No",
                           "Mental Disability",
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
            }),
  Field.new({"name" => "section_heading_child_survivors_less_than_18_years_old",
             "type" => "separator",
             "display_name_all" => "Child Survivors (less than 18 years old)"
            }),
  Field.new({"name" => "survivor_lives_alone",
             "type" => "radio_button",
             "display_name_all" => "If the survivor is a child, does he/she live alone?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "survivor_caretaker",
             "type" => "select_box",
             "display_name_all" => "If the survivor lives with someone, what is the relation between her/him and the caretaker?",
             "option_strings_text_all" =>
                          ["Parent/Guardian",
                           "Relative",
                           "Spouse/Cohabitating",
                           "Other, please specify"].join("\n")
            }),
  Field.new({"name" => "survivor_caretaker_other",
             "type" => "text_field",
             "display_name_all" => "If other relation between her/him and the caretaker, please specify."
            }),
  Field.new({"name" => "caretaker_marital_status",
             "type" => "select_box",
             "display_name_all" => "What is the caretaker's current marital status?",
             "option_strings_text_all" =>
                          ["Single",
                           "Married/Cohabitating",
                           "Divorced/Separated",
                           "Widowed",
                           "Unknown/Not Applicable"].join("\n")
            }),
  Field.new({"name" => "caretaker_occupation",
             "type" => "text_field",
             "display_name_all" => "What is the caretaker's primary occupation?"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"gbv_survivor_information",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 60,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => survivor_information_fields,
  :perm_enabled => true,
  "name_all" => "Survivor Information",
  "description_all" => "Survivor Information"
})