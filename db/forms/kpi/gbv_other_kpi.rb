gbv_other_kpi_fields = [
  Field.new({"name" => "case_load",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Case load",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "supervisor_to_case_worker_ratio",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Supervisor to case worker ratio",
    "editable" => false,
    "disabled" => true
  }),
  Field.new({"name" => "caseworkers_active_on_gbvims_plus",
    "mobile_visible" => false,
    "type" => "tick_box",
    "display_name_en" => "Caseworkers active on GBVIMS+",
    "editable" => false,
    "disabled" => true
  }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_other_kpi",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Other",
  fields: gbv_other_kpi_fields,
  name_en: "Other",
  description_en: "Other"
})
