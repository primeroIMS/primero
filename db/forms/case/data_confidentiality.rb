consent_fields = [
  Field.new({"name" => "interview_subject",
             "type" => "select_box",
             "display_name_all" => "Consent Obtained From",
             "option_strings_text_all" => 
                          ["Child",
                           "Caregiver",
                           "GBV Survivor",
                           "Other (specify)"].join("\n")
              }),
  Field.new({"name" => "understanding_consent",
             "type" => "select_box",
             "display_name_all" => "Does the child/person understand why the information is collected, how it will be used, what the process will be, and agrees to register?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "disclosure_other_orgs",
             "type" => "select_box",
             "display_name_all" => "Does Child/Caregiver agree to share collected information with other organizations?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "tracing_info",
             "type" => "select_box",
             "display_name_all" => "Disclose child's information for tracing?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "disclosure_public_name",
             "type" => "select_box",
             "display_name_all" => "Does Child/Caregiver agree to share name on posters/radio/Internet?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "interview_subject_details",
             "type" => "text_field",
             "display_name_all" => "If other, please specify",
            }),
  Field.new({"name" => "consent_reporting",
             "type" => "select_box",
             "display_name_all" => "Authorization to share non-identifiable information for reporting",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "interview_date",
             "type" => "text_field",
             "display_name_all" => "Date",
            }),
  Field.new({"name" => "disclosure_public_photo",
             "type" => "select_box",
             "display_name_all" => "Photo?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "disclosure_public_relatives",
             "type" => "select_box",
             "display_name_all" => "Names of Relatives?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "disclosure_authorities",
             "type" => "select_box",
             "display_name_all" => "The authorities?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_health",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Health/Medical Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_safehouse",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Safe House/Shelter",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_legal",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Legal Assistance Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_protection",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Protection Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_livelihoods",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information Livelihoods Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_other",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Other Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_service_provider",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Security Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_service_psychosocial",
             "type" => "select_box",
             "display_name_all" => "Consent to Release Information to Psychosocial Services",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "consent_to_share_info_by_other_details",
             "type" => "text_field",
             "display_name_all" => "If other services, please specify"
            }),
  Field.new({"name" => "disclosure_deny_details",
             "type" => "textarea",
             "display_name_all" => "If child does not agree, specify what cannot be shared and why"
            }),
  Field.new({"name" => "withholding_info_1",
             "type" => "text_field",
             "display_name_all" => "If withholding a part of information from family members, please specify which part"
            }),
  Field.new({"name" => "withholding_info_2",
             "type" => "text_field",
             "display_name_all" => "If withholding a part of information from government body, please specify which part"
            }),
  Field.new({"name" => "withholding_info_3",
             "type" => "text_field",
             "display_name_all" => "If withholding a part of information from non-state actor, please specify which part"
            }),
  Field.new({"name" => "withholding_info_reason",
             "type" => "select_box",
             "display_name_all" => "Reason for withholding information",
             "option_strings_text_all" =>
                          ["Child wants to communicate information to family themselves",
                           "Fear of harm to themselves or others"].join("\n")
            }),
  Field.new({"name" => "sender_agency",
             "type" => "select_box",
             "display_name_all" => "Sender Agency",
             "option_strings_text_all" => "GTZ\nIRC\nSCUK\nUNICEF",
            }),
  #TODO Revisit this should display a select box with the user of the network.
  Field.new({"name" => "sender_agency_social_worker",
             "type" => "text_field",
             "display_name_all" => "Social Worker",
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"consent",
  :parent_form=>"case",
  "visible" => true,
  :order => 2,
  "editable" => true,
  :fields => consent_fields,
  :perm_enabled => true,
  "name_all" => "Data Confidentiality",
  "description_all" => "Data Confidentiality"
})