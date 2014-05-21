basic_identity_fields = [
  Field.new({"name" => "case_id",
             "type" => "text_field", 
             "editable" => false,
             "display_name_all" => "Case ID"
            }),
  Field.new({"name" => "registration_date",
             "type" => "date_field", 
             "display_name_all" => "Registration Date"
            }),
  Field.new({"name" => "agency_id",
            "type" => "text_field",
            "display_name_all" => "Agency ID"
            }),
  Field.new({"name" => "agency_name",
            "type" => "text_field",
            "display_name_all" => "Agency Name"
            }),
  Field.new({"name" => "icrc_ref_no",
             "type" => "text_field",
             "display_name_all" => "ICRC Ref No."
            }),  
  Field.new({"name" => "rc_id_no",
             "type" => "text_field",
             "highlight_information"=>HighlightInformation.new("highlighted"=>true,"order"=>2),
             "display_name_all" => "RC ID No."
            }),        
  Field.new({"name" => "id_document",
             "type" => "text_field",
             "display_name_all" => "UNHCR ID"
            }),  
  Field.new({"name" => "protection_status",
             "type" => "select_box",
             "option_strings_text_all" => "Unaccompanied\nSeparated",
             "highlight_information" => HighlightInformation.new("highlighted" => true,"order"=>3),
             "display_name_all" => "Protection Status"
            }),
  Field.new({"name" => "urgent_protection_concern",
             "type" => "select_box",
             "display_name_all" => "Urgent Protection Concern?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "survivor_code",
             "type" => "text_field", 
             "display_name_all" => "Survivor Code"
            }), 
  Field.new({"name" => "name",
             "type" => "text_field",
             "display_name_all" => "Name",
             "highlight_information" => HighlightInformation.new("highlighted" => true,"order"=>1),
            }),
  Field.new({"name" => "name_nickname",
             "type" => "text_field",
             "display_name_all" => "Nickname"
            }),
  Field.new({"name" => "name_other",
             "type" => "text_field",
             "display_name_all" => "Other Name"
            }),
  Field.new({"name" => "sex",
             "type" => "select_box",
             "option_strings_text_all" => "Male\nFemale",
             "display_name_all" => "Sex"
            }),                  
  Field.new({"name" => "age",
             "type" => "text_field",
             "display_name_all" => "Age"
            }),
  Field.new({"name" => "date_of_birth",
            "type" => "date_field",
            "display_name_all" => "Date of Birth"
            }),
  Field.new({"name" => "estimated",
             "type" => "select_box",
             "display_name_all" => "Estimated",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "personal_ID_document",
             "type" => "text_field",
             "display_name_all" => "Personal ID Document (Type and No.)"
            }),
  Field.new({"name" => "documents_carried",
             "type" => "text_field",
             "display_name_all" => "Other Documents Carried"
            }),
  Field.new({"name" => "birth_certificate",
             "type" => "select_box",
             "display_name_all" => "Birth Certificate?",
             "option_strings_text_all" => "Yes\nNo",
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
  Field.new({"name" => "occupation",
             "type" => "text_field",
             "display_name_all" => "Occupation"
            }),
  Field.new({"name" => "physical_characteristics",
             "type" => "textarea",
             "display_name_all" => "Distinguishing Physical Characteristics"
            }),
  Field.new({"name" => "displacement_status",
             "type" =>"select_box" ,
             "display_name_all" => "Displacement Status",
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
  Field.new({"name" => "disability_type",
             "type" =>"select_box" ,
             "display_name_all" => "Disability Type",
             "option_strings_text_all" => 
                          ["Mental Disability",
                           "Physical Disability",
                           "Both"].join("\n")
            }), 
            
  # TODO should be configurable
  Field.new({"name" => "nationality",
             "type" =>"select_box" ,
             "display_name_all" => "Nationality",
             "option_strings_text_all" => 
                          ["Congolese",
                           "Guinean",
                           "Ivorian",
                           "Liberian",
                           "Other",
                           "Sierra Leonean",
                           "Sudanese",
                           "Ugandan",
                           "World Citizen",
                           "World Citizen-2",
                           "World Citizen-3"].join("\n")
            }),
      
  Field.new({"name" => "place_of_birth",
             "type" => "text_field",
             "display_name_all" => "Place of Birth"
            }),
        
  # TODO should be configurable
  Field.new({"name" => "country_of_birth",
             "type" =>"select_box" ,
             "display_name_all" => "Birth Country",
             "option_strings_text_all" => 
                          ["Country1",
                           "Country2",
                           "Country3",
                           "Country4"].join("\n")
            }),
            
  # TODO should be configurable
  Field.new({"name" => "country_of_origin",
             "type" =>"select_box" ,
             "display_name_all" => "Country of Origin",
             "option_strings_text_all" => 
                          ["Country1",
                           "Country2",
                           "Country3",
                           "Country4"].join("\n")
            }),
            
  Field.new({"name" => "address_current",
             "type" => "textarea",
             "display_name_all" => "Current Address"
            }),
  Field.new({"name" => "landmark",
             "type" => "text_field",
             "display_name_all" => "Landmark"
            }),
            
            
            
            
            Field.new({"name" => "status",
                   "type" => "select_box",
                   "option_strings_text_all" => "Open\nClosed",
                   "display_name_all" => "Status"
                  })
]

FormSection.create_or_update_form_section({
  :unique_id=>"basic_identity",
  "visible" => true,
  :order => 1,
  "editable" => true,
  :fields => basic_identity_fields,
  :perm_enabled => true,
  "name_all" => "Basic Identity",
  "description_all" => "Basic identity information about a separated or unaccompanied child."
})