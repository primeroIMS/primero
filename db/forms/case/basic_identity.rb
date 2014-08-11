basic_identity_fields = [
  Field.new({"name" => "case_id",
             "type" => "text_field", 
             "editable" => false,
             "display_name_all" => "Case ID"
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field", 
             "editable" => false,
             "display_name_all" => "Short ID"
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
  Field.new({"name" => "name_nickname",
             "type" => "text_field",
             "display_name_all" => "Nickname"
            }),
  Field.new({"name" => "name_other",
             "type" => "text_field",
             "display_name_all" => "Other Name"
            }),
  Field.new({"name" => "name_given_post_separation",
             "type" => "radio_button",
             "display_name_all" => "Name(s) given to child after separation?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "registration_date",
             "type" => "date_field", 
             "display_name_all" => "Date of Registration or Interview"
            }),
  Field.new({"name" => "sex",
             "type" => "select_box",
             "option_strings_text_all" => "Male\nFemale",
             "display_name_all" => "Sex"
            }),                  
  Field.new({"name" => "age",
             "type" => "numeric_field",
             "display_name_all" => "Age"
            }),
  Field.new({"name" => "date_of_birth",
            "type" => "date_field",
            "display_name_all" => "Date of Birth"
            }),
  Field.new({"name" => "estimated",
             "type" => "radio_button",
             "display_name_all" => "Estimated",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "physical_characteristics",
             "type" => "textarea",
             "display_name_all" => "Distinguishing Physical Characteristics"
            }),
  Field.new({"name" => "icrc_ref_no",
             "type" => "text_field",
             "display_name_all" => "ICRC Ref No."
            }),  
  Field.new({"name" => "rc_id_no",
             "type" => "text_field",
             "display_name_all" => "RC ID No."
            }),
  Field.new({"name" => "unhcr_id_no",
             "type" => "text_field",
             "display_name_all" => "UNHCR ID"
            }),  
  Field.new({"name" => "un_no",
            "type" => "text_field",
            "display_name_all" => "UN Number"
            }),
  Field.new({"name" => "other_agency_id",
            "type" => "text_field",
            "display_name_all" => "Other Agency ID"
            }),
  Field.new({"name" => "other_agency_name",
            "type" => "text_field",
            "display_name_all" => "Other Agency Name"
            }),
  Field.new({"name" => "documents_carried",
             "type" => "textarea",
             "display_name_all" => "List Details of any documents carried by the child"
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
  Field.new({"name" => "address_current",
             "type" => "textarea",
             "display_name_all" => "Current Address"
            }),
  Field.new({"name" => "landmark_current",
             "type" => "text_field",
             "display_name_all" => "Landmark"
            }),
  #TODO location picker
  Field.new({"name" => "location_current",
             "type" =>"text_field" ,
             "display_name_all" => "Current Location"
            }),
  Field.new({"name" => "address_is_permanent",
             "type" => "radio_button",
             "display_name_all" => "Is this address permanent?",
             "option_strings_text_all" => "Yes\nNo",
            }),  
  Field.new({"name" => "telephone_current",
             "type" => "text_field",
             "display_name_all" => "Current Telephone"
            }),
  #TODO verify this
  Field.new({"name" => "dependents_no",
             "type" =>"text_field" ,
             "display_name_all" => "Number and age of children and other dependents"
            }),
  Field.new({"name" => "location_camp",
             "type" =>"text_field" ,
             "display_name_all" => "Camp"
            }),
  Field.new({"name" => "section_no",
             "type" =>"text_field" ,
             "display_name_all" => "Section Number"
            }),
  Field.new({"name" => "telephone_contact",
            "type" => "text_field",
            "display_name_all" => "Contact Number"
            }),
]

FormSection.create_or_update_form_section({
  :unique_id=>"basic_identity",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => basic_identity_fields,
  :perm_enabled => true,
  :is_first_tab => true,
  "name_all" => "Basic Identity",
  "description_all" => "Basic identity information about a separated or unaccompanied child."
})
