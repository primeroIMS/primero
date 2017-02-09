case_closure_fields = [
  Field.new({"name" => "created_at",
             "type" => "date_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Case Opening Date",
             "create_property" => false
            }),
  Field.new({"name" => "date_closure",
             "type" => "date_field",
             "display_name_all" => "Case Closure Date"
            }),
  Field.new({"name" => "child_status",
             "type" =>"select_box" ,
             "display_name_all" => "Case Status",
             "option_strings_source" => "lookup lookup-case-status"
            }),
  Field.new({"name" => "closure_assessment",
             "type" => "text_field",
             "display_name_all" => "Closure Assessement"
            }),
  Field.new({"name" => "closure_checklist_header_section",
             "type" => "separator",
             "display_name_all" => "Closure Checklist"
            }),
  Field.new({"name" => "closure_needs_met",
             "type" => "radio_button",
             "display_name_all" => "Survivor’s needs have been met to the extent possible or there has been no client contact for a specified period (e.g., more than 30 days)",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_needs_met_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (survivor's needs)",
            }),
  Field.new({"name" => "closure_safety_plan",
             "type" => "radio_button",
             "display_name_all" => "Survivor’s safety plan has been reviewed and is in place",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_safety_plan_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (safety plan)",
            }),
  Field.new({"name" => "closure_case_plan_complete",
             "type" => "radio_button",
             "display_name_all" => "The case plan is complete and satisfactory, and follow-up is finished",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_case_plan_complete_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (complete and satisfactory)",
            }),
  Field.new({"name" => "closure_no_further_support",
             "type" => "radio_button",
             "display_name_all" => "The survivor client and caseworker agree that no further support is needed",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_no_further_support_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (no need for further support)",
            }),
  Field.new({"name" => "closure_resume_notification",
             "type" => "radio_button",
             "display_name_all" => "Survivor has been informed that she can resume services at any time",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_resume_notification_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (resuming services)",
            }),
  Field.new({"name" => "closure_supervisor_review",
             "type" => "radio_button",
             "display_name_all" => "Case supervisor has reviewed case closure/exit plan",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "closure_supervisor_review_explain",
             "type" => "text_field",
             "display_name_all" => "Explain (case review)",
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"gbv_case_closure_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 120,
  :order => 80,
  :order_subform => 0,
  :form_group_name => "Case Closure",
  "editable" => true,
  :fields => case_closure_fields,
  "name_all" => "Case Closure",
  "description_all" => "Case Closure"
})
