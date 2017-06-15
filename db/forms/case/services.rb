services_subform = [
  Field.new({
    "name" => "service_response_type",
    "type" => "select_box",
    "display_name_all" => "Type of Response",
    "option_strings_source" => "lookup lookup-service-response-type"
  }),
  Field.new({
    "name" => "service_type",
    "type" => "select_box",
    "display_name_all" => "Type of Service",
    "option_strings_text_all" => [
      "Safehouse",
      "Health/Medical",
      "Psychosocial/Counseling",
      "Legal Assistance",
      "Police or Other Type of Security",
      "Livelihoods",
      "Child Protection",
      "Family Mediation",
      "Family Reunification",
      "Social Support",
      "Education",
      "BID or BIA / Care-Plan",
      "NFI/Clothes/Shoes",
      "Water/Sanitation",
      "Care Arrangement",
      "Refugee Registration",
      "Food",
      "Other"
    ].join("\n")
  }),
  Field.new({
    "name" => "service_referral",
    "type" => "select_box",
    "display_name_all" => "Did you refer the client for this service?",
    "option_strings_text_all" => [
      "Referred",
      "No referral, Service provided by your agency",
      "No referral, Services already received from another agency",
      "No referral, Service not applicable",
      "No, Referral declined by survivor",
      "No referral, Service unavailable"
    ].join("\n")
  }),
  Field.new({
    "name" => "service_appointment_date",
    "type" => "date_field",
    "display_name_all" => "Appointment Date"
  }),
  Field.new({
    "name" => "service_appointment_time",
    "type" => "text_field",
    "display_name_all" => "Appointment Time"
  }),
  Field.new({
    "name" => "service_provider",
    "type" => "text_field",
    "display_name_all" => "Service Provider"
  }),
  Field.new({"name" => "service_status_referred",
    "type" => "tick_box",
    "tick_box_label_all" => "Yes",
    "display_name_all" => "Referred?",
    "disabled" => true,
  }),
  Field.new({
    "name" => "service_location",
    "type" => "text_field",
    "display_name_all" => "Service Location"
  }),
  Field.new({
    "name" => "service_referral_notes",
    "type" => "textarea",
    "display_name_all" => "Notes"
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
  "name_all" => "Nested Services",
  "description_all" => "Services Subform",
  "collapsed_fields" => ["service_type", "service_appointment_date"]
})

services_fields = [
  Field.new({
    "name" => "services_section",
    "type" => "subform",
    "editable" => true,
    "subform_section_id" => services_section.unique_id,
    "display_name_all" => "Services",
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
  "name_all" => "Services",
  "description_all" => "Services form",
})
