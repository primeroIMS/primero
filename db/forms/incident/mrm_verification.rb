MRM_VERIFICATION_FIELDS = [
  Field.new({"name" => "verification_section",
           "type" => "separator",
           "display_name_all" => "Verification"
          }),
  Field.new({"name" => "verifier_id_code",
           "type" => "text_field",
           "display_name_all" => "Focal point for verification",
           "help_text_all" => "This can be either CTFMR co-chair at the technical level."
          }),
  Field.new({"name" => "verification_source_primary_number",
           "type" => "numeric_field",
           "display_name_all" => "Number of primary sources used for verification purposes",
           "help_text_all" => "Please refer to 'Source(s)' form for guidance."
          }),
  Field.new({"name" => "verification_source_secondary_number",
           "type" => "numeric_field",
           "display_name_all" => "Number of secondary sources used for verification purposes"
          }),
  Field.new({"name" => "un_eyewitness",
           "type" => "radio_button",
           "display_name_all" => "Do primary or secondary sources include UN staff, CTFMR members or other MRM-trained partners?",
           "option_strings_text_all" => "Yes\nNo"
          }),
  Field.new({"name" => "verified",
             "type" => "select_box",
             "display_name_all" => "Initial verification status as determined by the focal point",
             "option_strings_source" => "lookup VerificationStatus"
            }),
  Field.new({"name" => "verification_date_focal_point",
             "type" => "date_field",
             "display_name_all" => "Date of determination of verification status by focal point."
            }),
  Field.new({"name" => "verified_ctfmr_technical",
             "type" => "select_box",
             "display_name_all" => "Verification status as agreed by the CTFMR co-chairs at the technical level.",
             "option_strings_source" => "lookup VerificationStatus"
            }),
  Field.new({"name" => "verification_date_ctfmr_technical",
             "type" => "date_field",
             "display_name_all" => "Date of joint verification decision by the CTFMR co-chairs at the technical level.",
             "help_text_all" => "This can be e.g., the date of the periodic meeting during which the CTFMR co-chairs at "\
                                "the technical level jointly review the incidents of grave violations and determine their "\
                                "verification status."
            }),
  Field.new({"name" => "ctfmr_verified",
             "type" => "select_box",
             "display_name_all" => "Verification status as agreed by the CTFMR",
             "option_strings_source" => "lookup VerificationStatus",
             "help_text_all" => "Please provide further details in the 'Additional details on verification process/decision' box."\
                                "This field is required for reporting."
            }),
  Field.new({"name" => "verification_additional",
           "type" => "textarea",
           "display_name_all" => "Additional details on verification process/decision",
           "help_text_all" => "If verification is still pending or incident was excluded, please provide further details."
          })
]


