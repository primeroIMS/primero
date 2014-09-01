survivor_assessment_fields = [
  Field.new({"name" => "assessment_emotional_state_start",
             "type" => "textarea",
             "display_name_all" => "Survivor Context"
             }),
  Field.new({"name" => "assessment_emotional_state_end",
             "type" => "textarea",
             "display_name_all" => "Assessement of Presenting Problem"
             }),
  Field.new({"name" => "assessment_survivor_safety",
             "type" => "textarea",
             "display_name_all" => "Assessement of Immediate Need"
             }),
  Field.new({"name" => "assessment_support_sources",
             "type" => "radio_button",
             "display_name_all" => "Will the survivor be in immediate danger when she leaves here?",
             "option_strings_text_all" => "Yes\nNo"
             }),
  Field.new({"name" => "assessment_safety_action",
             "type" => "textarea",
             "display_name_all" => "Explain"
             }),
  Field.new({"name" => "assessment_other_info",
             "type" => "select_box",
             "display_name_all" => "How safe does the survivor feel at home?",
             "option_strings_text_all" => ["Very safe",
                  "Somewhat safe",
                  "Neither safe nor unsafe",
                  "Somewhat unsafe",
                  "Not safe at all"].join("\n")
             }),
  Field.new({"name" => "assessment_safety_response",
             "type" => "select_box",
             "display_name_all" => "Describe the survivor’s emotional state",
             "option_strings_text_all" => ["Everything is good and fine",
                  "Things are so bad that they want to die or hurt themselves"]
             })
]

FormSection.create_or_update_form_section({
  :unique_id => "survivor_assessment_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 40,
  :order_subgroup => 0,
  :form_group_name => "Survivor Assessment",
  "editable" => true,
  :fields => survivor_assessment_fields,
  :perm_enabled => true,
  "name_all" => "Survivor Assessment",
  "description_all" => "Survivor Assessment"
})