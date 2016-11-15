require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

recruitment_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "recruitment_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "forced_vs_voluntary",
             "type" => "radio_button",
             "display_name_all" => "Forced vs. Voluntary",
             "visible" => false,
             "option_strings_text_all" => "Forced\nVoluntary"
            }),
  Field.new({"name" => "forced_recruitment",
             "type" => "radio_button",
             "display_name_all" => "Was the recruitment primarily forced (e.g. conscription, abduction, or use of intimidation and threats)?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "factors_of_recruitment",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What factors contributed to the recruitment of the child(ren) by the armed force/group?",
             "option_strings_text_all" => [
                { id: 'abduction', display_text: "Abduction" },
                { id: 'conscription', display_text: "Conscription" },
                { id: 'intimidation', display_text: "Intimidation" },
                { id: 'lack_of_basic_services', display_text: "Lack of basic services" },
                { id: 'access_to_security', display_text: "Access to security" },
                { id: 'financial_reasons', display_text: "Financial reasons" },
                { id: 'family_problems_abuse', display_text: "Family problems / abuse" },
                { id: 'to_join_follow_friends', display_text: "To join / follow friends" },
                { id: 'idealism', display_text: "Idealism" },
                { id: 'to_see_revenge', display_text: "To seek revenge" },
                { id: 'other', display_text: "Other" },
                { id: 'unknown', display_text: "Unknown" }
              ]
             }),
  Field.new({"name" => "re_recruitment",
             "type" => "radio_button",
             "display_name_all" => "Was this a case of re-recruitment (by either the same or a different armed force/group)?",
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
             "option_strings_text_all" => [
                { id: 'combatant', display_text: "Combatant" },
                { id: 'non-combatant', display_text:  "Non-Combatant" },
                { id: 'sexual_purposes', display_text:  "Sexual Purposes" },
                { id: 'unknown', display_text:  "Unknown" },
                { id: 'other', display_text:  "Other" }
              ]
             }),
  Field.new({"name" => "type_of_recruitment_association",
             "type" => "select_box",
             "visible" => false,
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
             "display_name_all" => "Did the child(ren) hold a position of authority in the armed group force/group (e.g. commander)?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_owned_weapon",
             "type" => "radio_button",
             "display_name_all" => "Did the child(ren) use/own a weapon?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_military_type_training",
             "type" => "radio_button",
             "display_name_all" => "Did the child receive any military-type training?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_military_indoctrination",
             "type" => "radio_button",
             "display_name_all" => "Did the child receive any form of indoctrination?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "recruited_child_witness",
             "type" => "radio_button",
             "display_name_all" => "Did the recruited child(ren) witness the recruitment/use of other children in the armed force/group?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "recruited_child_recruitment_number",
             "type" => "numeric_field",
             "display_name_all" => "If 'Yes', please provide estimate"
            }),
  Field.new({"name" => "child_victim_other_violations",
             "type" => "radio_button",
             "display_name_all" => "Was the recruitment and/or use associated with other violations?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "child_victim_other_violations_listed",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If 'Yes', select all that applicable ",
             "option_strings_text_all" => ["Killing", 
                                           "Maiming",
                                           "Rape or other grave sexual violence",
                                           "Abduction"].join("\n")
            }),
  Field.new({"name" => "children_killed_raped_injured",
             "type" => "radio_button",
             "visible" => false,
             "display_name_all" => "Were children killed/raped/injured within the group?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "released_indicator",
             "type" => "radio_button",
             "display_name_all" => "Have some or all of the children been released or left the armed group/force?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "released_number",
             "type" => "numeric_field",
             "display_name_all" => "If 'Yes', how many? "
            }),
  Field.new({"name" => "date_child_leave",
             "type" => "date_field",
             "display_name_all" => "If 'Yes', when did the children leave the armed group?"
            }),
  Field.new({"name" => "estimated_date",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is the date estimated? ",
            }),
  Field.new({"name" => "how_did_child_leave_armed_group",
             "type" => "select_box",
             "display_name_all" => "If the child(ren) left the armed force/group, how did it happen?",
             "option_strings_text_all" =>
                                    ["Captured/Surrendered",
                                     "Community/Individually brokered",
                                     "Dissolution of armed force/group",
                                     "Informal release",
                                     "Formal release/demobilisation process",
                                     "Injured",
                                     "Ran away/Escaped",
                                     "Unknown",
                                     "Not applicable"].join("\n")
            }),
  Field.new({"name" => "factors_of_release",
             "type" => "select_box",
             "display_name_all" => "What factors contributed to the children leaving the armed group?",
             "option_strings_text_all" =>
                                    ["Family Pressure",
                                     "Community Pressure",
                                     "Government Pressure",
                                     "NGO/UN Pressure",
                                     "Discretion of Armed Group",
                                     "Force (armed intervention)",
                                     "Ransom paid",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "factors_of_release_multi",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What factors contributed to the children leaving the armed force/group?",
             "option_strings_text_all" =>
                                    ["Armed intervention",
                                     "Discretion of armed force/group",
                                     "Family/Community pressure",
                                     "Financial reasons",
                                     "Political/security developments (e.g. peace process)",
                                     "Ransom paid",
                                     "Unknown",
                                     "Not applicable"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes "
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
