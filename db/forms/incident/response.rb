response_subform_fields = [
  Field.new({"name" => "intervention_violations",
             "type" => "select_box",
             "display_name_all" => "Violation",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "intervention_task_force_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Follow-up by CTFMR",
             "option_strings_text_all" => ["Advocacy with perpetrator armed force/armed group",
                                           "Case referral to law enforcement/judicial authorities",
                                           "Victim's referral for medical assistance",
                                           "Victim's referral for legal aid",
                                           "Victim's referral for psychosocial support",
                                           "Public statement", "None required", "Pending", "Other"].join("\n")
            }),
  Field.new({"name" => "intervention_task_force_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details"
            }),
  Field.new({"name" => "intervention_task_force_date",
             "type" => "date_field",
             "display_name_all" => "Date of CTFMR follow-up"
            }),

  Field.new({"name" => "intervention_armed_force_group",
             "type" => "text_field",
             "display_name_all" => "Body/entity/partner to which CTFMR addressed its follow-up action"
            }),
  Field.new({"name" => "intervention_action_notes",
             "type" => "text_field",
             "display_name_all" => "Please provide any further details",
             "help_text_all" => "E.g. specific entity/body/partner due to provide response/take remedial action; "\
                                "information on type of action/response required/taken/provided, if available"
            }),
  Field.new({"name" => "intervention_follow_up_type",
             "type" => "select_box",
             "display_name_all" => "Status of response/remedial action required",
             "option_strings_text_all" => ["Pending", "Taken/Provided"].join("\n")
            }),
  Field.new({"name" => "intervention_follow_up_due_date",
             "type" => "date_field",
             "display_name_all" => "If pending, please indicate due date:"
            }),
  Field.new({"name" => "intervention_follow_up_notes",
             "type" => "text_field",
             "display_name_all" => "Additional details"
            })
]

response_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :unique_id => "response_subform_section",
  :parent_form=>"incident",
  :order_form_group => 90,
  :order => 10,
  :order_subform => 1,
  :form_group_name => "Response",
  :fields => response_subform_fields,
  :initial_subforms => 1,
  "editable" => true,
  "name_all" => "Nested Response Subform",
  "description_all" => "Nested Response Subform"
})

response_fields = [
  Field.new({"name" => "response_subform_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => response_subform_section.unique_id,
             "display_name_all" => "Response"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "response",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 90,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Response",
  :fields => response_fields,
  "editable" => true,
  "name_all" => "Response",
  "description_all" => "Response"
})