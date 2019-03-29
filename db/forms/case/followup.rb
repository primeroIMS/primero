followup_subform_fields = [
  Field.new({"name" => "followup_type",
             "type" => "select_box",
             "display_name_en" => "Type of follow up",
             "option_strings_source" => "lookup lookup-followup-type"
            }),
  Field.new({"name" => "followup_service_type",
             "type" => "select_box",
             "display_name_en" => "Type of service",
             "option_strings_source" => "lookup lookup-service-type"
            }),
  Field.new({"name" => "followup_assessment_type",
             "type" => "select_box",
             "display_name_en" => "Type of assessment",
             "option_strings_text_en" => [
               { id: 'personal_intervention_assessment', display_text: "Personal Intervention Assessment" },
               { id: 'medical_intervention_assessment', display_text: "Medical Intervention Assessment" },
               { id: 'family_intervention_assessment', display_text: "Family Intervention Assessment" },
               { id: 'community_intervention_assessment', display_text: "Community Intervention Assessment" },
               { id: 'unhcr_intervention_assessment', display_text: "UNHCR Intervention Assessment" },
               { id: 'ngo_intervention_assessment', display_text: "NGO Intervention Assessment" },
               { id: 'economic_intervention_assessment', display_text: "Economic Intervention Assessment" },
               { id: 'education_intervention_assessment', display_text: "Education Intervention Assessment" },
               { id: 'health_intervention_assessment', display_text: "Health Intervention Assessment" },
               { id: 'other_intervention_assessment', display_text: "Other Intervention Assessment" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "protection_concern_type",
             "type" => "select_box",
             "visible" => false,
             "display_name_en" => "Type of Protection Concern ",
             "option_strings_source" => "lookup lookup-protection-concerns"
            }),
  Field.new({"name" => "followup_needed_by_date",
             "type" => "date_field",
             "display_name_en" => "Follow up needed by"
            }),
  Field.new({"name" => "followup_date",
             "type" => "date_field",
             "display_name_en" => "Follow up date"
            }),
  Field.new({"name" => "child_was_seen",
             "type" => "radio_button",
             "display_name_en" => "Was the child/adult seen during the visit?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "reason_child_not_seen",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "If not, why?",
             "option_strings_text_en" => [
               { id: 'abducted', display_text: "Abducted" },
               { id: 'at_school', display_text: "At School" },
               { id: 'child_in_detention', display_text: "Child in Detention" },
               { id: 'moved_onto_street', display_text: "Moved onto street/Market" },
               { id: 'moved_to_live_with_another_caregiver', display_text: "Moved to live with another caregiver" },
               { id: 'visiting_friends_relatives', display_text: "Visiting Friends/Relatives" },
               { id: 'working', display_text: "Working /At work" },
               { id: 'other', display_text: "Other, please specify" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "reason_child_not_seen_other_details",
             "type" => "text_field",
             "display_name_en" => "If other, please specify"
            }),
  Field.new({"name" => "action_taken_already",
             "type" => "radio_button",
             "display_name_en" => "Has action been taken?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "action_taken_details",
             "type" => "text_field",
             "display_name_en" => "Details about action taken"
            }),
  Field.new({"name" => "action_taken_date",
             "type" => "date_field",
             "display_name_en" => "Date action taken?"
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
  Field.new({"name" => "recommend_case_closed",
             "type" => "radio_button",
             "display_name_en" => "If not, do you recommend that the case be closed?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "followup_comments",
             "type" => "text_field",
             "display_name_en" => "Comments"
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
  :initial_subforms => 0,
  "name_en" => "Nested Followup Subform",
  "description_en" => "Nested Followup Subform",
  "collapsed_field_names" => ["followup_date", "followup_type"]
})

followup_fields = [
  Field.new({"name" => "followup_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section" => followup_subform_section,
             "display_name_en" => "Follow Up",
             "subform_sort_by" => "followup_date"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "followup",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 0,
  :form_group_id => "services_follow_up",
  "editable" => true,
  :fields => followup_fields,
  "name_en" => "Follow Up",
  "description_en" => "Follow Up"
})