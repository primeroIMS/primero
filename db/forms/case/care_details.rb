care_details_fields = [
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
  :unique_id=>"care_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 50,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => care_details_fields,
  :perm_enabled => true,
  "name_all" => "Care Details",
  "description_all" => "Care Details"
})
