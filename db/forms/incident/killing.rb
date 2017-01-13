require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

killing_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "killing_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "weapon_type",
             "type" => "select_box",
             "display_name_all" => "Type of weapon used",
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
  Field.new({"name" => "attack_type",
             "type" => "select_box",
             "display_name_all" => "Type of attack",
             "option_strings_source" => "lookup AttackType"
            }),
  Field.new({"name" => "attack_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details "
            }),
  Field.new({"name" => "victim_targeted",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) directly targeted?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "victim_a_participant",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) directly participating in hostilities at the time of the violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "indiscriminate_nature",
             "type" => "select_box",
             "display_name_all" => "Any elements pointing to the indiscriminate nature of the attack?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
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
  Field.new({"name" => "killing_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details"
            })
]

#binding.pry

killing_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 1,
  :unique_id => "killing",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (killing_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Killing Subform",
  "description_all" => "Nested Killing Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["weapon_type"]
})

killing_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "killing_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "For MRM purposes, 'killing' is defined as any action in the context of the armed "\
                                    "conflict that results in the death of one or more children (see MRM Field Manual, "\
                                    "p. 9 and Annex 4: Q & A Guidance on Security Council Resolution 1882, p. 5)."
            }),
  ##Subform##
  Field.new({"name" => "killing",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.unique_id,
             "display_name_all" => "Killing of Children",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "killing_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => killing_fields,
  "name_all" => "Killing of Children",
  "description_all" => "Killing of Children"
})
