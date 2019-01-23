gbv_case_action_planning_fields = [
  Field.new({"name" => "services_provided",
             "mobile_visible" => false,
             "type" => "tick_box",
             "display_name_en" => "Services provided",
						 "editable" => false,
						 "disabled" => true
            }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_implement_case_action_planning",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Implement the Case Action Plan",
  fields: gbv_case_action_planning_fields,
  name_en: "Implement the Case Action Plan",
  description_en: "Implement the Case Action Plan"
})
