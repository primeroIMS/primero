care_assessment_fields = [
  Field.new({"name" => "intervention_personal_type_needed",
             "type" => "select_box",
             "display_name_en" => "Personal intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_personal_notes",
             "type" => "textarea",
             "display_name_en" => "Personal Intervention Notes"
            }),
  Field.new({"name" => "intervention_family_type_needed",
               "type" => "select_box",
               "display_name_en" => "Family intervention needed?",
               "option_strings_source" => "lookup lookup-further-action_needed"
              }),
  Field.new({"name" => "intervention_family_notes",
             "type" => "textarea",
             "display_name_en" => "Family Intervention Notes"
            }),
  Field.new({"name" => "intervention_medical_type_needed",
             "type" => "select_box",
             "display_name_en" => "Medical intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_medical_notes",
             "type" => "textarea",
             "display_name_en" => "Medical Intervention Notes"
            }),
  Field.new({"name" => "intervention_community_type_needed",
             "type" => "select_box",
             "display_name_en" => "Community intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_community_notes",
             "type" => "textarea",
             "display_name_en" => "Community Intervention Notes"
            }),
  Field.new({"name" => "intervention_needed_unhcr",
             "type" => "select_box",
             "display_name_en" => "UNHCR intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_unhcr_notes",
             "type" => "textarea",
             "display_name_en" => "UNHCR Intervention Notes"
            }),
  Field.new({"name" => "intervention_needed_ngo",
             "type" => "select_box",
             "display_name_en" => "NGO intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_ngo_notes",
             "type" => "textarea",
             "display_name_en" => "NGO Intervention Notes"
            }),
  Field.new({"name" => "intervention_economical_type_needed",
             "type" => "select_box",
             "display_name_en" => "Economic intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_economical_notes",
             "type" => "textarea",
             "display_name_en" => "Economic Intervention Notes"
            }),
  Field.new({"name" => "intervention_education_type_needed",
             "type" => "select_box",
             "display_name_en" => "Education intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_education_notes",
             "type" => "textarea",
             "display_name_en" => "Education Intervention Notes"
            }),
  Field.new({"name" => "intervention_health_type_needed",
             "type" => "select_box",
             "display_name_en" => "Health intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_health_notes",
             "type" => "textarea",
             "display_name_en" => "Health Intervention Notes"
            }),
  Field.new({"name" => "intervention_other_type_needed",
             "type" => "select_box",
             "display_name_en" => "Other Intervention needed?",
             "option_strings_source" => "lookup lookup-further-action_needed"
            }),
  Field.new({"name" => "intervention_other_notes",
             "type" => "text_field",
             "display_name_en" => "Other Intervention Notes"
            })
]

FormSection.create_or_update!({
  :unique_id => "care_assessment",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 10,
  :order_subform => 0,
  :form_group_id => "assessment",
  :fields => care_assessment_fields,
  "editable" => true,
  "name_en" => "Care Assessment",
  "description_en" => "Care Assessment"
})
