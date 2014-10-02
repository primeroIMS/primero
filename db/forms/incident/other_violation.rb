other_violation_section_fields = [
  Field.new({"name" => "violation_other_type",
             "type" => "select_box",
             "display_name_all" => "Other Violation Type",
             "option_strings_text_all" =>
                                    ["Forced Displacement",
                                     "Denial of Civil Rights",
                                     "Use of Children for Propaganda",
                                     "Access Violations"].join("\n")
            }),
  Field.new({"name" => "violation_other_description",
             "type" => "textarea",
             "display_name_all" => "Other Violation Description"
            }),
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of survivors",
         "autosum_group" => "other_violation_number_of_survivors",
         "tally" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
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
             "option_strings_source" => "lookup VerificationStatus"
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
             "type" => "textarea",
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

other_violation_subform_section = FormSection.create_or_update_form_section({
  :unique_id => "other_violation",
  :parent_form=>"incident",
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 90,
  :order_subform => 1,
  "editable" => true,
  :fields => other_violation_section_fields,
  "name_all" => "Nested Other Violations",
  "description_all" => "Other Violations Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["violation_other_type"]
})

other_violation_fields = [
  ##Subform##
  Field.new({"name" => "other_violation",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => other_violation_subform_section.unique_id,
             "display_name_all" => "Other Violations"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "other_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 90,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => other_violation_fields,
  "name_all" => "Other Violation",
  "description_all" => "Other Violation"
})
