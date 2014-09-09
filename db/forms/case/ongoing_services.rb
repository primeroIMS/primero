ongoing_services_subform = [
  Field.new({
    "name" => "service_type",
    "type" => "select_box",
    "display_name_all" => "Type of Service",
    "option_strings_text_all" => [
      "Safehouse",
      "Health/Medical",
      "Psycosocial/Counseling",
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
  Field.new({
    "name" => "service_location",
    "type" => "text_field",
    "display_name_all" => "Service Location"
  }),
  Field.new({
    "name" => "service_referral_notes",
    "type" => "text_field",
    "display_name_all" => "Notes"
  })
]

ongoing_services_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 110,
  :order => 50,
  :order_subform => 1,
  :unique_id=>"ongoing_services_section",
  :parent_form=>"case",
  "editable"=>true,
  :fields => ongoing_services_subform,
  :initial_subforms => 1,
  "name_all" => "Nested Ongoing Services",
  "description_all" => "Ongoing Services Subform",
  "collapsed_fields" => ["service_type", "service_appointment_date"]
})

ongoing_services_fields = [
  Field.new({
    "name" => "ongoing_services_section",
    "type" => "subform", "editable" => true,
    "subform_section_id" => ongoing_services_section.unique_id,
    "display_name_all" => "Ongoing Services"
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "ongoing_services",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 120,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Services / Follow Up",
  :fields => ongoing_services_fields,
  "editable" => false,
  "name_all" => "Ongoing Services",
  "description_all" => "Ongoing Services form",
})