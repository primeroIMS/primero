followup_subform_fields = [
  Field.new({"name" => "followup_type",
             "type" => "select_box",
             "display_name_all" => "Type of follow up",
             "option_strings_text_all" =>
                          ["Follow up After Reunification",
                           "Follow up in Care",
                           "Follow up for Service",
                           "Follow up for Assessment"].join("\n")
            }),
  Field.new({"name" => "followup_service_type",
             "type" => "select_box",
             "display_name_all" => "Type of service",
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
                            "Social Support Service",
                            "Education Service",
                            "BID or BIA / Care Plan Service",
                            "NFI/Clothes/Shoes Service",
                            "Water/Sanitation Service",
                            "Care Arrangement Service",
                            "Registration Service",
                            "Food Service",
                            "Other Service"].join("\n")
            }),
  Field.new({"name" => "followup_assessment_type",
             "type" => "select_box",
             "display_name_all" => "Type of assessment",
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
  Field.new({"name" => "followup_needed_by_date",
             "type" => "date_field",
             "display_name_all" => "Follow up needed by"
            }),
  Field.new({"name" => "followup_date",
             "type" => "date_field",
             "display_name_all" => "Follow up date"
            }),
  Field.new({"name" => "child_was_seen",
             "type" => "radio_button",
             "display_name_all" => "Was the child/adult seen during the visit?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "reason_child_not_seen",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If not, why?",
             "option_strings_text_all" => [
                { id: 'abducted', display_text: "Abducted" },
                { id: 'at_school', display_text: "At School" },
                { id: 'child_in_detention', display_text: "Child in Detention" },
                { id: 'moved_onto_street_market', display_text: "Moved onto street/Market" },
                { id: 'moved_to_live_with_another_caregiver', display_text: "Moved to live with another caregiver" },
                { id: 'visiting_friends_relatives', display_text: "Visiting Friends/Relatives" },
                { id: 'working_at_work', display_text: "Working /At work" },
                { id: 'other', display_text: "Other, please specify" }
              ]
            }),
  Field.new({"name" => "reason_child_not_seen_other_details",
             "type" => "text_field",
             "display_name_all" => "If other, please specify"
            }),
  Field.new({"name" => "action_taken_already",
             "type" => "radio_button",
             "display_name_all" => "Has action been taken?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "action_taken_details",
             "type" => "text_field",
             "display_name_all" => "Details about action taken"
            }),
  Field.new({"name" => "action_taken_date",
             "type" => "date_field",
             "display_name_all" => "Date action taken?"
            }),
  Field.new({"name" => "need_follow_up_visit",
             "type" => "radio_button",
             "display_name_all" => "Is there a need for further follow up visits?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "when_follow_up_visit_should_happen",
             "type" => "date_field",
             "display_name_all" => "If yes, when do you recommend the next visit to take place?"
            }),
  Field.new({"name" => "recommend_case_closed",
             "type" => "radio_button",
             "display_name_all" => "If not, do you recommend that the case be closed?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "followup_comments",
             "type" => "text_field",
             "display_name_all" => "Comments"
            })
]

followup_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 1,
  :unique_id => "followup_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => followup_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Followup Subform",
  "description_all" => "Nested Followup Subform",
  "collapsed_fields" => ["followup_service_type", "followup_assessment_type", "followup_date"]
})

followup_fields = [
  Field.new({"name" => "followup_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => followup_subform_section.unique_id,
             "display_name_all" => "Follow Up"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "followup",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Services / Follow Up",
  "editable" => true,
  :fields => followup_fields,
  "name_all" => "Follow Up",
  "description_all" => "Follow Up"
})