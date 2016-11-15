require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

maiming_subform_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of victims",
         "autosum_group" => "maiming_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "violation_method",
             "type" => "select_box",
             "display_name_all" => "Method",
             "option_strings_text_all" =>
                                    ["Victim Activated",
                                     "Non-Victim Activated",
                                     "Summary"].join("\n"),
             "visible" => false
            }),
  Field.new({"name" => "cause",
             "type" => "select_box",
             "display_name_all" => "Type of weapon",
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
  Field.new({"name" => "cause_details",
             "type" => "textarea",
             "display_name_all" => "Details",
             "visible" => false
            }),
  Field.new({"name" => "circumstances",
             "type" => "select_box",
             "display_name_all" => "Type of attack",
             "option_strings_text_all" => ["Aerial attack",
                                           "Arson",
                                           "Command-wire operated IED",
                                           "Flying IEDs",
                                           "Person-borne IED",
                                           "Remote-controlled IED",
                                           "Timer-operated IED",
                                           "Vehicle-borne IED",
                                           "Land-based attack - Laying mines",
                                           "Land-based attack - Pressure plate IED",
                                           "Occupation of building(s)",
                                           "Other shooting",
                                           "Sea-based attack",
                                           "Tactical use of building(s)",
                                           "Targeted shooting [e.g. sniper]",
                                           "Theft/Looting",
                                           "Threat/Intimidation/Harassment"].join("\n")
            }),
  Field.new({"name" => "victim_targeted",
             "type" => "radio_button",
             "display_name_all" => "Was/were the victim(s) directly targeted?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consequences",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Consequences",
             "option_strings_text_all" => [
                { id: 'killing', display_text: "Killing" },
                { id: 'permanent_disability', display_text: "Permanent Disability" },
                { id: 'serious_injury', display_text: "Serious Injury" },
                { id: 'other', display_text: "Other" }
              ]
            }),
  Field.new({"name" => "context",
             "type" => "select_box",
             "display_name_all" => "Context",
             "option_strings_text_all" =>
                                    ["Weapon Used By The Child",
                                     "Weapon Used Against The Child"].join("\n"),
             "visible" => false
            }),
  Field.new({"name" => "mine_incident",
             "type" => "radio_button",
             "display_name_all" => "Mine-related incident",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "victim_a_participant",
             "type" => "radio_button",
             "display_name_all" => "Was/were the victim(s) directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "related_to_abduction",
             "type" => "radio_button",
             "display_name_all" => "Did the violation occur during or as a direct result of abduction?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes"
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
  :fields => (maiming_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Maiming Subform",
  "description_all" => "Nested Maiming Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["cause"]
})

maiming_fields = [
  Field.new({"name" => "maiming",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "maiming_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 20,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => maiming_fields,
  "name_all" => "Maiming",
  "description_all" => "Maiming"
})
