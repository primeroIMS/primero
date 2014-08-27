maiming_subform_fields = [
  Field.new({"name" => "violation_maiming_boys",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: boys",
             "autosum_group" => "maiming_number_of_survivors"
            }),
  Field.new({"name" => "violation_maiming_girls",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: girls",
             "autosum_group" => "maiming_number_of_survivors"
            }),
  Field.new({"name" => "violation_maiming_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: unknown",
             "autosum_group" => "maiming_number_of_survivors"
            }),
  Field.new({"name" => "violation_maiming_total",
             "type" => "numeric_field",
             "display_name_all" => "Number of total survivors",
             "autosum_total" => true,
             "autosum_group" => "maiming_number_of_survivors"
            }),
  Field.new({"name" => "maim_method",
             "type" => "select_box",
             "display_name_all" => "Method",
             "option_strings_text_all" =>
                                    ["Victim Activated",
                                     "Non-Victim Activated",
                                     "Summary"].join("\n")
            }),
  Field.new({"name" => "maim_cause_of",
             "type" => "select_box",
             "display_name_all" => "Cause",
             "option_strings_text_all" =>
                                    ["IED",
                                     "IED - Command Activated",
                                     "UXO/ERW",
                                     "Landmines",
                                     "Cluster Munitions",
                                     "Shooting",
                                     "Artillery - Shelling/Mortar Fire",
                                     "Artillery - Cluster Munitions",
                                     "Aerial Bombardment",
                                     "White Weapon Use",
                                     "Gas",
                                     "Suicide Attack Victim",
                                     "Perpetrator of Suicide Attack",
                                     "Cruel and Inhumane Treatment"].join("\n")
            }),
  Field.new({"name" => "maim_cause_of_details",
             "type" => "textarea",
             "display_name_all" => "Details"
            }),
  Field.new({"name" => "circumstances_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Circumstances",
             "option_strings_text_all" =>
                                    ["Direct Attack",
                                     "Indiscriminate Attack",
                                     "Willful Killing etc...",
                                     "Impossible to Determine"].join("\n")
            }),
  Field.new({"name" => "consequences_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Consequences",
             "option_strings_text_all" =>
                                    ["Killing",
                                     "Permanent Disability",
                                     "Serious Injury",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "context_of_maiming",
             "type" => "select_box",
             "display_name_all" => "Context",
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
             "display_name_all" => "Was the survivor directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "maim_abduction",
             "type" => "radio_button",
             "display_name_all" => "Did the violation occur during or as a direct result of abduction?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            })
]

maiming_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 20,
  :order_subform => 1,
  :unique_id => "maiming",
  :parent_form=>"incident",
  "editable" => true,
  :fields => maiming_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Maiming Subform",
  "description_all" => "Nested Maiming Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["maim_cause_of"]
})

maiming_fields = [
  Field.new({"name" => "maiming",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "maiming_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => maiming_fields,
  :perm_enabled => true,
  "name_all" => "Maiming",
  "description_all" => "Maiming"
})
