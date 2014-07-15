maiming_fields = [
  Field.new({"name" => "violation_maiming_boys",
             "type" => "numeric_field", 
             "display_name_all" => "Number of Victims Boys"
            }),
  Field.new({"name" => "violation_maiming_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of Victims Girls"
            }),
  Field.new({"name" => "violation_maiming_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of Victims Unknown"
            }),
  Field.new({"name" => "violation_maiming_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of Victims Total"
            }),
  Field.new({"name" => "maim_method",
             "type" => "select_box",
             "display_name_all" => "Method of maiming",
             "option_strings_text_all" =>
                                    ["Victim Activated",
                                     "Non-Victim Activated",
                                     "Summary"].join("\n")
            }),
  Field.new({"name" => "maim_means",
             "type" => "select_box",
             "display_name_all" => "Means of maiming",
             "option_strings_text_all" =>
                                    ["Option 1",
                                     "Option 2",
                                     "Option 3"].join("\n")
            }),
  Field.new({"name" => "circumstances_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Circumstances of maiming",
             "option_strings_text_all" =>
                                    ["Direct Attack",
                                     "Indiscriminate Attack",
                                     "Willful Killing etc...",
                                     "Impossible to Determine"].join("\n")
            }),
  Field.new({"name" => "consequences_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Consequences of maiming",
             "option_strings_text_all" =>
                                    ["Killing",
                                     "Permanent Disability",
                                     "Serious Injury",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "context_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Context of maiming",
             "option_strings_text_all" =>
                                    ["Weapon Used By The Child",
                                     "Weapon Used Against The Child"].join("\n")
            }),
  Field.new({"name" => "mine_incident",
             "type" => "radio_button",
             "display_name_all" => "Mine Incident",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "maim_participant",
             "type" => "radio_button",
             "display_name_all" => "Was the victim/survivor directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "maim_abduction",
             "type" => "radio_button",
             "display_name_all" => "Did the killing/maiming occur during or as a direct result of abduction?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "maiming",
  :parent_form=>"incident",
  "visible" => true,
  :order => 40,
  "editable" => true,
  :fields => maiming_fields,
  :perm_enabled => true,
  "name_all" => "Maiming",
  "description_all" => "Maiming"
})
