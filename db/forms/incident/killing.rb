killing_subform_fields = [
  Field.new({"name" => "violation_id",
             "type" => "hidden_field",
             "display_name_all" => "Violation ID"
            }),
  Field.new({"name" => "violation_killing_boys",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: boys"
            }),
  Field.new({"name" => "violation_killing_girls",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: girls"
            }),
  Field.new({"name" => "violation_killing_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: unknown"
            }),
  Field.new({"name" => "violation_killing_total",
             "type" => "numeric_field",
             "display_name_all" => "Number of total victims"
            }),
  Field.new({"name" => "kill_method",
             "type" => "select_box",
             "display_name_all" => "Method",
             "option_strings_text_all" =>
                                    ["Victim Activated",
                                     "Non-Victim Activated",
                                     "Summary"].join("\n")
            }),
  Field.new({"name" => "kill_cause_of_death",
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
                                     "Cruel and Inhumane Treatment",
                                     "Summary and Arbitrary Execution/ Extra Judicial Killing"].join("\n")
            }),
Field.new({"name" => "kill_cause_of_details",
             "type" => "text_field",
             "display_name_all" => "Details"
            }),
  Field.new({"name" => "circumstances_of_killing",
             "type" => "select_box",
             "display_name_all" => "Circumstances",
             "option_strings_text_all" =>
                                    ["Direct Attack",
                                     "Indiscriminate Attack",
                                     "Willful Killing etc...",
                                     "Impossible to Determine"].join("\n")
            }),
  Field.new({"name" => "consequences_of_killing",
             "type" => "select_box",
             "display_name_all" => "Consequences",
             "option_strings_text_all" =>
                                    ["Killing",
                                     "Permanent Disability",
                                     "Serious Injury",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "context_of_killing",
             "type" => "select_box",
             "display_name_all" => "Context",
             "option_strings_text_all" =>
                                    ["Weapon Used By The Child",
                                     "Weapon Used Against The Child"].join("\n")
            }),
  Field.new({"name" => "mine_incident_yes_no",
             "type" => "radio_button",
             "display_name_all" => "Mine Incident",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "kill_participant",
             "type" => "select_box",
             "display_name_all" => "Was the victim directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" =>
                                    ["Yes",
                                     "No",
                                     "Unknown"].join("\n")
            }),
  Field.new({"name" => "kill_abduction",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of abduction?",
             "option_strings_text_all" =>
                                    ["Yes",
                                     "No",
                                     "Unknown"].join("\n")
            })
]

killing_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 1,
  :unique_id => "killing",
  :parent_form=>"incident",
  "editable" => true,
  :fields => killing_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Killing Subform",
  "description_all" => "Nested Killing Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["kill_cause_of_death"]
})

killing_fields = [
  Field.new({"name" => "killing",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.id,
             "display_name_all" => "Killing"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "killing_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => killing_fields,
  :perm_enabled => true,
  "name_all" => "Killing",
  "description_all" => "Killing"
})