#########################################
# Tracing action subform

tracing_action_subform = [
    Field.new({"name" => "date_tracing",
               "type" => "date_field",
               "display_name_all" => "Date of tracing",
              }),
    Field.new({"name" => "tracing_type",
               "type" => "select_box",
               "display_name_all" => "Type of action taken",
               "option_strings_text_all" => [
                 "Case by Case Tracing",
                 "Individual Tracing",
                 "Mass Tracing",
                 "Photo Tracing",
                 "Referral to NGO",
                 "Referral to ICRC"
               ].join("\n")
              }),
    Field.new({"name" => "address_tracing",
               "type" => "textarea",
               "display_name_all" => "Address/Village where the tracing action took place",
              }),
    Field.new({"name" => "location_tracing",
               "type" => "select_box",
               "display_name_all" => "Location of Tracing",
               "searchable_select" => true,
               "option_strings_source" => "Location"
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

tracing_actions_section = FormSection.create_or_update_form_section({
     "visible"=>false,
     "is_nested"=>true,
     :order_form_group => 130,
     :order => 20,
     :order_subform => 2,
     :unique_id=>"tracing_actions_section",
     :parent_form=>"case",
     "editable"=>true,
     :fields => tracing_action_subform,
     :initial_subforms => 1,
     "name_all" => "Nested Tracing Action",
     "description_all" => "Tracing Action Subform",
     "collapsed_fields" => ["tracing_type", "date_tracing"]
})

#########################################
# Tracing form

tracing_fields = [
  Field.new({"name" => "matched_tracing_request_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "link_to_path" => "tracing_request",
             "display_name_all" => "Matched Tracing Request ID"
           }),
  Field.new({"name" => "separation_separator",
             "type" => "separator",
             "display_name_all" => "Separation History",
            }),
  Field.new({"name" => "tracing_status",
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
             "display_name_all" => "Date of Separation",
             "matchable" => true
            }),
  Field.new({"name" => "separation_cause",
             "type" => "select_box",
             "display_name_all" => "What was the main cause of separation?",
             "option_strings_source" => "lookup SeparationCause",
             "matchable" => true
            }),
  Field.new({"name" => "separation_cause_other",
             "type" => "text_field",
             "display_name_all" => "If Other, please specify",
             "matchable" => true
            }),
  Field.new({"name" => "separation_other_applicable_causes",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If applicable, what were other causes of separation? ",
             "option_strings_text_all" =>
                        ["Conflict",
                        "Death",
                        "Family abuse/violence/exploitation",
                        "Lack of access to services/support",
                        "CAAFAG",
                        "Sickness of family member",
                        "Entrusted into the care of an individual",
                        "Arrest and detention",
                        "Abandonment",
                        "Repatriation",
                        "Population movement",
                        "Migration",
                        "Poverty",
                        "Natural disaster",
                        "Divorce/remarriage",
                        "Other (please specify)"].join("\n")
              }),
  Field.new({"name" => "separation_details",
             "type" => "textarea",
             "display_name_all" => "Circumstances of Separation (please provide details)",
             "matchable" => true
            }),
  Field.new({"name" => "separation_additional_movements",
             "type" => "textarea",
             "display_name_all" => "Describe additional movements between place of separation and current location"
            }),
  Field.new({"name" => "separation_witnessed_violence",
             "type" => "radio_button",
             "display_name_all" => "Did the child face or witness any type of violence, threat or harm during his/her journey?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "separation_witnessed_violence_comments",
             "type" => "textarea",
             "display_name_all" => "Details about what the child faced / witnessed"
            }),
  Field.new({"name" => "address_separation",
             "type" => "textarea",
             "display_name_all" => "Separation Address (Place)",
             "matchable" => true
            }),
  Field.new({"name" => "location_separation",
             "type" => "select_box",
             "display_name_all" => "Separation Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "matchable" => true
            }),
  Field.new({"name" => "additional_tracing_info",
             "type" => "textarea",
             "display_name_all" => "Additional info that could help in tracing?",
             "matchable" => true
            }),
  Field.new({"name" => "evacuation_status",
             "type" => "radio_button",
             "display_name_all" => "Has child been evacuated?",
             "option_strings_source" => "lookup lookup-yes-no"
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
  Field.new({"name" => "tracing_actions_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => tracing_actions_section.unique_id,
             "display_name_all" => "Tracing Actions"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Tracing",
  :fields => tracing_fields,
  "editable" => true,
  "name_all" => "Tracing",
  "description_all" => "Tracing",
})
