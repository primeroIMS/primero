tracing_request_subform_fields = [
  Field.new({"name" => "matched_case_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "link_to_path" => "case",
             "display_name_en" => "Matched Case ID"
           }),
  Field.new({"name" => "tracing_request_status",
             "type" =>"select_box" ,
             "display_name_en" => "Tracing status",
             "option_strings_source" => "lookup lookup-tracing-status"
            }),
  Field.new({"name" => "individual_details_section",
             "type" => "separator",
             "display_name_en" => "Individual Details"
            }),
  Field.new({"name" => "name",
             "type" => "text_field",
             "display_name_en" => "Name",
             "matchable" => true
           }),
  Field.new({"name" => "relation",
             "type" => "select_box",
             "display_name_en" => "How is the inquirer related to the child?",
             "option_strings_source" => "lookup lookup-family-relationship",
             "matchable" => true
            }),
  Field.new({"name" => "relation_child_lived_with_pre_separation",
             "type" => "radio_button",
             "display_name_en" => "Did the child live with the inquirer before separation?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "name_nickname",
             "type" => "text_field",
             "display_name_en" => "Nickname",
             "matchable" => true
           }),
  Field.new({"name" => "name_other",
             "type" => "text_field",
             "display_name_en" => "Other Name",
             "matchable" => true
           }),
  Field.new({"name" => "sex",
             "type" => "select_box",
             "display_name_en" => "Sex",
             "option_strings_source" => "lookup lookup-gender",
             "matchable" => true
            }),
  Field.new({"name" => "age",
             "type" => "numeric_field",
             "display_name_en" => "Age",
             "matchable" => true
           }),
  Field.new({"name" => "date_of_birth",
             "type" => "date_field",
             "display_name_en" => "Date of Birth",
             "date_validation" => "not_future_date",
             "matchable" => true
             }),
  Field.new({"name" => "physical_characteristics",
             "type" => "textarea",
             "display_name_en" => "Distinguishing Physical Characteristics"
            }),
  Field.new({"name" => "inquirer_special_message",
               "type" => "textarea",
               "display_name_en" => "Special Message for the person being sought"
              }),
  Field.new({"name" => "same_separation_details",
             "type" => "tick_box",
             "display_name_en" => "Same separation details as on Inquirer form?"
            }),
  Field.new({"name" => "separation_details_section",
             "type" => "separator",
             "display_name_en" => "Separation Details (if different from Inquirer form)"
            }),
  Field.new({"name" => "date_of_separation",
             "type" => "date_field",
             "display_name_en" => "Date of Separation",
             "matchable" => true
            }),
  Field.new({"name" => "separation_cause",
             "type" => "select_box",
             "display_name_en" => "What was the main cause of separation?",
             "option_strings_source" => "lookup SeparationCause",
             "matchable" => true
            }),
  Field.new({"name" => "separation_evacuation",
             "type" => "tick_box",
             "display_name_en" => "Did the separation occur in relation to evacuation?"
            }),
  Field.new({"name" => "separation_details",
             "type" => "textarea",
             "display_name_en" => "Circumstances of Separation (please provide details)"
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
  Field.new({"name" => "address_last",
             "type" => "textarea",
             "display_name_en" => "Last Address"
            }),
  Field.new({"name" => "landmark_last",
             "type" => "text_field",
             "display_name_en" => "Last Landmark"
            }),
  Field.new({"name" => "location_last",
             "type" =>"select_box" ,
             "display_name_en" => "Last Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "matchable" => true
            }),
  Field.new({"name" => "telephone_last",
             "type" => "text_field",
             "display_name_en" => "Last Telephone",
             "matchable" => true
            }),
  Field.new({"name" => "additional_tracing_info",
             "type" => "textarea",
             "display_name_en" => "Additional info that could help in tracing?"
            })
]

tracing_request_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 10,
  :order => 10,
  :order_subform => 1,
  :unique_id => "tracing_request_subform_section",
  :parent_form=>"tracing_request",
  "editable" => true,
  :fields => tracing_request_subform_fields,
  "name_en" => "Nested Tracing Request Subform",
  "description_en" => "Nested Tracing Request Subform",
  :initial_subforms => 0,
  "collapsed_field_names" => ["name"],
  :subform_header_links => ["tracing"]
})

tracing_request_tracing_request_fields = [
  Field.new({"name" => "tracing_request_subform_section",
             "type" => "subform",
             "editable" => true,
             "subform_section" => tracing_request_subform_section,
             "display_name_en" => "Tracing Request"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing_request_tracing_request",
  :parent_form=>"tracing_request",
  "visible" => true,
  :order_form_group => 30,
  :order => 30,
  :order_subform => 0,
  :form_group_id => "tracing_request",
  "editable" => true,
  "mobile_form" => true,
  :fields => tracing_request_tracing_request_fields,
  "name_en" => "Tracing Request",
  "description_en" => "Tracing Request"
})
