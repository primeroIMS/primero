recruitment_subform_fields = [
  Field.new({"name" => "violation_recruit_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
       "autosum_group" => "recruitment_number_of_survivors",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
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
            }),
  # Verification fields
  Field.new({"name" => "verification_section",
             "type" => "separator",
             "display_name_all" => "Verification"
            }),
  Field.new({"name" => "verifier_id_code",
             "type" => "text_field",
             "display_name_all" => "Verifier"
            }),
  Field.new({"name" => "verification_decision_date",
             "type" => "date_field",
             "display_name_all" => "Verification Decision Date"
            }),
  Field.new({"name" => "verified",
             "type" => "select_box",
             "display_name_all" => "Verification Status",
             "option_strings_text_all" =>
                                    ["Verified",
                                     "Unverified",
                                     "Pending",
                                     "Falsely Attributed",
                                     "Rejected"].join("\n")
            }),
  Field.new({"name" => "verification_source_weight",
             "type" => "select_box",
             "display_name_all" => "Has the information been received from a primary and reliable source?",
             "option_strings_text_all" =>
                                    ["Yes, from a credible Primary Source who witnessed the incident",
                                     "Yes, from a credible Primary Source who did not witness the incident",
                                     "No, but there is sufficient supporting documentation of the incident",
                                     "No, all the information is from a Secondary Source(s)",
                                     "No, the Primary Source information is deemed insufficient or not credible"].join("\n")
            }),
  Field.new({"name" => "un_eyewitness",
             "type" => "radio_button",
             "display_name_all" => "Was the incident witnessed by UN staff or other MRM-trained affiliates?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_info_consistent",
             "type" => "radio_button",
             "display_name_all" => "Is the information consistent across various independent sources?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_info_credibility",
             "type" => "radio_button",
             "display_name_all" => "Has the veracity of the allegations been deemed credible using reasonable and sound judgement of trained and reliable monitors?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "reason_non_verification",
             "type" => "select_box",
             "display_name_all" => "If not verified, why?",
             "option_strings_text_all" =>
                                    ["Unwilling Sources",
                                     "Security Constraints",
                                     "Resource Constraints",
                                     "Contradictory Information",
                                     "Pending Further Monitoring",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "verification_decision_description",
             "type" => "text_field",
             "display_name_all" => "Notes on Verification Decision"
            }),
  Field.new({"name" => "CTFMR_verified",
             "type" => "radio_button",
             "display_name_all" => "Verified by CTFMR",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_date_CTFMR",
             "type" => "date_field",
             "display_name_all" => "Date verified by CTFMR"
            })
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
  :fields => recruitment_subform_fields,
  "name_all" => "Nested Recruitment Subform",
  "description_all" => "Nested Recruitment Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["factors_of_recruitment"]
})

recruitment_fields = [
  Field.new({"name" => "recruitment",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.unique_id,
             "display_name_all" => "Recruitment"
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
  "name_all" => "Recruitment",
  "description_all" => "Recruitment"
})
