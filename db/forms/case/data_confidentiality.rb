consent_fields = [
  Field.new({"name" => "interview_subject",
             "type" => "select_box",
             "display_name_all" => "Consent Obtained From",
             "option_strings_text_all" => 
                          ["Individual",
                           "Caregiver",
                           "Other (please specify)"].join("\n")
            }),
  Field.new({"name" => "consent_source_other",
             "type" => "text_field",
             "display_name_all" => "If Other, please specify"
            }),
  Field.new({"name" => "consent_for_services",
             "type" => "radio_button",
             "display_name_all" => "Consent has been obtained for the child to receive services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_reporting",
           "type" => "radio_button",
           "display_name_all" => "Consent is given share non-identifiable information for reporting",
           "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_for_tracing",
           "type" => "radio_button",
           "display_name_all" => "Consent has been obtained to disclose information for tracing purposes",
           "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_share_separator",
             "type" => "separator",
             "display_name_all" => "Consent for Sharing Information",
            }),
  Field.new({"name" => "consent_info_sharing",
             "type" => "select_box",
             "display_name_all" => "Consent has been given to share the information collected with",
             "multi_select" => true,
             "option_strings_text_all" => 
                          ["Family",
                           "Authorities",
                           "UNHCR",
                           "Other Organizations",
                           "Others, please specify"].join("\n")
            }),
  Field.new({"name" => "consent_info_sharing_others",
             "type" => "text_field",
             "display_name_all" => "If information can be shared with others, please specify who"
            }),
  Field.new({"name" => "disclosure_deny_details",
             "type" => "text_field",
             "display_name_all" => "What information should be withheld from a particular person or individual"
            }),
  Field.new({"name" => "withholding_info_reason",
             "type" => "select_box",
             "display_name_all" => "Reason for withholding information",
             "multi_select" => true,
             "option_strings_text_all" => 
                          ["Fear of harm to themselves or others",
                           "Want to communicate information themselves",
                           "Other reason, please specify"].join("\n")
            }),
  Field.new({"name" => "withholding_info_other_reason",
           "type" => "text_field",
           "display_name_all" => "If other reason for withholding information, please specify"
            }),
  Field.new({"name" => "consent_release_separator",
             "type" => "separator",
             "display_name_all" => "Consent to Release Information by Referral Type",
            }),
  Field.new({"name" => "consent_to_share_info_by_security",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Security Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_psychosocial",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Psychosocial Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_health",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Health/Medical Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_safehouse",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Safe House/Shelter",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_legal",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Legal Assistance Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_protection",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Protection Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_livelihoods",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information Livelihoods Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_other",
             "type" => "radio_button",
             "display_name_all" => "Consent to Release Information to Other Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_other_details",
             "type" => "text_field",
             "display_name_all" => "If other services, please specify"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"consent",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Data Confidentiality",
  "editable" => true,
  :fields => consent_fields,
  "name_all" => "Data Confidentiality",
  "description_all" => "Data Confidentiality"
})