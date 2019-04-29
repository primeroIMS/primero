#########################################
# Tracing action subform

tracing_action_subform = [
    Field.new({"name" => "date_tracing",
               "type" => "date_field",
               "display_name_en" => "Date of tracing",
              }),
    Field.new({"name" => "tracing_type",
               "type" => "select_box",
               "display_name_en" => "Type of action taken",
               "option_strings_text_en" => [
                 { id: 'case_by_case_tracing', display_text: "Case by Case Tracing" },
                 { id: 'individual_tracing', display_text: "Individual Tracing" },
                 { id: 'mass_tracing', display_text: "Mass Tracing" },
                 { id: 'photo_tracing', display_text: "Photo Tracing" },
                 { id: 'referral_to_ngo', display_text: "Referral to NGO" },
                 { id: 'referral_to_icrc', display_text: "Referral to ICRC" }
               ].map(&:with_indifferent_access)
              }),
    Field.new({"name" => "address_tracing",
               "type" => "textarea",
               "display_name_en" => "Address/Village where the tracing action took place",
              }),
    Field.new({"name" => "location_tracing",
               "type" => "select_box",
               "display_name_en" => "Location of Tracing",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "tracing_action_description",
               "type" => "text_field",
               "display_name_en" => "Action taken and remarks",
              }),
    Field.new({"name" => "tracing_outcome",
               "type" => "select_box",
               "display_name_en" => "Outcome of tracing action",
               "option_strings_text_en" => [
                 { id: 'pending', display_text: "Pending" },
                 { id: 'successful', display_text: "Successful" },
                 { id: 'unsuccessful', display_text: "Unsuccessful" },
                 { id: 'yes', display_text: "Yes" }
               ].map(&:with_indifferent_access)
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
     :initial_subforms => 0,
     "name_en" => "Nested Tracing Action",
     "description_en" => "Tracing Action Subform",
     "collapsed_field_names" => ["tracing_type", "date_tracing"]
})

#########################################
# Tracing form

tracing_fields = [
  Field.new({"name" => "matched_tracing_request_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "link_to_path" => "tracing_request",
             "display_name_en" => "Matched Tracing Request ID"
           }),
  Field.new({"name" => "separation_separator",
             "type" => "separator",
             "display_name_en" => "Separation History",
            }),
  Field.new({"name" => "tracing_status",
             "type" => "select_box",
             "display_name_en" => "Tracing Status",
             "option_strings_source" => "lookup lookup-tracing-status",
            }),
  Field.new({"name" => "date_of_separation",
             "type" => "date_field",
             "display_name_en" => "Date of Separation",
             "matchable" => true
            }),
  Field.new({"name" => "separation_cause",
             "type" => "select_box",
             "display_name_en" => "What was the main cause of separation?",
             "option_strings_source" => "lookup lookup-separation-cause",
             "matchable" => true
            }),
  Field.new({"name" => "separation_cause_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify",
             "matchable" => true
            }),
  Field.new({"name" => "separation_other_applicable_causes",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "If applicable, what were other causes of separation? ",
             "option_strings_source" => "lookup lookup-separation-cause"
              }),
  Field.new({"name" => "separation_details",
             "type" => "textarea",
             "display_name_en" => "Circumstances of Separation (please provide details)"
            }),
  Field.new({"name" => "separation_additional_movements",
             "type" => "textarea",
             "display_name_en" => "Describe additional movements between place of separation and current location"
            }),
  Field.new({"name" => "separation_witnessed_violence",
             "type" => "radio_button",
             "display_name_en" => "Did the child face or witness any type of violence, threat or harm during his/her journey?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "separation_witnessed_violence_comments",
             "type" => "textarea",
             "display_name_en" => "Details about what the child faced / witnessed"
            }),
  Field.new({"name" => "address_separation",
             "type" => "textarea",
             "display_name_en" => "Separation Address (Place)"
            }),
  Field.new({"name" => "location_separation",
             "type" => "select_box",
             "display_name_en" => "Separation Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "matchable" => true
            }),
  Field.new({"name" => "additional_tracing_info",
             "type" => "textarea",
             "display_name_en" => "Additional info that could help in tracing?"
            }),
  Field.new({"name" => "evacuation_status",
             "type" => "radio_button",
             "display_name_en" => "Has child been evacuated?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "evacuation_agent",
             "type" => "text_field",
             "display_name_en" => "If yes, through which organization?",
            }),
  Field.new({"name" => "evacuation_from",
             "type" => "text_field",
             "display_name_en" => "Evacuated From",
            }),
  Field.new({"name" => "evacuation_date",
             "type" => "date_field",
             "display_name_en" => "Evacuation Date",
            }),
  Field.new({"name" => "evacuation_to",
             "type" => "text_field",
             "display_name_en" => "Evacuated To",
            }),
  Field.new({"name" => "care_arrangements_arrival_date",
             "type" => "date_field",
             "display_name_en" => "Arrival Date",
            }),
  Field.new({"name" => "tracing_actions_section",
             "type" => "subform", "editable" => true,
             "subform_section" => tracing_actions_section,
             "display_name_en" => "Tracing Actions"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 20,
  :order_subform => 0,
  :form_group_id => "tracing",
  :fields => tracing_fields,
  "editable" => true,
  "name_en" => "Tracing",
  "description_en" => "Tracing",
})
