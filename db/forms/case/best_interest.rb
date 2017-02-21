best_interest_fields = [
  Field.new({"name" => "best_interest_report_submitted",
             "type" => "select_box",
             "display_name_all" => "Was the report submitted to the body that decides the best interest of the child?",
             "option_strings_text_all" => "Submitted\nPending\nNo"
            }),
  Field.new({"name" => "best_interest_date_submitted",
             "type" => "date_field",
             "display_name_all" => "Date of submission"
            }),
  Field.new({"name" => "best_interest_recommendation",
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
  Field.new({"name" => "best_interest_recommendation_date",
             "type" => "date_field",
             "display_name_all" => "Date of Recommendation"
            }),
  Field.new({"name" => "best_interest_proposed_support",
             "type" => "text_field",
             "display_name_all" => "Proposed Support"
            }),
  Field.new({"name" => "best_interest_agency_responsible",
             "type" => "text_field",
             "display_name_all" => "Agency Responsible"
            }),
  Field.new({"name" => "best_interest_proposed_support_accepted",
             "type" => "radio_button",
             "display_name_all" => "Does the child accept the proposed support?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "best_interest_why_support_refused",
             "type" => "text_field",
             "display_name_all" => "If refused, why?"
            }),
  Field.new({"name" => "best_interest_date_implementation",
             "type" => "date_field",
             "display_name_all" => "Date of Implementation"
            }),
  Field.new({"name" => "best_interest_implementing_agency",
             "type" => "text_field",
             "display_name_all" => "Implementing Agency"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "best_interest",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 20,
  :order_subgroup => 0,
  :form_group_name => "Assessment",
  "editable" => true,
  :fields => best_interest_fields,
  "name_all" => "Best Interest",
  "description_all" => "Best Interest"
})