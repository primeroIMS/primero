followups_fields = [
  Field.new({"name" => "followup_service_type",
             "type" => "select_box",
             "multi_select" => false,
             "disabled" => true,
             "display_name_all" => "Action Taken During the Interview / Visit (service)",
             "option_strings_text_all" =>
                           ["Safehouse Service",
                            "Health/Medical Service",
                            "Psychosocial Service",
                            "Police/Other Service",
                            "Legal Assistance Service",
                            "Livelihoods Service",
                            "Child Protection Service",
                            "Family Mediation Service",
                            "Family Reunification Service",
                            "Education Service",
                            "NFI/Clothes/Shoes Service",
                            "Water/Sanitation Service",
                            "Registration Service",
                            "Food Service",
                            "Other Service"].join("\n")
            }),
  Field.new({"name" => "followup_assessment_type",
             "type" => "select_box",
             "display_name_all" => "Action Taken During the Interview / Visit (assessment)",
             "option_strings_text_all" =>
                           ["Personal Intervention Assessment",
                            "Medical Intervention Assessment",
                            "Family Intervention Assessment",
                            "Community Intervention Assessment",
                            "UNHCR Intervention Assessment",
                            "NGO Intervention Assessment",
                            "Economic Intervention Assessment",
                            "Education Intervention Assessment",
                            "Health Intervention Assessment",
                            "Other Intervention Assessment"].join("\n")
            }),
  Field.new({"name" => "planned_needed_actions_follow_up_visit",
             "type" => "textarea",
             "display_name_all" => "Next Planned / Needed Actions",
             "disabled" => true
            }),
  Field.new({"name" => "need_follow_up_visit_frequency",
             "type" => "select_box",
             "multi_select" => false,
             "display_name_all" => "Frequency",
             "option_strings_text_all" => "Daily\r\nWeekly\r\nMonthly\r\nNon Urgent",
             "disabled" => true
            }),
  Field.new({"name" => "when_follow_up_visit_should_happen",
             "type" => "date_field",
             "display_name_all" => "Date"
            })
]

followups = FormSection.create_or_update_form_section({
    :unique_id => "bia_followups_subform",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => followups_fields,
    :initial_subforms => 1,
    "name_all" => "List of Followups",
    "description_all" => "List of Followups"
})
