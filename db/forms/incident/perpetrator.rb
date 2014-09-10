perpetrator_subform_fields = [
  Field.new({"name" => "known_perpetrator",
             "type" => "select_box",
             "display_name_all" => "Is this a known or unknown Perpetrator?",
             "option_strings_text_all" =>
                          ["Known",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "primary_perpetrator",
             "type" => "radio_button",
             "display_name_all" => "Is this the primary perpetrator?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "former_perpetrator",
             "type" => "radio_button",
             "display_name_all" => "Past GBV by alledged perpetrator?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "perpetrator_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "perpetrator_category",
             "type" => "select_box",
             "display_name_all" => "Was the alleged perpetrator(s) a State or Non-State Actor?",
             "option_strings_text_all" =>
                          ["State Actor",
                           "Non-State Actor",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "perpetrator_sub_category",
             "type" => "select_box",
             "display_name_all" => "To which type of armed force or group did the alleged perpetrator(s) belong?",
             "option_strings_text_all" =>
                          ["National Army",
                           "Security Forces",
                           "International Forces",
                           "Police Forces",
                           "Para-Military Forces",
                           "Unknown",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "armed_force_group_name",
             "type" => "text_field",
             "display_name_all" => "Name of the armed force or group?",
            }),
  Field.new({"name" => "perpetrator_sex",
             "type" => "select_box",
             "display_name_all" => "Sex of Alleged Perpetrator(s)",
             "option_strings_text_all" =>
                          ["Female",
                           "Male",
                           "Both female and male perpetrators"].join("\n")
            }),
  Field.new({"name" => "age_group",
             "type" => "select_box",
             "display_name_all" => "Age group of alleged perpetrator",
             "option_strings_text_all" =>
                          ["0-11",
                           "12-17",
                           "18-25",
                           "26-40",
                           "41-60",
                           "61+",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "perpetrator_nationality",
             "type" => "select_box",
             "display_name_all" => "Nationality of alleged perpetrator",
             "option_strings_source" => "lookup Nationality"
            }),
  Field.new({"name" => "perpetrator_ethnicity",
             "type" => "select_box",
             "display_name_all" => "Clan or Ethnicity of alleged perpetrator",
             "option_strings_source" => "lookup Ethnicity"
            }),
  Field.new({"name" => "perpetrator_relationship",
             "type" => "select_box",
             "display_name_all" => "Alleged perpetrator relationship with survivor",
             "option_strings_text_all" =>
                          ["Intimate Partner/Former Partner",
                           "Primary Caregiver",
                           "Family other than spouse or caregiver",
                           "Supervisor/Employer",
                           "Schoolmate",
                           "Teacher/School Official",
                           "Service Provider",
                           "Cotenant/Housemate",
                           "Family Friend/Neighbor",
                           "Other refugee/IDP/Returnee",
                           "Other resident community member",
                           "Other",
                           "No relation",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "perpetrator_occupation",
             "type" => "select_box",
             "display_name_all" => "Main occupation of alleged perpetrator (if known)",
             "option_strings_text_all" =>
                          ["Other",
                           "Unemployed",
                           "Unknown"].join("\n")
            })
]

perpetrator_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 80,
  :order => 10,
  :order_subform => 1,
  :unique_id => "perpetrator_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => perpetrator_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Perpetrator Subform",
  "description_all" => "Nested Perpetrator Subform",
  "collapsed_fields" => ["perpetrator_sub_category"]
})

perpetrator_fields = [
  Field.new({"name" => "perpetrator_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => perpetrator_subform_section.unique_id,
             "display_name_all" => "Perpetrator"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "perpetrators_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 80,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Perpetrator",
  "editable" => true,
  :fields => perpetrator_fields,
  "name_all" => "Perpetrator",
  "description_all" => "Perpetrator"
})