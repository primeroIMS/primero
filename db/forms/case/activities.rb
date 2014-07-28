activities_fields = [
  Field.new({"name" => "activities_child_in_school_or_training",
             "type" => "radio_button",
             "display_name_all" => "Is the Child in school or training?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "activities_school_name",
             "type" => "text_field",
             "display_name_all" => "Name of School"
            }),
  Field.new({"name" => "activities_reason_not_in_school",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If not, why not?",
             "option_strings_text_all" =>
                                  ["Child Labour",
                                   "Early Marriage", 
                                   "Financial Constraints", 
                                   "Ignorance",
                                   "Lack of Infrastructure", 
                                   "Lack of Access", 
                                   "Lack of interest", 
                                   "Children", 
                                   "Pregnancy/Child",
                                   "Sent abroad for job", 
                                   "Other"].join("\n")
            }),
  Field.new({"name" => "activities_education_type",
             "type" => "select_box",
             "display_name_all" => "If yes, what type of education?",
             "option_strings_text_all" =>
                                  ["Accelerated learning", 
                                   "Early Childhood",
                                   "Non-Formal Education", 
                                   "Primary", 
                                   "Secondary",
                                   "Vocational", 
                                   "Vocational training"].join("\n")
            }),
  Field.new({"name" => "activities_level_achieved",
             "type" => "select_box",
             "display_name_all" => "If relevant, what level have they achieved?",
             "option_strings_text_all" =>
                                    ["Carpentry", 
                                     "GS1", 
                                     "GS2", 
                                     "GS3",
                                     "level 1", 
                                     "level 2", 
                                     "level 3", 
                                     "level 4", 
                                     "SS1",
                                     "SS2", 
                                     "SS3", 
                                     "Tailoring", 
                                     "Woodwork",
                                     "Hairdressing"].join("\n")
           }),
  Field.new({"name" => "activities_training_start_date",
             "type" => "date_field",
             "display_name_all" => "Start Date of Training"
           }),
  Field.new({"name" => "activities_training_duration",
             "type" => "numeric_field",
             "display_name_all" => "Duration of Training"
           }),
  Field.new({"name" => "activities_notes",
             "type" => "textarea",
             "display_name_all" => "Other details about school or training"
           }),
  Field.new({"name" => "activities_other",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What other activities is the child involved in?",
             "option_strings_text_all" =>
                                  ["Community activities", 
                                   "Livelihood activities", 
                                   "Recreational Activities"].join("\n")
            }),
  Field.new({"name" => "activities_other_notes",
             "type" => "textarea",
             "display_name_all" => "Other details about additional activities"
           })
]

FormSection.create_or_update_form_section({
  :unique_id => "activities",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Services / Follow Up",
  "editable" => true,
  :fields => activities_fields,
  :perm_enabled => true,
  "name_all" => "Activities",
  "description_all" => "Activities"
})
