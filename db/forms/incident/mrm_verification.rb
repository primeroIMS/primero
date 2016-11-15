MRM_VERIFICATION_FIELDS = [
  Field.new({"name" => "verification_section",
           "type" => "separator",
           "display_name_all" => "Verification"
          }),
  Field.new({"name" => "verifier_id_code",
           "type" => "text_field",
           "display_name_all" => "Focal point for verification"
          }),
  Field.new({"name" => "verification_decision_date",
           "type" => "date_field",
           "display_name_all" => "Verification Decision Date",
           "visible" => false
          }),
  Field.new({"name" => "verified",
           "type" => "select_box",
           "display_name_all" => "Verification Status",
           "option_strings_source" => "lookup VerificationStatus"
          }),
  Field.new({"name" => "verification_excluded_reason",
           "type" => "select_box",
           "display_name_all" => "If excluded, why?",
           "option_strings_text_all" =>
                                  ["Non MRM",
                                   "Verification found that incident did not occur"].join("\n")
          }),
  Field.new({"name" => "verification_source_primary_number",
           "type" => "numeric_field",
           "display_name_all" => "Number of primary sources"
          }),
  Field.new({"name" => "verification_clarify_roles",
           "type" => "textarea",
           "display_name_all" => "Please clarify the role(s) of the primary source(s)",
           "help_text_all" => "E.g. victim, alleged perpetrator, eyewitness, family member, medical personnel, etc."
          }), 
  Field.new({"name" => "verification_source_secondary_number",
           "type" => "numeric_field",
           "display_name_all" => "Number of secondary sources",
           "help_text_all" => "Please refer to the 'Source' section for further details."
          }),
  Field.new({"name" => "verification_source_weight",
           "type" => "select_box",
           "display_name_all" => "Has the information been received from at least one reliable primary source (victim, perpetrator or direct eyewitness)?",
           "option_strings_text_all" =>
                                  ["Yes, from a credible Primary Source who witnessed the incident",
                                   "Yes, from a credible Primary Source who did not witness the incident",
                                   "No, but there is sufficient supporting documentation of the incident",
                                   "No, all the information is from a Secondary Source(s)",
                                   "No, the Primary Source information is deemed insufficient or not credible"].join("\n"),
           "visible" => false
          }),
  Field.new({"name" => "un_eyewitness",
           "type" => "radio_button",
           "display_name_all" => "Do primary sources include UN staff, CTFMR members or other MRM-trained partners?",
           "option_strings_text_all" => "Yes\nNo\nUnknown"
          }),
  Field.new({"name" => "verification_info_consistent",
           "type" => "radio_button",
           "display_name_all" => "Is the information consistent across various independent sources?",
           "option_strings_text_all" => "Yes\nNo",
           "visible" => false
          }),
  Field.new({"name" => "verification_info_credibility",
           "type" => "radio_button",
           "display_name_all" => "Have the allegations been deemed credible based on the reasonable and sound judgement of at least one trained and reliable monitor?",
           "option_strings_text_all" => "Yes\nNo",
           "visible" => false
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
                                   "Other"].join("\n"),
           "visible" => false
          }),
  Field.new({"name" => "verification_additional",
           "type" => "textarea",
           "display_name_all" => "Additional notes on verification",
           "help_text_all" => "If verification is still pending or incident was excluded, please provide further details."
          }),
  Field.new({"name" => "verification_decision_description",
           "type" => "textarea",
           "display_name_all" => "Notes on Verification Decision",
           "visible" => false
          }),
  Field.new({"name" => "ctfmr_verified",
           "type" => "radio_button",
           "display_name_all" => "Verified by CTFMR?",
           "option_strings_text_all" => "Yes\nNo"
          }),
  Field.new({"name" => "verification_date_ctfmr",
           "type" => "date_field",
           "display_name_all" => "Date of validation by CTFMR",
           "help_text_all" => "Can be the date of CTFMR verification meeting or the date on which CTFMR co-chairs sent the Global Horizontal Note out."
          })
]