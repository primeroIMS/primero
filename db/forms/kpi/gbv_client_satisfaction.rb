gbv_client_satisfaction_fields = [
  Field.new({"name" => "client_satisfaction",
             "mobile_visible" => false,
             "type" => "tick_box",
             "display_name_en" => "Client Satisfaction",
						 "editable" => false,
						 "disabled" => true
            }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_client_satisfaction",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Client Satisfaction",
  fields: gbv_client_satisfaction_fields,
  name_en: "Client Satisfaction",
  description_en: "Client Satisfaction"
})
