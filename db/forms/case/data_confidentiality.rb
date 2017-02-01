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
  #TODO - Yes\No is brittle.  Logic in the app depends on this which makes it not i18n compliant.  Should be a tick_box instead
  Field.new({"name" => "consent_for_services",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Consent has been obtained for the child to receive services",
             "help_text" => "This includes consent for sharing information with other organizations providing services"
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
  Field.new({"name" => "disclosure_other_orgs",
           "type" => "tick_box",
           "tick_box_label_all" => "Yes",
           "display_name_all" => "The individual providing consent agrees to share collected information with other organizations?"
            }),
  Field.new({"name" => "consent_share_separator",
             "type" => "separator",
             "display_name_all" => "Consent Details for Sharing Information",
            }),
  Field.new({"name" => "consent_info_sharing",
             "type" => "select_box",
             "display_name_all" => "Consent has been given to share the information collected with",
             "multi_select" => true,
             "option_strings_text_all" => [
                { id: 'family', display_text: "Family" }.with_indifferent_access,
                { id: 'authorities', display_text: "Authorities" }.with_indifferent_access,
                { id: 'unhcr', display_text: "UNHCR" }.with_indifferent_access,
                { id: 'other_organizations', display_text: "Other Organizations" }.with_indifferent_access,
                { id: 'others', display_text: "Others, please specify" }.with_indifferent_access
              ]
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
             "option_strings_text_all" => [
                { id: 'fear', display_text: "Fear of harm to themselves or others" }.with_indifferent_access,
                { id: 'communicate_information', display_text: "Want to communicate information themselves" }.with_indifferent_access,
                { id: 'others', display_text: "Other reason, please specify" }.with_indifferent_access
              ]
            }),
  Field.new({"name" => "withholding_info_other_reason",
           "type" => "text_field",
           "display_name_all" => "If other reason for withholding information, please specify"
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
  "description_all" => "Data Confidentiality",
  :mobile_form => true
})
