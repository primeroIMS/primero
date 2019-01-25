gbv_follow_up_fields = [
  Field.new({"name" => "follow_up_meetings",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Follow-up meetings",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "average_follow_up_meetings",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Average follow-up meetings",
    "editable" => false,
    "disabled" => true
  }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_follow_up",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Case Follow-up",
  fields: gbv_follow_up_fields,
  name_en: "Case Follow-up",
  description_en: "Case Follow-up"
})

