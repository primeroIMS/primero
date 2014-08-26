intervention_fields = [
  Field.new({"name" => "intervention_family_action",
             "type" => "text_field",
             "display_name_all" => "Action Taken by Survivors/Families"
            }),
  Field.new({"name" => "intervention_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "intervention_task_force_date",
             "type" => "date_field",
             "display_name_all" => "Action Date"
            }),
  Field.new({"name" => "intervention_task_force_type",
             "type" => "select_box",
             "display_name_all" => "Type of Action",
             "option_strings_text_all" =>
                          ["Medical Intervention",
                           "Report to Police",
                           "Report to Government Authorities",
                           "Intervention with Armed Group",
                           "No Action Taken",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "intervention_armed_force_group",
             "type" => "select_box",
             "display_name_all" => "Body to which MRM Taskforce directed action",
             "option_strings_text_all" =>
                          ["Option1",
                           "Option2",
                           "Option3"].join("\n")
            }),
  Field.new({"name" => "intervention_action_notes",
             "type" => "text_field",
             "display_name_all" => "Taskforce notes"
            }),
  Field.new({"name" => "intervention_follow_up_type",
             "type" => "select_box",
             "display_name_all" => "Follow Up Action - Type",
             "option_strings_text_all" =>
                          ["Armed Intervention",
                           "Negotiation",
                           "Legal Action",
                           "Other",
                           "None",
                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "intervention_follow_up_due_date",
             "type" => "date_field",
             "display_name_all" => "Due Date"
            }),
  Field.new({"name" => "intervention_follow_up_notes",
             "type" => "text_field",
             "display_name_all" => "Intervention follow up notes"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "intervention_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 90,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Intervention",
  :fields => intervention_fields,
  :perm_visible => true,
  "editable" => true,
  "name_all" => "Intervention",
  "description_all" => "Intervention"
})