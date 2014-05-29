tracing_sub_form = [
    Field.new({"name" => "date_tracing",
               "type" => "date_field",
               "display_name_all" => "Date of tracing",
              }),
    Field.new({"name" => "tracing_type",
               "type" => "text_field",
               "display_name_all" => "Type of action taken",
              }),
    Field.new({"name" => "address_tracing",
               "type" => "text_field",
               "display_name_all" => "Address/Village where the tracing action took place",
              }),
    Field.new({"name" => "location_tracing",
               "type" => "text_field",
               "display_name_all" => "Place of tracing",
              }),
    Field.new({"name" => "tracing_action_description",
               "type" => "text_field",
               "display_name_all" => "Action taken and remarks",
              }),
    Field.new({"name" => "tracing_outcome",
               "type" => "select_box",
               "display_name_all" => "Outcome of tracing action",
               "option_strings_text_all" => "Pending\nSuccessful\nUnsuccessful\nYes",
              })
]

nested_form_section = FormSection.create!(
    {"visible"=>false,
     "is_nested"=>true,
     :order=> 1, :unique_id=>"nested_form_section", "editable"=>true,
     :fields => tracing_sub_form, :perm_enabled => true,
     "name_all" => "Nested Fields",
     "description_all" => "Some test nested fields testing."
    }
)

tracing_sub_form_2 = [
    Field.new({"name" => "date_tracing2",
               "type" => "date_field",
               "display_name_all" => "Date of tracing 2",
              }),
    Field.new({"name" => "tracing_type2",
               "type" => "text_field",
               "display_name_all" => "Type of action taken 2",
              }),
    Field.new({"name" => "address_tracing2",
               "type" => "text_field",
               "display_name_all" => "Address/Village where the tracing action took place 2",
              }),
    Field.new({"name" => "location_tracing2",
               "type" => "text_field",
               "display_name_all" => "Place of tracing 2",
              }),
    Field.new({"name" => "tracing_action_description2",
               "type" => "text_field",
               "display_name_all" => "Action taken and remarks 2",
              }),
    Field.new({"name" => "tracing_outcome2",
               "type" => "select_box",
               "display_name_all" => "Outcome of tracing action 2",
               "option_strings_text_all" => "Pending\nSuccessful\nUnsuccessful\nYes",
              })
]

nested_form_section_2 = FormSection.create!(
    {"visible"=>false,
     "is_nested"=>true,
     :order=> 1, :unique_id=>"nested_form_section_2", "editable"=>true,
     :fields => tracing_sub_form_2, :perm_enabled => true,
     "name_all" => "Nested Fields 2",
     "description_all" => "Some test nested fields testing."
    }
)

tracing_fields = [
  Field.new({"name" => "ftr_status",
             "type" => "select_box",
             "display_name_all" => "Tracing Status",
             "option_strings_text_all" =>
                          ["Open",
                           "Tracing in Progress",
                           "Verified",
                           "Reunified",
                           "Closed"].join("\n")
            }),
  Field.new({"name" => "date_of_separation",
             "type" => "date_field",
             "display_name_all" => "Date of Separation"
            }),
  Field.new({"name" => "separation_cause",
             "type" => "select_box",
             "display_name_all" => "What was the main cause of separation?",
             "option_strings_text_all" =>
                        ["Conflict",
                        "Death",
                        "Family abuse/violence/exploitation",
                        "Lack of access to services/support",
                        "CAAFAG",
                        "Other (please specify)",
                        "Sickness of family member",
                        "Entrusted into the care of an individual",
                        "Arrest and detention",
                        "Abandonment",
                        "Repatriation",
                        "Population movement",
                        "Migration",
                        "Divorce/remarriage",
                        "Other (please specify)"].join("\n")
              }),
  Field.new({"name" => "separation_details",
             "type" => "textarea",
             "display_name_all" => "Circumstances of Separation (please provide details)"
            }),
  Field.new({"name" => "separation_additional_movements",
             "type" => "textarea",
             "display_name_all" => "Describe additional movements between place of separation and current location"
            }),
  Field.new({"name" => "separation_witnessed_violence",
             "type" => "select_box",
             "display_name_all" => "Did the child face or witness any type of violence, threat or harm during his/her journey?",
             "option_strings_text_all" => "Yes\nNo",
           }),
  Field.new({"name" => "separation_place",
             "type" => "text_field",
             "display_name_all" => "Separation Address (Place)"
            }),
  #TODO refactoring? Spreadsheet datatype is "Location" but text_field for now.
  Field.new({"name" => "separation_location",
             "type" => "text_field",
             "display_name_all" => "Separation Location"
            }),
  Field.new({"name" => "additional_tracing_info",
             "type" => "textarea",
             "display_name_all" => "Additional info that could help in tracing?"
            }),
  Field.new({"name" => "evacuation_status",
             "type" => "select_box",
             "display_name_all" => "Has child been evacuated?",
             "option_strings_text_all" => "Yes\nNo",
            }),
  Field.new({"name" => "evacuation_agent",
             "type" => "text_field",
             "display_name_all" => "If yes, through which organization?",
            }),
  Field.new({"name" => "evacuation_from",
             "type" => "text_field",
             "display_name_all" => "Evacuated From",
            }),
  Field.new({"name" => "evacuation_date",
             "type" => "date_field",
             "display_name_all" => "Evacuation Date",
            }),
  Field.new({"name" => "evacuation_to",
             "type" => "text_field",
             "display_name_all" => "Evacuated To",
            }),
  Field.new({"name" => "care_arrangements_arrival_date",
             "type" => "date_field",
             "display_name_all" => "Arrival Date",
            }),
  Field.new({"name" => "nested_form_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => nested_form_section.id,
             "display_name_all" => "Top 2 Subform"
            }),
  Field.new({"name" => "nested_form_section_2",
             "type" => "subform", "editable" => true,
             "subform_section_id" => nested_form_section_2.id,
             "display_name_all" => "Top 2 Subform 2"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing",
  "visible" => true,
  :order => 11,
  :fields => tracing_fields,
  :perm_visible => true,
  "editable" => true,
  "name_all" => "Tracing",
  "description_all" => "Tracing",
})
