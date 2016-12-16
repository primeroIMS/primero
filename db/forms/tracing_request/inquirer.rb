tracing_request_inquirer_fields = [
  Field.new({"name" => "tracing_request_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Long ID",
             "create_property" => false
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Inquirer ID",
             "create_property" => false
            }),
  Field.new({"name" => "inquiry_date",
             "type" => "date_field",
             "display_name_all" => "Date of Inquiry"
            }),
  Field.new({"name" => "inquiry_status",
             "type" =>"select_box" ,
             "display_name_all" => "Inquiry Status",
             "option_strings_text_all" => "Open\nClosed"
            }),
  Field.new({"name" => "inquirer_details_section",
             "type" => "separator",
             "display_name_all" => "Inquirer Details"
            }),
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_all" => "Name of inquirer"
           }),
  Field.new({"name" => "relation",
             "type" => "select_box",
             "display_name_all" => "How are they related to the child?",
             "option_strings_text_all" =>
                                    ["Mother",
                                     "Father",
                                     "Aunt",
                                     "Uncle",
                                     "Grandmother",
                                     "Grandfather",
                                     "Brother",
                                     "Sister",
                                     "Husband",
                                     "Wife",
                                     "Partner",
                                     "Other Family",
                                     "Other Nonfamily"].join("\n")
            }),
  Field.new({"name" => "relation_nickname",
             "type" => "text_field",
             "display_name_all" => "Nickname of inquirer"
           }),
  Field.new({"name" => "relation_age",
             "type" => "numeric_field",
             "display_name_all" => "Age",
             "numeric_validation" => "not_negative_number"
           }),
  Field.new({"name" => "relation_date_of_birth",
             "type" => "date_field",
             "display_name_all" => "Date of Birth",
             "date_validation" => "not_future_date"
             }),
  Field.new({"name" => "relation_language",
             "type" => "select_box",
             "display_name_all" => "Language",
             "multi_select" => true,
             "option_strings_source" => "lookup Language"
           }),
  Field.new({"name" => "relation_religion",
             "type" => "select_box",
             "display_name_all" => "Religion",
             "multi_select" => true,
             "option_strings_source" => "lookup Religion"
             }),
  Field.new({"name" => "relation_ethnicity",
             "type" => "select_box",
             "display_name_all" => "Ethnicity",
             "option_strings_source" => "lookup Ethnicity"
             }),
  Field.new({"name" => "relation_sub_ethnicity1",
             "type" => "select_box",
             "display_name_all" => "Sub Ethnicity 1",
             "option_strings_source" => "lookup Ethnicity"
             }),
  Field.new({"name" => "relation_sub_ethnicity2",
             "type" => "select_box",
             "display_name_all" => "Sub Ethnicity 2",
             "option_strings_source" => "lookup Ethnicity"
           }),
  Field.new({"name" => "relation_nationality",
             "type" => "select_box",
             "display_name_all" => "Nationality",
             "multi_select" => true,
             "option_strings_source" => "lookup Nationality"
           }),
  Field.new({"name" => "relation_comments",
             "type" => "textarea",
             "display_name_all" => "Additional details / comments"
            }),
  Field.new({"name" => "contact_information_section",
             "type" => "separator",
             "display_name_all" => "Contact Information"
            }),
  Field.new({"name" => "relation_address_current",
             "type" => "textarea",
             "display_name_all" => "Current Address"
           }),
  Field.new({"name" => "relation_location_current",
             "type" => "select_box",
             "display_name_all" => "Current Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
             }),
  Field.new({"name" => "relation_address_is_permanent",
             "type" => "tick_box",
             "display_name_all" => "Is this a permanent location?"
            }),
  Field.new({"name" => "relation_telephone",
             "type" => "text_field",
             "display_name_all" => "Telephone"
            }),
  Field.new({"name" => "separation_history_section",
             "type" => "separator",
             "display_name_all" => "Separation History"
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
  Field.new({"name" => "separation_cause_other",
             "type" => "textarea",
             "display_name_all" => "If Other, please specify"
            }),
  Field.new({"name" => "separation_evacuation",
             "type" => "tick_box",
             "display_name_all" => "Did the separation occur in relation to evacuation?"
            }),
  Field.new({"name" => "separation_details",
             "type" => "textarea",
             "display_name_all" => "Circumstances of Separation (please provide details)"
            }),
  Field.new({"name" => "address_separation",
             "type" => "textarea",
             "display_name_all" => "Separation Address (Place)"
            }),
  Field.new({"name" => "location_separation",
             "type" => "select_box",
             "display_name_all" => "Separation Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "address_last",
             "type" => "textarea",
             "display_name_all" => "Last Address"
            }),
  Field.new({"name" => "landmark_last",
             "type" => "text_field",
             "display_name_all" => "Last Landmark"
            }),
  Field.new({"name" => "location_last",
             "type" =>"select_box" ,
             "display_name_all" => "Last Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "telephone_last",
             "type" => "text_field",
             "display_name_all" => "Last Telephone"
            }),
  Field.new({"name" => "additional_tracing_info",
             "type" => "textarea",
             "display_name_all" => "Additional info that could help in tracing?"
            }),
  Field.new({"name" => "disclosure_other_orgs",
           "type" => "tick_box",
           "tick_box_label_all" => "Yes",
           "editable" => false,
           "disabled" => true,
           "display_name_all" => "Does the inquirer agree to share collected information with other organizations?"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing_request_inquirer",
  :parent_form=>"tracing_request",
  "visible" => true,
  :order_form_group => 20,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Inquirer",
  "editable" => true,
  :fields => tracing_request_inquirer_fields,
  "name_all" => "Inquirer",
  "description_all" => "Inquirer",
  :is_first_tab => true
})
