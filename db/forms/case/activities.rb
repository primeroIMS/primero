activities_fields = [
  Field.new({"name" => "activities_child_in_school_or_training",
             "type" => "radio_button",
             "display_name_en" => "Is the Child in school or training?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "activities_school_name",
             "type" => "text_field",
             "display_name_en" => "Name of School"
            }),
  Field.new({"name" => "activities_reason_not_in_school",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "If not, why not?",
             "option_strings_text_en" => [
                { id: 'child_labour', display_text: "Child Labour" },
                { id: 'early_marriage', display_text: "Early Marriage" },
                { id: 'financial_constraints', display_text: "Financial Constraints" },
                { id: 'ignorance', display_text: "Ignorance" },
                { id: 'lack_of_infrastructure', display_text: "Lack of Infrastructure" },
                { id: 'lack_of_access', display_text: "Lack of Access" },
                { id: 'lack_of_interest', display_text: "Lack of interest" },
                { id: 'children', display_text: "Children" },
                { id: 'pregnancy_child', display_text: "Pregnancy/Child" },
                { id: 'sent_abroad_for_job', display_text: "Sent abroad for job" },
                { id: 'Other', display_text: "Other" }
              ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "activities_education_type",
             "type" => "select_box",
             "display_name_en" => "If yes, what type of education?",
             "option_strings_text_en" => [
               { id: 'accelerated_learning', display_text: "Accelerated learning" },
               { id: 'early_childhood', display_text: "Early Childhood" },
               { id: 'non_formal_education', display_text: "Non-Formal Education" },
               { id: 'primary', display_text: "Primary" },
               { id: 'secondary', display_text: "Secondary" },
               { id: 'vocational', display_text: "Vocational" },
               { id: 'vocational_training', display_text: "Vocational training" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "activities_level_achieved",
             "type" => "select_box",
             "display_name_en" => "If relevant, what level have they achieved?",
             "option_strings_text_en" => [
               { id: 'carpentry', display_text: "Carpentry" },
               { id: 'gs1', display_text: "GS1" },
               { id: 'gs2', display_text: "GS2" },
               { id: 'gs3', display_text: "GS3" },
               { id: 'level_1', display_text: "level 1" },
               { id: 'level_2', display_text: "level 2" },
               { id: 'level_3', display_text: "level 3" },
               { id: 'level_4', display_text: "level 4" },
               { id: 'ss1', display_text: "SS1" },
               { id: 'ss2', display_text: "SS2" },
               { id: 'ss3', display_text: "SS3" },
               { id: 'tailoring', display_text: "Tailoring" },
               { id: 'woodwork', display_text: "Woodwork" },
               { id: 'hairdressing', display_text: "Hairdressing" }
             ].map(&:with_indifferent_access)
           }),
  Field.new({"name" => "activities_training_start_date",
             "type" => "date_field",
             "display_name_en" => "Start Date of Training"
           }),
  Field.new({"name" => "activities_training_duration",
             "type" => "text_field",
             "display_name_en" => "Duration of Training"
           }),
  Field.new({"name" => "activities_notes",
             "type" => "textarea",
             "display_name_en" => "Other details about school or training"
           }),
  Field.new({"name" => "activities_other",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "What other activities is the child involved in?",
             "option_strings_text_en" => [
                { id: 'community_activities', display_text: "Community Activities" },
                { id: 'livelihood_activities', display_text: "Livelihood Activities" },
                { id: 'recreational_activities', display_text: "Recreational Activities" }
              ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "activities_other_notes",
             "type" => "textarea",
             "display_name_en" => "Other details about additional activities"
           })
]

activities = FormSection.create_or_update!({
  unique_id: "activities",
  parent_form: "case",
  visible: true,
  order_form_group: 110,
  fields: activities_fields,
  order: 40,
  order_subform: 0,
  form_group_id: "services_follow_up",
  editable: true,
  name_en: "Activities",
  description_en: "Activities"
})
