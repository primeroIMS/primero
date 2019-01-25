gbv_case_action_planning_fields = [
  Field.new({"name" => "needed_safety_plan",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Needed safety plans, completed",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "completed_case_action_plan",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Completed Case Action Plan",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "approved_case_action_plan",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Completed Case Action Plan, supervisor approved",
    "editable" => false,
    "disabled" => true
  }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_case_action_planning",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Case Action Planning",
  fields: gbv_case_action_planning_fields,
  name_en: "Case Action Planning",
  description_en: "Case Action Planning"
})
