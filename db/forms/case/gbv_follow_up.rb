gbv_follow_up_subform_fields = [
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
  Field.new({"name" => "followup_date",
             "type" => "date_field",
             "display_name_all" => "Follow up date"
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

evaluate_progress_subform_fields = [
  Field.new({"name" => "gbv_assessment_goal",
             "type" => "select_box",
             "display_name_all" => "Goal",
             "option_strings_text_all" =>
                ["Safety",
                 "Health Care",
                 "Psychosocial Support",
                 "Access to Justice",
                 "Other, please specify"].join("\n")
            }),
  Field.new({"name" => "gbv_assessment_goal_other",
             "type" => "text_field",
             "display_name_all" => "If Other, please specify"
            }),
  Field.new({"name" => "gbv_assessment_goal_status",
             "type" => "select_box",
             "display_name_all" => "Status towards Goal",
             "option_strings_text_all" => "In Progress\nMet"
            }),
  Field.new({"name" => "gbv_assessment_explaination",
             "type" => "text_field",
             "display_name_all" => "Explain"
            })
]

gbv_follow_up_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 10,
  :order => 10,
  :order_subform => 1,
  :unique_id => "gbv_follow_up_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => gbv_follow_up_subform_fields,
  :perm_visible => false,
  "name_all" => "Nested GBV Follow Up Subform",
  "description_all" => "Nested GBV Follow Up Subform",
  "collapsed_fields" => ["followup_service_type", "followup_date"]
})

evaluate_progress_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 20,
  :order => 20,
  :order_subform => 2,
  :unique_id => "evaluate_progress_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => evaluate_progress_subform_fields,
  :perm_visible => false,
  "name_all" => "Nested Evaluate Progress Made Towards GOALS agreed on in Survivor Assessment & Case Action Plan Subform",
  "description_all" => "Nested Evaluate Progress Made Towards GOALS agreed on in Survivor Assessment & Case Action Plan Subform"
})

gbv_follow_up_fields = [
  Field.new({"name" => "gbv_follow_up_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => gbv_follow_up_subform_section.unique_id,
             "display_name_all" => "Follow Up"
            }),
  Field.new({"name" => "evaluate_progress_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => evaluate_progress_subform_section.unique_id,
             "display_name_all" => "Evaluate Progress Made Towards GOALS agreed on in Survivor Assessment & Case Action Plan"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "gbv_follow_up_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Services / Follow Up",
  "editable" => true,
  :fields => gbv_follow_up_fields,
  :perm_enabled => true,
  "name_all" => "GBV Follow Up",
  "description_all" => "GBV Follow Up"
})