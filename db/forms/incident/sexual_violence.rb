sexual_violence_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
       "autosum_group" => "sexual_violence_number_of_survivors",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "sexual_violence_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of Violence",
             "option_strings_text_all" => [
                { id: 'rape', display_text: "Rape" },
                { id: 'sexual_assault', display_text: "Sexual Assault" },
                { id: 'forced_marriage', display_text:"Forced Marriage" },
                { id: 'mutilation', display_text:"Mutilation" },
                { id: 'force_sterilization', display_text:"Forced Sterilization" },
                { id: 'other', display_text:"Other" }
              ]
            }),
  Field.new({"name" => "displacement_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Stage of displacement at time of incident",
             "option_strings_text_all" =>
                                    ["Not Displaced/Home Country",
                                     "Pre-displacement",
                                     "During Flight",
                                     "During Refuge",
                                     "During Return/Transit",
                                     "Post-Displacement"].join("\n")
            }),
  Field.new({"name" => "abduction_status_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Type of abduction at time of the incident",
             "option_strings_text_all" =>
                                    ["None",
                                     "Forced Conscription",
                                     "Trafficked",
                                     "Other Abduction/Kidnapping"].join("\n")
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
  Field.new({"name" => "ctfmr_verified",
             "type" => "radio_button",
             "display_name_all" => "Verified by CTFMR",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_date_ctfmr",
             "type" => "date_field",
             "display_name_all" => "Date verified by CTFMR"
            })
]

sexual_violence_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "sexual_violence",
  :parent_form=>"incident",
  "editable" => true,
  :fields => sexual_violence_subform_fields,
  "name_all" => "Nested Sexual Violence Subform",
  "description_all" => "Nested Sexual Violence Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["sexual_violence_type"]
})

sexual_violence_fields = [
  Field.new({"name" => "sexual_violence",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.unique_id,
             "display_name_all" => "Sexual Violence"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "sexual_violence_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => sexual_violence_fields,
  "name_all" => "Sexual Violence",
  "description_all" => "Sexual Violence"
})
