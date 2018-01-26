require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

maiming_subform_fields = [
  Field.new({"name" => "violation_tally",
            "type" => "tally_field",
            "display_name_all" => "Number of victims",
            "autosum_group" => "maiming_number_of_survivors",
            "tally_all" => ['boys', 'girls', 'unknown'],
            "autosum_total" => true,
            "help_text_all" => "This field is required for reporting."
            }),
  Field.new({"name" => "context_km",
              "type" => "select_box",
              "display_name_all" => "Context",
              "option_strings_text_all" => [
                "Military clashes",
                "ERW",
                "Political violence",
                "Arrest/search operations",
                "Single murder",
                "Result of torture",
                "Cruel or inhumane treatment"
              ].join("\n")
            }),
  Field.new({"name" => "attack_type",
              "type" => "select_box",
              "display_name_all" => "Type of attack",
              "option_strings_source" => "lookup AttackType"
            }),
  Field.new({"name" => "attack_typeattack_type_other",
              "type" => "text_field",
              "display_name_all" => "If ‘Other', please provide details "
            }),
  Field.new({"name" => "weapon_type",
             "type" => "select_box",
             "display_name_all" => "Type of weapon/method used",
             "option_strings_source" => "lookup WeaponType",
             "guiding_questions" => "For further guidance, please refer to UNMAS 'Glossary of mine action terms, "\
                                    "definitions and abbreviations', available at: "\
                                    "http://www.mineactionstandards.org/fileadmin/MAS/documents/imas-international-standards/english/series 04/IMAS_04.10_Glossary_of_mine_action_terms__definitions_and_abbreviations.pdf; "\
                                    "to the UN Coordinating Action on Small Arms (CASA) 'Glossary of terms, definitions "\
                                    "and abbreviations', available at: http://www.smallarmsstandards.org/isacs/0120-en.pdf; "\
                                    "and to UNIDIR 'Addressing Improvised Explosive Devices' paper, pp. 14-15 "\
                                    "available at: http://www.unidir.org/files/publications/pdfs/-en-641.pdf."
            }),
  Field.new({"name" => "weapon_type_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other weapon', please specify"
            }),
  Field.new({"name" => "consequences",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Consequences",
             "option_strings_text_all" => ["Permanent disability", "Serious injury", "Other" ].join("\n")
            }),
  Field.new({"name" => "consequences_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details  "
            }),
  Field.new({"name" => "victim_targeted",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) directly targeted?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "victim_a_participant",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) participating in hostilities at the time of the violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "indiscriminate_nature",
             "type" => "select_box",
             "display_name_all" => "Any elements pointing to the indiscriminate nature of the attack?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n"),
             "guiding_questions" => "Indiscriminate attacks are those of a nature to "\
                                    "strike military objectives and civilians or civilian "\
                                    "objects without distinction. e.g. mass bombing, shooting "\
                                    "into a crowd because the enemy is hidden somewhere, use "\
                                    "of certain weapons (chemical and biological, cluster munitions, "\
                                    "barrel bombs, etc.)"
            }),
  Field.new({"name" => "indiscriminate_nature_yes",
             "type" => "text_field",
             "display_name_all" => "If 'Yes', please specify "
            }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  #NOTE: The following is a multi-select, but made it violation instead of violations so as not to conflict with reload violations JS
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If 'Yes', please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "maiming_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details",
             "help_text_all" => "E.g. was/were the victim(s) tortured/ill-treated?"
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
  "collapsed_fields" => ["weapon_type"]
})

maiming_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "maiming_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "For MRM purposes, 'maiming' is defined as any action that causes a serious, or "\
                                    "permanent, or disabling injury, scarring or mutilation to a child (see MRM Field "\
                                    "Manual, p. 9 and Annex 4: Q & A Guidance on Security Council Resolution 1882, pp. 5-6)."
            }),
  ##Subform##
  Field.new({"name" => "maiming",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming of Children",
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
  "name_all" => "Maiming of Children",
  "description_all" => "Maiming of Children"
})
