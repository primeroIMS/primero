service_consent_fields = [
	Field.new({"name" => "consent_services_header",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_all" => "Consent for Services"
            }),
	Field.new({"name" => "consent_for_services",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Did the survivor provide consent to engage in services offered by you?",
             "help_text" => ""
            })
]

FormSection.create_or_update_form_section({
  unique_id: "consent_for_services",
  parent_form: "case",
  visible: true,
  order_form_group: 45,
  order: 10,
  order_subform: 0,
  form_group_name: "Consent for Services",
  editable: true,
  fields: service_consent_fields,
  mobile_form: true,
  name_all: "Consent for Services",
  description_all: "Consent for Services",
})
