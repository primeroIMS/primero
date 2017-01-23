require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

recruitment_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "recruitment_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
       "help_text_all" => "This field is required for reporting."
      }),
  Field.new({"name" => "factors_of_recruitment",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What factors contributed to the recruitment and/or use of the child(ren) by the armed force/group?",
             "option_strings_text_all" => ["Abduction", "Conscription", "Family/community pressure", "Family problems/abuse",
                                           "Financial reasons", "Idealism", "Intimidation", "Lack of basic services",
                                           "Security concerns", "To join/follow friends", "To seek revenge", "Unknown", "Other"].join("\n")
             }),
  Field.new({"name" => "factors_of_recruitment_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details"
            }),
  Field.new({"name" => "re_recruitment",
             "type" => "select_box",
             "display_name_all" => "Was this a case of re-recruitment (by either the same or a different armed force/group)?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "re_recruitment_details",
             "type" => "textarea",
             "display_name_all" => "If yes, please provide details:",
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
  Field.new({"name" => "recruitment_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "child_role_association_status",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) recruited and/or used while deprived of liberty due to alleged "\
                                   "association with armed forces/armed groups?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n"),
             "help_text_all" => "This should be reflected as necessary in the 'Killing', 'Maiming' and/or 'Rape and/or "\
                                "other grave sexual violence' forms as appropriate."
            }),
  Field.new({"name" => "child_role_association",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If so, please select the the facilty where the victims(s) was/were being held when "\
                                   "the recruitment and/or use occurred",
             "option_strings_text_all" => ["Civilian infrastructure", "Informal detention facility",
                                           "Intelligence agency premises", "Juvenile detention center",
                                           "Military facility", "Prison", "Other"].join("\n")
            }),
  Field.new({"name" => "child_role_association_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details "
            }),
  Field.new({"name" => "child_role_torture",
             "type" => "select_box",
             "display_name_all" => "Was/were the child(ren) subject to torture or other cruel, inhuman or degrading "\
                                   "treatment or punishment while deprived of liberty",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n"),
             "help_text_all" => "This should be reflected as necessary in the 'Killing', 'Maiming' and/or 'Rape and/or "\
                                "other grave sexual violence' forms as appropriate."
            }),
  Field.new({"name" => "child_role",
             "type" => "select_box",
             "display_name_all" => "What role did the child(ren) play in the armed force/group?",
             "option_strings_text_all" => ["Combatant", "Non-combatant", "Unknown"].join("\n"),
             "help_text_all" => "For further guidance, please see MRM Field Manual, 2014, page 11; MRM Field Manual, Annex 1, page 63."
             }),
  Field.new({"name" => "child_role_combatant",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If the child played a combatant role, please select from the following",
             "option_strings_text_all" => ["Fighter", "Laying mines", "Intelligence gathering/Spy/Informant", "Other"].join("\n")
            }),
  Field.new({"name" => "child_role_combatant_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details  "
            }),
  Field.new({"name" => "child_role_noncombatant",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If the child played a non-combatant role, please select from the following",
             "option_strings_text_all" => ["Cook", "Human shield", "Porter", "Sexual purposes", "Other"].join("\n")
            }),
  Field.new({"name" => "child_role_noncombatant_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details   "
            }),
  Field.new({"name" => "child_owned_weapon",
             "type" => "select_box",
             "display_name_all" => "Did the child(ren) use/own a weapon?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "child_military_type_training",
             "type" => "select_box",
             "display_name_all" => "Did the child receive any military-type training?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "recruited_child_witness",
             "type" => "select_box",
             "display_name_all" => "Did the recruited child(ren) witness the recruitment/use of other children in the armed force/group?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "recruited_child_recruitment_number",
             "type" => "numeric_field",
             "display_name_all" => "If 'Yes', please provide estimate"
            }),
  Field.new({"name" => "released_indicator",
             "type" => "select_box",
             "display_name_all" => "Have some or all of the children been released or left the armed group/force?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "released_number",
             "type" => "numeric_field",
             "display_name_all" => "If 'Yes', how many? "
            }),
  Field.new({"name" => "released_number_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?",
            }),
  Field.new({"name" => "date_child_leave",
             "type" => "date_field",
             "display_name_all" => "If 'Yes', when did the children leave the armed group?"
            }),
  Field.new({"name" => "estimated_date",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is the date estimated?",
            }),
  Field.new({"name" => "how_did_child_leave_armed_group",
             "type" => "select_box",
             "display_name_all" => "If the child(ren) left the armed force/group, how did it happen?",
             "option_strings_text_all" => ["Captured", "Surrendered", "Community/family brokered",
                                           "Dissolution of armed force/group", "Informal release",
                                           "Formal release/demobilisation process"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details",
             "help_text_all" => "E.g. what factors contributed to the child(ren) leaving the armed force/group? "\
                                "(e.g. sick/injured; financial reasons; family pressure; community pressure; "\
                                "UN/NGO advocacy; Government pressure; pressure by other party to the conflict; "\
                                "discretion of armed force/armed group; political/security developments, e.g. peace process)"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

recruitment_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 1,
  :unique_id => "recruitment",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (recruitment_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Recruitment Subform",
  "description_all" => "Nested Recruitment Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["factors_of_recruitment"]
})

recruitment_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "recruitment_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.", "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "Recruitment of children: refers to compulsory, forced or voluntary conscription or "\
                                    "enlistment of children into any kind of armed force or armed group(s) under the age "\
                                    "stipulated in the international treaties applicable to the armed force or armed group "\
                                    "in question. Use of children: refers to the use of children by armed forces or armed "\
                                    "groups in any capacity, including, but not limited to, children, boys and girls, used "\
                                    "as fighters, cooks, porters, messengers, spies and collaborators. It does not only "\
                                    "refer to a child who is taking or has taken a direct part in hostilities. (see MRM "\
                                    "Field Manual, 2014, page 11)."
        }),
  ##Subform##
  Field.new({"name" => "recruitment",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.unique_id,
             "display_name_all" => "Recruitment and/or use of children",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "recruitment_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => recruitment_fields,
  "name_all" => "Recruitment and/or use of children",
  "description_all" => "Recruitment and/or use of children"
})
