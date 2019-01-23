gbv_introduction_and_engagement_fields = [
  Field.new({"name" => "rate_of_report",
             "mobile_visible" => false,
             "type" => "tick_box",
             "display_name_en" => "Rate of report",
						 "editable" => false,
						 "disabled" => true
            }),
  Field.new({"name" => "elapsed_time_for_incident_and_report",
             "mobile_visible" => false,
             "type" => "tick_box",
             "display_name_en" => "Time elapsed between incident and report to service provider",
						 "editable" => false,
						 "disabled" => true
            }),
  Field.new({"name" => "average_delay_of_access",
             "mobile_visible" => false,
             "type" => "tick_box",
             "display_name_en" => "Average delay of access to specialized GBV services",
						 "editable" => false,
						 "disabled" => true
            }),
];

FormSection.create_or_update_form_section({
  unique_id: "gbv_introduction_and_engagement",
  parent_form: "kpi",
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_name: "Introduction and Engagement",
  fields: gbv_introduction_and_engagement_fields,
  name_en: "Introduction and Engagement",
  description_en: "Introduction and Engagement"
})
