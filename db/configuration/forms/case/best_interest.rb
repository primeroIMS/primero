best_interest_fields = [
  Field.new({"name" => "best_interest_report_submitted",
             "type" => "select_box",
             "display_name_en" => "Was the report submitted to the body that decides the best interest of the child?",
             "option_strings_text_en" => [
               { id: 'submitted', display_text: "Submitted" },
               { id: 'pending', display_text: "Pending" },
               { id: 'no', display_text: "No" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "best_interest_date_submitted",
             "type" => "date_field",
             "display_name_en" => "Date of submission"
            }),
  Field.new({"name" => "best_interest_recommendation",
             "type" => "select_box",
             "display_name_en" => "Recommendation",
             "option_strings_text_en" => [
               { id: 'local_integration', display_text: "Local integration" },
               { id: 'maintain_change_current_arrangements', display_text: "Maintain/Change current arrangements" },
               { id: 'medical', display_text: "Medical" },
               { id: 'repatriation', display_text: "Repatriation" },
               { id: 'resettlement_to_3rd_country', display_text: "Resettlement to 3rd country" },
               { id: 'reunification', display_text: "Reunification" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "best_interest_recommendation_date",
             "type" => "date_field",
             "display_name_en" => "Date of Recommendation"
            }),
  Field.new({"name" => "best_interest_proposed_support",
             "type" => "text_field",
             "display_name_en" => "Proposed Support"
            }),
  Field.new({"name" => "best_interest_agency_responsible",
             "type" => "text_field",
             "display_name_en" => "Agency Responsible"
            }),
  Field.new({"name" => "best_interest_proposed_support_accepted",
             "type" => "radio_button",
             "display_name_en" => "Does the child accept the proposed support?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "best_interest_why_support_refused",
             "type" => "text_field",
             "display_name_en" => "If refused, why?"
            }),
  Field.new({"name" => "best_interest_date_implementation",
             "type" => "date_field",
             "display_name_en" => "Date of Implementation"
            }),
  Field.new({"name" => "best_interest_implementing_agency",
             "type" => "text_field",
             "display_name_en" => "Implementing Agency"
            })
]
FormSection.create_or_update!({
  unique_id: "best_interest",
  parent_form: "case",
  visible: true,
  order_form_group: 70,
  order: 20,
  order_subform: 0,
  form_group_id: "assessment",
  editable: true,
  fields: best_interest_fields,
  name_en: "Best Interest",
  description_en: "Best Interest"
})
