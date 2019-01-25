gbv_case_closure_fields = [
  Field.new({"name" => "elapsed_time_from_opening_to_closure",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Time elapsed from case opening to closure",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "elapsed_time_from_opening_to_closure_hight_risk",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Time elapsed from case opening to closure for high-risk cases",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "case_closure_rate",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Case closure rate",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "reason_for_case_closure",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Reason for case closure",
    "editable" => false,
    "disabled" => true
  }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_case_closure",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Case Closure",
  fields: gbv_case_closure_fields,
  name_en: "Case Closure",
  description_en: "Case Closure"
})
