recruitment_subform_fields = [
  Field.new({"name" => "violation_recruit_boys",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: boys"
            }),
  Field.new({"name" => "violation_recruit_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: girls"
            }),
  Field.new({"name" => "violation_recruit_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: unknown"
            }),
  Field.new({"name" => "violation_recruit_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of total survivors"
            }),
  Field.new({"name" => "forced_vs_voluntary",
             "type" => "radio_button",
             "display_name_all" => "Forced vs. Voluntary",
             "option_strings_text_all" => "Forced\nVoluntary"
            }),
  Field.new({"name" => "forced_recruitment",
             "type" => "radio_button",
             "display_name_all" => "Was the recruitment primarily \"Forced\" (e.g. Conscription, Abduction, or the use of intimidation and threats)?",
             "option_strings_text_all" => "Yes\nNo\nDon't Know"
            }),
  Field.new({"name" => "factors_of_recruitment",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What factors contributed towards the recruitment of the child by the armed group?",
             "option_strings_text_all" =>
                                    ["Abduction",
                                     "Conscription",
                                     "Intimidation",
                                     "Lack of Basic Services",
                                     "Access to Security",
                                     "Financial Reasons",
                                     "Family Problems / Abuse",
                                     "To Join / Follow Friends",
                                     "Idealism",
                                     "To Seek Revenge",
                                     "Other",
                                     "Unknown"].join("\n")
             }),
  Field.new({"name" => "re_recruitment",
             "type" => "radio_button",
             "display_name_all" => "Was this a case of re-recruitment (this does not necessarily have to be by the same armed group)?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "re_recruitment_details",
             "type" => "textarea",
             "display_name_all" => "Re-recruitment details",
            }),
  Field.new({"name" => "child_role",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What role did the child play in the armed group?",
             "option_strings_text_all" =>
                                    ["Combatant",
                                     "Non-Combatant",
                                     "Sexual Purposes",
                                     "Unknown",
                                     "Other"].join("\n")
             }),
  Field.new({"name" => "type_of_recruitment_association",
             "type" => "select_box",
             "display_name_all" => "Type of Recruitment/Association",
             "option_strings_text_all" =>
                                    ["Forced Enrollment",
                                     "Voluntary Enrollment",
                                     "Family Problems/Abuse",
                                     "Financial Problems",
                                     "Lack of Essential Services",
                                     "Lack of Essential Services (education/food/shelter/security)",
                                     "Other",
                                     "Poverty",
                                     "Wanted to fight for their beliefs",
                                     "Wanted to follow friends"].join("\n")
            }),
  Field.new({"name" => "child_authority_postition",
             "type" => "radio_button",
             "display_name_all" => "Did/does the child hold a position of authority in the armed group (e.g. Commander)?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_owned_weapon",
             "type" => "radio_button",
             "display_name_all" => "Did the child use/own a weapon?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_military_type_training",
             "type" => "radio_button",
             "display_name_all" => "Did the child receive any military-type training?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "recruited_child_witness",
             "type" => "radio_button",
             "display_name_all" => "Did the recruited child witness or was with other children in the group?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_victim_other_violations",
             "type" => "radio_button",
             "display_name_all" => "Was the child involved in any other violations?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "children_killed_raped_injured",
             "type" => "radio_button",
             "display_name_all" => "Were children killed/raped/injured within the group?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "released_indicator",
             "type" => "radio_button",
             "display_name_all" => "Have some or all of the children been released or left the armed group?",
             "option_strings_text_all" => "Yes (All)\nYes (Some)\nNone\nUnknown"
            }),
  Field.new({"name" => "released_number",
             "type" => "numeric_field", 
             "display_name_all" => "If Yes, how many were released or have left the armed group?"
            }),
  Field.new({"name" => "date_child_leave",
             "type" => "date_field", 
             "display_name_all" => "If yes, when did the children leave the armed group?"
            }),
  Field.new({"name" => "how_did_child_leave_armed_group",
             "type" => "select_box",
             "display_name_all" => "If the children left the armed group, how did it happen?",
             "option_strings_text_all" =>
                                    ["Formal release process/demobilisation process",
                                     "Community/Individually Brokered",
                                     "Dissolution of Armed Group",
                                     "Captured/Surrendered",
                                     "Ran Away/Escaped",
                                     "Killed or Died",
                                     "Other",
                                     "Unknown",
                                     "Not Applicable"].join("\n")
            }),
  Field.new({"name" => "factors_of_release",
             "type" => "select_box",
             "display_name_all" => "What factors contributed towards the children leaving the armed group?",
             "option_strings_text_all" =>
                                    ["Family Pressure",
                                     "Community Pressure",
                                     "Government Pressure",
                                     "NGO/UN Pressure",
                                     "Discretion of Armed Group",
                                     "Force (armed intervention)",
                                     "Ransom paid",
                                     "Other"].join("\n")
            })
]

recruitment_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 1,
  :unique_id => "recruitment_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => recruitment_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Recruitment Subform",
  "description_all" => "Nested Recruitment Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["factors_of_recruitment"]
})

recruitment_fields = [
  Field.new({"name" => "recruitment_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.id,
             "display_name_all" => "Recruitment"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "recruitment",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => recruitment_fields,
  :perm_enabled => true,
  "name_all" => "Recruitment",
  "description_all" => "Recruitment"
})
