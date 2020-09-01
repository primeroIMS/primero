conference_details_subform_fields = [
  Field.new({"name" => "conference_date",
             "type" => "date_field",
             "display_name_en" => "Date of meeting"
            }),
  Field.new({"name" => "conference_type",
             "type" => "select_box",
             "display_name_en" => "Type of meeting",
             "option_strings_text_en" => [
               { id: 'case_plan_review', display_text: "Case Plan Review" },
               { id: 'case_conference', display_text: "Case Conference" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "conference_type_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "conference_reason",
             "type" => "select_box",
             "display_name_en" => "Reason for Case Conference",
             "option_strings_text_en" => [
               { id: 'removal_child_from_caregiver', display_text: "Removal of a child from their primary/customary caregiver" },
               { id: 'placement_child_alternative_care', display_text: "Placement of a child into alternative care" },
               { id: 'complex_child_protection_situation', display_text: "Complex child protection situation requiring intervention" },
               { id: 'family_reunification', display_text: "Family Reunification" },
               { id: 'transferred', display_text: "The child has been or will be relocating - Case transfer" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "conference_reason_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "conference_participants",
             "type" => "textarea",
             "display_name_en" => "Participants",
             "help_text_en" => "List each participant in the conference. Include their name, their role or relationship to the child, their Organization, and a contact phone number or email"
            }),
  Field.new({"name" => "conference_current_situation",
             "type" => "textarea",
             "display_name_en" => "Brief summary of the current situation",
             "help_text_en" => "Highlight all major protection issues, the child's current care arrangement, and an overview of the reasons for the case conference"
            }),
  Field.new({"name" => "conference_outcome_recommendations",
             "type" => "textarea",
             "display_name_en" => "Outcome and recommendations of the panel",
             "help_text_en" => "Briefly summarize the justifications for the decisions made and below recommendations"
            }),
  Field.new({"name" => "conference_case_status",
             "type" => "select_box",
             "display_name_en" => "Status of the case",
             "option_strings_source" => "lookup lookup-conference-case-status",
             "help_text_en" => "If case will be closed, please complete Closure form."
            }),
  Field.new({"name" => "conference_case_status_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "conference_case_transfer_reason",
             "type" => "select_box",
             "display_name_en" => "If the case will be transferred, please provide reason",
             "option_strings_text_en" => [
               { id: 'specialized_service' , display_text: "Specialized services required" },
               { id: 'new_location', display_text: "Moving to new location" },
               { id: 'organisational_reasons', display_text: "Organisational reasons" },
               { id: 'protection_concerns', display_text: "Relocation due to protection concerns" },
               { id: 'child_turned_18', display_text: "Child turned 18 and requires ongoing protection" },
               { id: 'other' , display_text: "Other" }
             ].map(&:with_indifferent_access),
             "guiding_questions_en" =>
                 ["Another agency is better placed to manage the case due to specialised services required by child",
                  "Child / family moving to a new location; the case will be transferred to the Child Protection Agency working in that location.",
                  "There are organisatonal reasons for transferring this child's case; the case will be closed and transferred to another agency.",
                  "The child is being relocated due to protection concerns in their family/community.",
                  "The child has turned 18 and the case is being transferred to a protection authority providing services to people 18 or above as the child has a physical or mental disability and requires ongoing protection.",
                  "Other"
                 ].join("\n")
            }),
  Field.new({"name" => "conference_case_transfer_reason_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "conference_followup_actions",
             "type" => "textarea",
             "display_name_en" => "Follow up actions/referrals/services required and the persons responsible",
             "guiding_questions_en" => "Ensure that the child/caregiver are informed of the outcome of the case conference as well as all recommendations and actions required. Planned actions to be updated into individual case plans by Case Workers/Social Worker/Agency staff"
            })
]

conference_details_subform_section = FormSection.create_or_update!({
  :is_nested => true,
  :order_form_group => 999,
  :order => 999,
  :visible => false,
  :order_subform => 1,
  :unique_id =>"conference_details_subform_section",
  :parent_form => "case",
  :editable => true,
  :fields => conference_details_subform_fields,
  :initial_subforms => 0,
  :name_en => "Conference Details",
  :description_en => "Conference Details",
  :collapsed_field_names => ["conference_type", "conference_date"]
})

conference_details_fields = [
  ##Subform##
  Field.new({"name" => "conference_details_subform",
             "type" => "subform",
             "editable" => true,
             "subform_section" => conference_details_subform_section,
             "subform_sort_by" => "conference_date",
             "display_name_en" => "Case Conference Details"
            })
  ##Subform##
]

FormSection.create_or_update!({
  :unique_id => "conference_details_container",
  :parent_form =>"case",
  :visible => true,
  :order_form_group => 10,
  :order => 10,
  :order_subform => 0,
  :form_group_id => "case_conference_details",
  :editable => true,
  :fields => conference_details_fields,
  :name_en => "Case Conference Details",
  :description_en => "Case Conference Details"
})
