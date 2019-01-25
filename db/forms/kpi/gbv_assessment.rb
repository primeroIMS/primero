gbv_assessment_fields = [
  Field.new({"name" => "completed_asssessment",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Completed assessment",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "approved_assessment",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Completed assessment, supervisor approved",
    "editable" => false,
    "disabled" => true
  }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_assessment",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Assessment",
  fields: gbv_assessment_fields,
  name_en: "Assessment",
  description_en: "Assessment"
})
