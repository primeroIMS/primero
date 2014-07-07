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
  Field.new({"name" => "record_state",
             "type" => "select_box",
             "display_name_all" => "Record state",
             "option_strings_text_all" =>
                          ["Valid record",
                           "Invalid record"].join("\n")
            }),
  Field.new({"name" => "registration_date",
             "type" => "date_field", 
             "display_name_all" => "Date of Registration or Interview"
            }),
  #TODO reconcile difference between Agency and Other Agency
  Field.new({"name" => "agency",
             "type" =>"select_box" ,
             "display_name_all" => "Agency",
             "option_strings_text_all" => 
                          ["German Technical Cooperation",
                           "GTZ",
                           "ICRC",
                           "International Rescue Committee",
                           "IRC",
                           "IRC K",
                           "IRC KV",
                           "IRC Legal",
                           "IRC NH",
                           "IRC NZ",
                           "IRC NZV",
                           "Save the Children",
                           "SCUK",
                           "SCUK-LF",
                           "SCUK-MOT",
                           "UNICEF",
                           "United Nations Childrens Fund"].join("\n")
            }),
  Field.new({"name" => "telephone_agency",
            "type" => "text_field",
            "display_name_all" => "Agency Telephone"
            }),
  Field.new({"name" => "other_agency_id",
            "type" => "text_field",
            "display_name_all" => "Other Agency ID"
            }),
  Field.new({"name" => "other_agency_name",
            "type" => "text_field",
            "display_name_all" => "Other Agency Name"
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
  Field.new({"name" => "protection_status",
             "type" => "select_box",
             "option_strings_text_all" => "Unaccompanied\nSeparated",
             "display_name_all" => "Protection Status"
            }),
  Field.new({"name" => "urgent_protection_concern",
             "type" => "radio_button",
             "display_name_all" => "Urgent Protection Concern?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "survivor_code_no",
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
  Field.new({"name" => "physical_characteristics",
             "type" => "textarea",
             "display_name_all" => "Distinguishing Physical Characteristics"
            }),
  Field.new({"name" => "displacement_status",
             "type" =>"select_box" ,
             "display_name_all" => "Current Displacement Status",
             "option_strings_text_all" => 
                          ["Resident",
                           "IDP",
                           "Refugee",
                           "Stateless Person",
                           "Returnee",
                           "Foreign National",
                           "Asylum Seeker"].join("\n")
            }),
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Protection Concerns",
             "option_strings_text_all" =>
                          ["Sexually Exploited",
                           "GBV survivor",
                           "Trafficked/smuggled",
                           "Statelessness",
                           "Arrested/Detained",
                           "Migrant",
                           "Disabled",
                           "Serious health issue",
                           "Refugee",
                           "CAAFAG",
                           "Street child",
                           "Child Mother",
                           "Physically or Mentally Abused",
                           "Living with vulnerable person",
                           "Word Forms of Child Labor",
                           "Child Headed Household",
                           "Mentally Distressed",
                           "Other"].join("\n")
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
                          ["Nationality 1",
                           "Nationality 2",
                           "Nationality 3",
                           "Nationality 4"].join("\n")
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
  #TODO location picker
  Field.new({"name" => "location_current",
             "type" =>"text_field" ,
             "display_name_all" => "Current Location"
            }),
  Field.new({"name" => "landmark_current",
             "type" => "text_field",
             "display_name_all" => "Landmark near current address"
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
  Field.new({"name" => "address_last",
             "type" => "textarea",
             "display_name_all" => "Last Address"
            }),
  Field.new({"name" => "landmark_last",
             "type" => "text_field",
             "display_name_all" => "Last Landmark"
            }),
  #TODO location picker
  Field.new({"name" => "location_last",
             "type" =>"text_field" ,
             "display_name_all" => "Last Location"
            }),
  Field.new({"name" => "telephone_last",
             "type" => "text_field",
             "display_name_all" => "Last Address Telephone"
            }),
  Field.new({"name" => "ethnicity",
             "type" =>"select_box" ,
             "display_name_all" => "Ethnicity/Clan/Tribe",
             "option_strings_text_all" => 
                          ["Baganda",
                           "Clan 1",
                           "Clan 2",
                           "Clan 3",
                           "Polo"].join("\n")
            }),
  Field.new({"name" => "sub_ethnicity_1",
             "type" =>"select_box" ,
             "display_name_all" => "Sub Ethnicity 1",
             "option_strings_text_all" => 
                          ["Baganda",
                           "Clan 1",
                           "Clan 2",
                           "Clan 3",
                           "Polo"].join("\n")
            }),
  Field.new({"name" => "sub_ethnicity_2",
             "type" =>"select_box" ,
             "display_name_all" => "Sub Ethnicity 2",
             "option_strings_text_all" => 
                          ["Baganda",
                           "Clan 1",
                           "Clan 2",
                           "Clan 3",
                           "Polo"].join("\n")
            }),
   #TODO configurable by admin
   Field.new({"name" => "language",
             "type" =>"check_boxes" ,
             "display_name_all" => "Language",
             "option_strings_text_all" => 
                          ["English",
                           "French",
                           "Swahili"].join("\n")
            }),
  Field.new({"name" => "religion",
             "type" =>"check_boxes" ,
             "display_name_all" => "Religion",
             "option_strings_text_all" => 
                          ["Christianity",
                           "Islam"].join("\n")
            }),
  Field.new({"name" => "arrival_date",
             "type" => "date_field", 
             "display_name_all" => "Arrival Date"
            }),
  Field.new({"name" => "interviewer_name",
             "type" => "text_field",
             "display_name_all" => "Interviewer Name"
            }),
  Field.new({"name" => "interviewer_postion",
             "type" => "text_field",
             "display_name_all" => "Interviewer Position"
            }),
  Field.new({"name" => "interviewer_agency",
             "type" =>"select_box" ,
             "display_name_all" => "Interviewer Agency",
             "option_strings_text_all" => 
                          ["Agency 1",
                           "Agency 2",
                           "Agency 3",
                           "Agency 4"].join("\n")
            }),
  Field.new({"name" => "address_interview",
             "type" => "textarea",
             "display_name_all" => "Interview Address"
            }),
  #TODO location picker
  Field.new({"name" => "location_interview",
             "type" =>"text_field" ,
             "display_name_all" => "Interview Location"
            }),
  Field.new({"name" => "landmark_interview",
             "type" => "text_field",
             "display_name_all" => "Interview Landmark"
            }),  
  Field.new({"name" => "source_interview",
             "type" =>"select_box" ,
             "display_name_all" => "Information Obtained From",
             "option_strings_text_all" => 
                          ["Child",
                           "Caregiver",
                           "GBV Survivor",
                           "Other, please specify"].join("\n")
            }),
  Field.new({"name" => "source_interview_other",
             "type" =>"text_field" ,
             "display_name_all" => "If information obtained from Other, please specify."
            }),
  Field.new({"name" => "other_org_interview_status",
             "type" => "radio_button",
             "display_name_all" => "Has the child been interviewed by another organization?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "other_org_reference_no",
             "type" =>"text_field" ,
             "display_name_all" => "Reference No. given to child by other organization"
            }),
  #TODO spreadsheet says this comes from valid users
  Field.new({"name" => "database_operator",
             "type" =>"select_box" ,
             "display_name_all" => "Database Operator",
             "option_strings_text_all" => 
                          ["Operator 1",
                           "Operator 2",
                           "Operator 3",
                           "Operator 4"].join("\n")
            }),  
        
  Field.new({"name" => "social_worker",
             "type" =>"select_box" ,
             "display_name_all" => "Social Worker",
             "option_strings_text_all" => 
                          ["Social Worker 1",
                           "Social Worker 2",
                           "Social Worker 3",
                           "Social Worker 4"].join("\n")
            }),   
  Field.new({"name" => "address_registration",
             "type" => "textarea",
             "display_name_all" => "Registration Address"
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
  Field.new({"name" => "address_permanent",
             "type" => "textarea",
             "display_name_all" => "Permanent Address"
            }),
  #TODO location picker
  Field.new({"name" => "location_permanent",
             "type" =>"text_field" ,
             "display_name_all" => "Permanent Location"
            }),
  Field.new({"name" => "section_no",
             "type" =>"text_field" ,
             "display_name_all" => "Section Number"
            }),
  Field.new({"name" => "telephone_contact",
            "type" => "text_field",
            "display_name_all" => "Contact Number"
            }),
  Field.new({"name" => "un_no",
            "type" => "text_field",
            "display_name_all" => "UN Number"
            }),
  Field.new({"name" => "child_status",
             "type" =>"select_box" ,
             "display_name_all" => "Status",
             "option_strings_text_all" => 
                          ["IDP",
                           "Refugee",
                           "Community",
                           "Institution",
                           "Other",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "unaccompanied_separated_status",
             "type" =>"check_boxes" ,
             "display_name_all" => "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?",
             "option_strings_text_all" => 
                          ["No",
                           "Unaccompanied Minor",
                           "Separated Child",
                           "Other Vulnerable Child"].join("\n")
            }),
  Field.new({"name" => "name_given_post_separation",
             "type" => "radio_button",
             "display_name_all" => "Name(s) given to child after separation?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "survivor_lives_alone",
             "type" => "radio_button",
             "display_name_all" => "If the survivor is a child, does he/she live alone?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "survivor_caretaker",
             "type" =>"select_box" ,
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
  Field.new({"name" => "caretaker_maritial_status",
             "type" =>"select_box" ,
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
  :unique_id=>"basic_identity",
  :parent_form=>"case",
  "visible" => true,
  :order => 1,
  "editable" => true,
  :fields => basic_identity_fields,
  :perm_enabled => true,
  "name_all" => "Basic Identity",
  "description_all" => "Basic identity information about a separated or unaccompanied child."
})
