gbv_follow_up_subform_fields = [
  Field.new({"name" => "service_type_provided",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Type of service provided by me/my organization",
             "option_strings_source" => "lookup lookup-service-type"
            }),
  Field.new({"name" => "followup_date",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "date_field",
             "display_name_en" => "Follow up date"
            }),
  Field.new({"name" => "followup_service_type",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Type of referral service",
             "option_strings_source" => "lookup lookup-service-type"
            }),
  Field.new({"name" => "action_taken_already",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Has action been taken?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "action_taken_details",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Details about action taken"
            }),
  Field.new({"name" => "service_provided_date",
             "type" => "date_field",
             "display_name_en" => "If yes, when was the service provided?"
            }),
  Field.new({"name" => "need_follow_up_visit",
             "type" => "radio_button",
             "display_name_en" => "Is there a need for further follow up visits?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "when_follow_up_visit_should_happen",
             "type" => "date_field",
             "display_name_en" => "If yes, when do you recommend the next visit to take place?"
            }),
  Field.new({"name" => "follow_up_comments",
             "type" => "textarea",
             "display_name_en" => "Comments"
            }),
  Field.new({"name" => "follow_up_survivor_share_needs",
             "type" => "radio_button",
             "display_name_en" => "Did the survivor share any new needs or concerns during the follow up appointment?",
             "option_strings_source" => "lookup lookup-yes-no",
             "help_text_en" => "If yes, please describe the needs and revise the Case Action Plan section accordingly"
            }),
  Field.new({"name" => "survivor_needs_met",
             "type" => "radio_button",
             "display_name_en" => "Did the action(s) taken meet the survivor's needs?",
             "option_strings_source" => "lookup lookup-yes-no",
             "help_text_en" => "If not, please update the Case Action Plan section accordingly to address the need(s)"
            }),
  Field.new({"name" => "referred_for_another_appointment",
             "type" => "select_box",
             "display_name_en" => "If not, did you refer the survivor for another appointment?",
             "option_strings_source" => "lookup lookup-service-referred"
            }),
  Field.new({"name" => "recommend_case_closed",
             "mobile_visible" => false,
             "type" => "radio_button",
             "display_name_en" => "If needs are met, do you recommend that the case be closed?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "case_action_plan_implementation_timing",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "select_box",
             "display_name_en" => "How long did it take you to implement the Case Action Plan for this incident?",
             "option_strings_source" => "lookup lookup-assessment-duration"
            }),
  Field.new({"name" => "progress_made_towards_goals",
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_en" => "Progress made towards GOALS",
             "help_text_en" => "Evaluate Progress Made Towards GOALS agreed on in Survivor Assessment & Case Action Plan"
            }),
  Field.new({"name" => "gbv_assessment_progress_safety",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Progress towards Safety goals",
             "option_strings_source" => "lookup lookup-assessment-progress"
            }),
  Field.new({"name" => "gbv_assessment_progress_safety_text",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Explain Progress towards Safety goals"
            }),
  Field.new({"name" => "gbv_assessment_progress_health",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Progress towards Heath care goals",
             "option_strings_source" => "lookup lookup-assessment-progress"
            }),
  Field.new({"name" => "gbv_assessment_progress_health_text",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Explain Progress towards Heath care goals"
            }),
  Field.new({"name" => "gbv_assessment_progress_psychosocial",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Progress towards Psychosocial Support goals",
             "option_strings_source" => "lookup lookup-assessment-progress"
            }),
  Field.new({"name" => "gbv_assessment_progress_psychosocial_text",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Explain Progress towards Psychosocial Support goals"
            }),
  Field.new({"name" => "gbv_assessment_progress_justice",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Progress towards Justice/legal goals",
             "option_strings_source" => "lookup lookup-assessment-progress"
            }),
  Field.new({"name" => "gbv_assessment_progress_justice_text",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Explain Progress towards Access to Justice/legal goals"
            }),
  Field.new({"name" => "gbv_assessment_other_goals_list",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Other goals (list here)"
            }),
  Field.new({"name" => "gbv_assessment_other_goals",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Progress towards other goals",
             "option_strings_source" => "lookup lookup-assessment-progress"
            }),
  Field.new({"name" => "gbv_assessment_other_goals_text",
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Explain Progress towards other goals"
            })
]

action_plan_subform_fields = [
  Field.new({
    "name" => "action_plan_description",
    "show_on_minify_form" => true,
    "mobile_visible" => true,
    "type" => "textarea",
    "display_name_en" => "Describe the action plan to address this need."
  }),
  Field.new({
    "name" => "service_type",
    "mobile_visible" => true,
    "type" => "select_box",
    "display_name_en" => "Type of Need",
    "option_strings_source" => "lookup lookup-service-type"
  }),
  Field.new({
    "name" => "service_referral",
    "mobile_visible" => true,
    "type" => "select_box",
    "display_name_en" => "When appropriate, did you refer the survivor for this service?",
    "option_strings_source" => "lookup lookup-service-referred"
  }),
  Field.new({
      "name" => "service_referral_written_consent",
      "mobile_visible" => true,
      "show_on_minify_form" => true,
      "type" => "radio_button",
      "display_name_en" => "Did you receive written consent from survivor to release personal Information for the purpose of referrals?",
      "option_strings_source" => "lookup lookup-yes-no"
  }),
  Field.new({
    "name" => "service_appointment_date",
    "mobile_visible" => true,
    "type" => "date_field",
    "display_name_en" => "Appointment Date"
  }),
  Field.new({
    "name" => "service_appointment_time",
    "mobile_visible" => false,
    "type" => "text_field",
    "display_name_en" => "Appointment Time"
  }),
  Field.new({
    "name" => "service_provider",
    "mobile_visible" => true,
    "type" => "text_field",
    "display_name_en" => "Service Provider"
  }),
  Field.new({
    "name" => "service_location",
    "mobile_visible" => false,
    "type" => "text_field",
    "display_name_en" => "Service Location"
  }),
  Field.new({
    "name" => "service_referral_notes",
    "mobile_visible" => false,
    "type" => "textarea",
    "display_name_en" => "Notes"
  }),
  Field.new({
    "name" => "service_referral_mandatory_reporting",
    "type" => "radio_button",
    "display_name_en" => "If mandatory reporting laws apply, did you report the incident to the police/public authorities?",
    "option_strings_source" => "lookup lookup-yes-no"
  }),
  Field.new({
    "name" => "service_referral_mandatory_reporting_inform_survivor",
    "type" => "radio_button",
    "display_name_en" => "If yes, did you inform the survivor and/or her caregiver of the mandatory reporting laws prior to making the report?",
    "option_strings_source" => "lookup lookup-yes-no"
  }),
  Field.new({
    "name" => "service_referral_case_action_plan_timing",
    "mobile_visible" => true,
    "show_on_minify_form" => true,
    "type" => "select_box",
    "display_name_en" => "How long did it take you to develop the Case Action Plan with the survivor for this case?",
    "option_strings_source" => "lookup lookup-assessment-duration"
  })
]

gbv_follow_up_subform_section = FormSection.create_or_update_form_section({
  visible: false,
  is_nested: true,
  order_form_group: 60,
  order: 10,
  order_subform: 1,
  unique_id: "gbv_follow_up_subform_section",
  parent_form: "case",
  editable: true,
  fields: gbv_follow_up_subform_fields,
  initial_subforms: 1,
  mobile_form: true,
  perm_visible: false,
  name_en: "Nested GBV Follow Up Subform",
  description_en: "Nested GBV Follow Up Subform",
  collapsed_fields: ["followup_service_type", "followup_date"]
})

action_plan_subform_section = FormSection.create_or_update_form_section({
    visible: false,
    is_nested: true,
    mobile_form: true,
    order_form_group: 60,
    order: 50,
    order_subform: 1,
    unique_id: "action_plan_subform_section",
    parent_form: "case",
    editable: true,
    fields: action_plan_subform_fields,
    initial_subforms: 1,
    name_en: "Nested Action Plan",
    description_en: "Action Plan Subform",
    collapsed_fields: ["service_type", "service_appointment_date"]
})

action_plan_fields = [
  Field.new({"name" => "incident_links",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "custom",
             "display_name_en" => "Incident Links",
             "custom_template" => "children/incident_links",
             "create_property" => false,
             "editable" => true
            }),
  Field.new({"name" => "action_explanation_header",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_en" => "Action Plan ", #Note the extra trailing space!
             "help_text_en" => "Please add all needs that you identified in the assessment. Use the Add button to add other needs that should be part of the Action Plan."
            }),
  Field.new({"name" => "action_plan_section",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => action_plan_subform_section.unique_id,
             "display_name_en" => "Action Plan"
            }),
  Field.new({"name" => "action_follow_up_header",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_en" => "Follow Ups"
            }),
  Field.new({"name" => "gbv_follow_up_subform_section",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => gbv_follow_up_subform_section.unique_id,
             "display_name_en" => "Follow Up"
  })
]

FormSection.create_or_update_form_section({
  unique_id: "action_plan_form",
  parent_form: "case",
  visible: true,
  order_form_group: 60,
  order: 30,
  order_subform: 0,
  form_group_name: "Action Plan",
  editable: true,
  fields: action_plan_fields,
  mobile_form: true,
  name_en: "Action Plan",
  description_en: "Action Plan"
})