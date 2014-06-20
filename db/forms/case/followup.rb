followup_subform_fields = [
  Field.new({"name" => "followup_type",
             "type" => "select_box",
             "display_name_all" => "Type of followup",
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
                           ["Follow up for Safehouse Service",
                            "Follow up for Health/Medical Service",
                            "Follow up for Psychosocial Service",
                            "Follow up for Police/Other Service",
                            "Follow up for Legal Assistance Service",
                            "Follow up for Livelihoods Service",
                            "Follow up for Child Protection Service",
                            "Follow up for Family Mediation Service",
                            "Follow up for Family Reunification Service",
                            "Follow up for Social Support Service",
                            "Follow up for Education Service",
                            "Follow up for BID or BIA / Care Plan Service",
                            "Follow up for NFI/Clothes/Shoes Service",
                            "Follow up for Water/Sanitation Service",
                            "Follow up for Care Arrangement Service",
                            "Follow up for Registration Servic",
                            "Follow up for Food Service",
                            "Follow up for Other Service"].join("\n")
            }),
  Field.new({"name" => "followup_assessment_type",
             "type" => "select_box",
             "display_name_all" => "Type of assessment",
             "option_strings_text_all" =>
                           ["Follow up for Personal Intervention Assessment",
                            "Follow up for Medical Intervention Assessment",
                            "Follow up for Family Intervention Assessment",
                            "Follow up for Community Intervention Assessment",
                            "Follow up for UNHCR Intervention Assessment",
                            "Follow up for NGO Intervention Assessment",
                            "Follow up for Economic Intervention Assessment",
                            "Follow up for Education Intervention Assessment",
                            "Follow up for Health Intervention Assessment",
                            "Follow up for Other Intervention Assessment"].join("\n")
            }),
  Field.new({"name" => "followup_needed_by_date",
             "type" => "date_field",
             "display_name_all" => "Followup needed by"
            }),
  Field.new({"name" => "followup_date",
             "type" => "date_field",
             "display_name_all" => "Followup date"
            }),
  Field.new({"name" => "child_was_seen",
             "type" => "select_box",
             "display_name_all" => "Was the child/adult seen during the visit?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "reason_child_not_seen",
             "type" => "check_boxes",
             "display_name_all" => "If not, why?",
             "option_strings_text_all" =>
                          ["Abducted",
                           "At School",
                           "Child in Detention",
                           "Moved onto street/Market",
                           "Moved to live with another caregiver",
                           "Visiting Friends/Relatives",
                           "Working /At work "].join("\n")
            }),
  Field.new({"name" => "action_taken_already",
             "type" => "select_box",
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
             "type" => "select_box",
             "display_name_all" => "Is there a need for further follow-up visits?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "when_follow_up_visit_should_happen",
             "type" => "text_field",
             "display_name_all" => "If yes, when do you recommend the next visit to take place?"
            }),
  Field.new({"name" => "recommend_case_closed",
             "type" => "select_box",
             "display_name_all" => "If not, do you recommend that the case be close?",
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
  :order => 1,
  :unique_id => "followup_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => followup_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Followup Subform",
  "description_all" => "Nested Followup Subform"
})

followup_fields = [
  Field.new({"name" => "followup_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => followup_subform_section.id,
             "display_name_all" => "Follow Up"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "followup",
  :parent_form=>"case",
  "visible" => true,
  :order => 6,
  "editable" => true,
  :fields => followup_fields,
  :perm_enabled => true,
  "name_all" => "Follow Up",
  "description_all" => "Follow Up"
})