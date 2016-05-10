action_plan_subform_fields = [
  Field.new({
    "name" => "action_plan_description",
    "type" => "textarea",
    "display_name_all" => "Describe the action plan to address this need."
  }),
  Field.new({
    "name" => "service_type",
    "type" => "select_box",
    "display_name_all" => "Type of Need",
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
      "Education",
      "NFI/Clothes/Shoes",
      "Water/Sanitation",
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
      "No referral, Declined by survivor",
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

action_plan_subform_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 110,
    :order => 50,
    :order_subform => 1,
    :unique_id=>"action_plan_subform_section",
    :parent_form=>"case",
    "editable"=>true,
    :fields => action_plan_subform_fields,
    :initial_subforms => 1,
    "name_all" => "Nested Action Plan",
    "description_all" => "Action Plan Subform",
    "collapsed_fields" => ["service_type", "service_appointment_date"]
})

action_plan_fields = [
  Field.new({"name" => "incident_links",
             "type" => "custom",
             "display_name_all" => "Incident Links",
             "custom_template" => "children/incident_links",
             "create_property" => false,
             "editable" => true
            }),
  Field.new({"name" => "action_explanation_header",
             "type" => "separator",
             "display_name_all" => "Please add all needs that you identified in the assessment. Use the Add button to add other needs that should be part of the Action Plan."
            }),
  Field.new({"name" => "action_plan_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => action_plan_subform_section.unique_id,
             "display_name_all" => "Action Plan"
            }),
  Field.new({"name" => "action_follow_up_header",
             "type" => "separator",
             "display_name_all" => "Follow Up"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"action_plan_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 55,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Action Plan",
  "editable" => true,
  :fields => action_plan_fields,
  "name_all" => "Action Plan",
  "description_all" => "Action Plan"
})