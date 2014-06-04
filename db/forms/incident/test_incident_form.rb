test_incident_fields = [
  Field.new({"name" => "test_incident_report_submitted",
             "type" => "select_box",
             "display_name_all" => "Was the report submitted to the body that decides the best interest of the child?",
             "option_strings_text_all" => "Submitted\nPending\nNo"
            }),
  Field.new({"name" => "test_incident_date_submitted",
             "type" => "date_field",
             "display_name_all" => "Date of submission"
            }),
  Field.new({"name" => "test_incident_recommendation",
             "type" => "select_box",
             "display_name_all" => "Recommendation",
             "option_strings_text_all" =>
                                  ["Local integration",
                                   "Maintain/Change current arrangements",
                                   "Medical",
                                   "Repatriation",
                                   "Resettlement to 3rd country",
                                   "Reunification"].join("\n"),
            }),
  Field.new({"name" => "test_incident_recommendation_date",
             "type" => "date_field",
             "display_name_all" => "Date of Recommendation"
            }),
  Field.new({"name" => "test_incident_proposed_support",
             "type" => "text_field",
             "display_name_all" => "Proposed Support"
            }),
  Field.new({"name" => "test_incident_agency_responsible",
             "type" => "text_field",
             "display_name_all" => "Agency Responsible"
            }),
  Field.new({"name" => "test_incident_proposed_support_accepted",
             "type" => "select_box",
             "display_name_all" => "Does the child accept the proposed support?",
             "option_strings_text_all" => "Yes\nNo",
           }),
  Field.new({"name" => "test_incident_why_support_refused",
             "type" => "text_field",
             "display_name_all" => "If refused, why?"
            }),
  Field.new({"name" => "test_incident_date_implementation",
             "type" => "date_field",
             "display_name_all" => "Date of Implementation"
            }),
  Field.new({"name" => "test_incident_implementing_agency",
             "type" => "text_field",
             "display_name_all" => "Implementing Agency"
            }),
]

FormSection.create_or_update_form_section({
  :unique_id => "test_incident_form",
  :form_id=>"incident",
  "visible" => true,
  :order => 3,
  "editable" => true,
  :fields => test_incident_fields,
  :perm_enabled => true,
  "name_all" => "Test Incident Form",
  "description_all" => "Test Incident Form"
})