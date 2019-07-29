tracing_request_inquirer_fields = [
  Field.new({"name" => "tracing_request_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_en" => "Long ID",
             "create_property" => false
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_en" => "Inquirer ID",
             "create_property" => false
            }),
  Field.new({"name" => "inquiry_date",
             "type" => "date_field",
             "selected_value" => "today",
             "show_on_minify_form" => true,
             "display_name_en" => "Date of Inquiry"
            }),
  Field.new({"name" => "inquiry_status",
             "type" =>"select_box" ,
             "selected_value" => Record::STATUS_OPEN,
             "display_name_en" => "Inquiry Status",
             "show_on_minify_form" => true,
             "option_strings_source" => "lookup lookup-inquiry-status"
            }),
  Field.new({"name" => "inquirer_details_section",
             "type" => "separator",
             "display_name_en" => "Inquirer Details"
            }),
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_en" => "Name of inquirer",
             "show_on_minify_form" => true,
             "matchable" => true
           }),
  Field.new({"name" => "relation_nickname",
             "type" => "text_field",
             "display_name_en" => "Nickname of inquirer",
             "matchable" => true
           }),
  Field.new({"name" => "relation_age",
             "type" => "numeric_field",
             "display_name_en" => "Age",
             "show_on_minify_form" => true
           }),
  Field.new({"name" => "relation_date_of_birth",
             "type" => "date_field",
             "display_name_en" => "Date of Birth",
             "date_validation" => "not_future_date",
             "show_on_minify_form" => true
             }),
  Field.new({"name" => "relation_language",
             "type" => "select_box",
             "display_name_en" => "Language",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-language",
             "matchable" => true
           }),
  Field.new({"name" => "relation_religion",
             "type" => "select_box",
             "display_name_en" => "Religion",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-religion",
             "matchable" => true
             }),
  Field.new({"name" => "relation_ethnicity",
             "type" => "select_box",
             "display_name_en" => "Ethnicity",
             "option_strings_source" => "lookup lookup-ethnicity",
             "matchable" => true
             }),
  Field.new({"name" => "relation_sub_ethnicity1",
             "type" => "select_box",
             "display_name_en" => "Sub Ethnicity 1",
             "option_strings_source" => "lookup lookup-ethnicity"
             }),
  Field.new({"name" => "relation_sub_ethnicity2",
             "type" => "select_box",
             "display_name_en" => "Sub Ethnicity 2",
             "option_strings_source" => "lookup lookup-ethnicity"
           }),
  Field.new({"name" => "relation_nationality",
             "type" => "select_box",
             "display_name_en" => "Nationality",
             "multi_select" => true,
             "show_on_minify_form" => true,
             "option_strings_source" => "lookup lookup-nationality",
             "matchable" => true
           }),
  Field.new({"name" => "relation_comments",
             "type" => "textarea",
             "display_name_en" => "Additional details / comments"
            }),
  Field.new({"name" => "contact_information_section",
             "type" => "separator",
             "display_name_en" => "Contact Information"
            }),
  Field.new({"name" => "relation_address_current",
             "type" => "textarea",
             "display_name_en" => "Current Address",
             "show_on_minify_form" => true,
             "matchable" => true
           }),
  Field.new({"name" => "relation_location_current",
             "type" => "select_box",
             "display_name_en" => "Current Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "matchable" => true
             }),
  Field.new({"name" => "relation_address_is_permanent",
             "type" => "tick_box",
             "show_on_minify_form" => true,
             "display_name_en" => "Is this a permanent location?"
            }),
  Field.new({"name" => "relation_telephone",
             "type" => "text_field",
             "display_name_en" => "Telephone",
             "matchable" => true
            }),
  Field.new({"name" => "separation_history_section",
             "type" => "separator",
             "display_name_en" => "Separation History"
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
             "type" => "textarea",
             "display_name_en" => "If Other, please specify",
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
            }),
  Field.new({"name" => "disclosure_other_orgs",
           "type" => "tick_box",
           "tick_box_label_en" => "Yes",
           "editable" => false,
           "disabled" => true,
           "display_name_en" => "Does the inquirer agree to share collected information with other organizations?"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing_request_inquirer",
  :parent_form=>"tracing_request",
  "visible" => true,
  :order_form_group => 20,
  :order => 20,
  "mobile_form" => true,
  :order_subform => 0,
  :form_group_name => "Inquirer",
  "editable" => true,
  :fields => tracing_request_inquirer_fields,
  "name_en" => "Inquirer",
  "description_en" => "Inquirer",
  :is_first_tab => true
})
