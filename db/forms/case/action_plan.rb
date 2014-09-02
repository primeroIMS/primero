action_plan_subform_fields = [
  Field.new({"name" => "action_plan_other",
             "type" => "text_field",
             "display_name_all" => "Service"
            }),
  Field.new({"name" => "action_plan_other_description",
             "type" => "textarea",
             "display_name_all" => "Describe the Action Plan for this Service"
            })
]

action_plan_subform_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 10,
    :order => 10,
    :order_subform => 1,
    :unique_id=>"action_plan_subform_section",
    :parent_form=>"case",
    "editable"=>true,
    :fields => action_plan_subform_fields,
    "name_all" => "Nested Action Plan",
    "description_all" => "Action Plan Subform"
})

action_plan_fields = [
  Field.new({"name" => "action_plan_safety",
             "type" => "select_box",
             "display_name_all" => "Describe the safety action plan",
             "option_strings_text_all" => 
                          ["Safe at Home",
                           "Safe House",
                           "Family/Friend Home",
                           "Community Mechanism"].join("\n")
            }),
  Field.new({"name" => "action_plan_safety_text",
             "type" => "textarea",
             "display_name_all" => "Explain"
            }),
  Field.new({"name" => "action_plan_health",
             "type" => "textarea",
             "display_name_all" => "Describe the health action plan."
            }),
  Field.new({"name" => "action_plan_legal_action",
             "type" => "textarea",
             "display_name_all" => "Describe the legal action plan."
            }),
  Field.new({"name" => "action_plan_psychosocial",
             "type" => "textarea",
             "display_name_all" => "Describe the psychosocial action plan."
            }),
  Field.new({"name" => "action_plan_subform_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => action_plan_subform_section.unique_id,
             "display_name_all" => "Describe the Action Plan for Other Services"
            })
]


FormSection.create_or_update_form_section({
  :unique_id=>"action_plan_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 75,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Action Plan",
  "editable" => true,
  :fields => action_plan_fields,
  "name_all" => "Action Plan",
  "description_all" => "Action Plan"
})