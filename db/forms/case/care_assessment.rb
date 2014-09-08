care_assessment_fields = [
  Field.new({"name" => "intervention_personal_type_needed",
             "type" => "select_box",
             "display_name_all" => "Personal intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_personal_notes",
             "type" => "textarea",
             "display_name_all" => "Personal Intervention Notes"
            }),
  Field.new({"name" => "intervention_family_type_needed",
               "type" => "select_box",
               "display_name_all" => "Family intervention needed?",
               "option_strings_text_all" =>
                            ["No Further Action Needed",
                             "Ongoing Monitoring",
                             "Urgent Intervention"].join("\n")
              }),
  Field.new({"name" => "intervention_family_notes",
             "type" => "textarea",
             "display_name_all" => "Family Intervention Notes"
            }),
  Field.new({"name" => "intervention_medical_type_needed",
             "type" => "select_box",
             "display_name_all" => "Medical intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_medical_notes",
             "type" => "textarea",
             "display_name_all" => "Medical Intervention Notes"
            }),
  Field.new({"name" => "intervention_community_type_needed",
             "type" => "select_box",
             "display_name_all" => "Community intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_community_notes",
             "type" => "textarea",
             "display_name_all" => "Community Intervention Notes"
            }),
  Field.new({"name" => "intervention_needed_unhcr",
             "type" => "select_box",
             "display_name_all" => "UNHCR intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_unhcr_notes",
             "type" => "textarea",
             "display_name_all" => "UNHCR Intervention Notes"
            }),
  Field.new({"name" => "intervention_needed_ngo",
             "type" => "select_box",
             "display_name_all" => "NGO intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_ngo_notes",
             "type" => "textarea",
             "display_name_all" => "NGO Intervention Notes"
            }),
  Field.new({"name" => "intervention_economical_type_needed",
             "type" => "select_box",
             "display_name_all" => "Economic intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_economical_notes",
             "type" => "textarea",
             "display_name_all" => "Economic Intervention Notes"
            }),
  Field.new({"name" => "intervention_education_type_needed",
             "type" => "select_box",
             "display_name_all" => "Education intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_education_notes",
             "type" => "textarea",
             "display_name_all" => "Education Intervention Notes"
            }),
  Field.new({"name" => "intervention_health_type_needed",
             "type" => "select_box",
             "display_name_all" => "Health intervention needed?",
             "option_strings_text_all" =>
                          ["No Further Action Needed",
                           "Ongoing Monitoring",
                           "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_health_notes",
             "type" => "textarea",
             "display_name_all" => "Health Intervention Notes"
            }),
  Field.new({"name" => "intervention_other_type_needed",
             "type" => "select_box",
             "display_name_all" => "Other Intervention needed?",
             "option_strings_text_all" =>
                ["No Further Action Needed",
                 "Ongoing Monitoring",
                 "Urgent Intervention"].join("\n")
            }),
  Field.new({"name" => "intervention_other_notes",
             "type" => "text_field",
             "display_name_all" => "Other Intervention Notes"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "care_assessment",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Assessment",
  :fields => care_assessment_fields,
  "editable" => true,
  "name_all" => "Care Assessment",
  "description_all" => "Care Assessment"
})
