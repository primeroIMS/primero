services_subform = [
  Field.new({
    "name" => "service_response_type",
    "type" => "select_box",
    "display_name_en" => "Type of Response",
    "option_strings_source" => "lookup lookup-service-response-type"
  }),
  Field.new({
    "name" => "service_type",
    "type" => "select_box",
    "display_name_en" => "Type of Service",
    "option_strings_source" => "lookup lookup-service-type"
  }),
  Field.new({
      "name" => "service_response_day_time",
      "type" => "date_field",
      "selected_value" => "now",
      "display_name_en" => "Created on",
      "date_include_time" => true
  }),
  Field.new({
      "name" => "service_response_timeframe",
      "type" => "select_box",
      "display_name_en" => "Implementation Timeframe",
      "option_strings_text_en" => [
          { id: '1_hour', display_text: "One hour" },
          { id: '3_hours', display_text: "Three hours" },
          { id: '1_day', display_text: "One day" },
          { id: '3_days', display_text: "Three days" }
      ].map(&:with_indifferent_access),
      "help_text_en" => "Enter the Implementation Timeframe for the service; the timeframe is used in the dashboard to indicate if services are overdue.",
  }),
  Field.new({
    "name" => "service_referral",
    "type" => "select_box",
    "display_name_en" => "Did you refer the client for this service?",
    "option_strings_source" => "lookup lookup-service-referred"
  }),
  Field.new({
    "name" => "service_appointment_date",
    "type" => "date_field",
    "display_name_en" => "Appointment Date"
  }),
  Field.new({
    "name" => "service_appointment_time",
    "type" => "text_field",
    "display_name_en" => "Appointment Time"
  }),
  Field.new({
    "name" => "service_implementing_agency",
    "type" => "select_box",
    "display_name_en" => "Implementing Agency",
    "option_strings_source" => "Agency",
    "mobile_visible" => false,
    "editable" => false
  }),
  Field.new({
    "name" => "service_provider",
    "type" => "text_field",
    "display_name_en" => "Service Provider"
  }),
  Field.new({
    "name" => "service_implementing_agency_individual",
    "type" => "select_box",
    "display_name_en" => "Service provider name",
    "option_strings_source" => "User",
    "mobile_visible" => false,
    "editable" => false
  }),
  Field.new({"name" => "service_status_referred",
    "type" => "tick_box",
    "tick_box_label_en" => "Yes",
    "display_name_en" => "Referred?",
    "disabled" => true,
  }),
  Field.new({
    "name" => "service_location",
    "type" => "text_field",
    "display_name_en" => "Service Location"
  }),
  Field.new({
    "name" => "service_referral_notes",
    "type" => "textarea",
    "display_name_en" => "Notes"
  }),
  Field.new({
    "name" => "service_implemented",
    "type" => "select_box",
    "display_name_en" => "Service implemented",
    "option_strings_source" => "lookup lookup-service-implemented",
    "selected_value" => "not_implemented",
    "disabled" => true
  }),
  Field.new({
    "name" => "service_implemented_day_time",
    "type" => "date_field",
    "display_name_en" => "Service Implemented On",
    "date_include_time" => true
  })
]

services_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 110,
  :order => 30,
  :order_subform => 1,
  :unique_id=>"services_section",
  :parent_form=>"case",
  "editable"=>true,
  :fields => services_subform,
  :initial_subforms => 1,
  :subform_prevent_item_removal => true,
  "name_en" => "Nested Services",
  "description_en" => "Services Subform",
  "collapsed_fields" => ["service_type", "service_appointment_date"]
})

services_fields = [
  Field.new({
    "name" => "services_section",
    "type" => "subform",
    "editable" => true,
    "subform_section_id" => services_section.unique_id,
    "display_name_en" => "Services",
    "subform_sort_by" => "service_appointment_date"
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "services",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Services / Follow Up",
  :fields => services_fields,
  "editable" => false,
  "name_en" => "Services",
  "description_en" => "Services form",
})
