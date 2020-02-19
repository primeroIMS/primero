consent_fields = [
  Field.new({"name" => "interview_subject",
             "type" => "select_box",
             "display_name_en" => "Consent Obtained From",
             "option_strings_text_en" => [
               { id: 'individual', display_text: "Individual" },
               { id: 'caregiver', display_text: "Caregiver" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "consent_source_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "consent_for_services",
             "type" => "tick_box",
             "tick_box_label_en" => "Yes",
             "display_name_en" => "Consent has been obtained for the child to receive case management services",
             "help_text" => "This includes consent for sharing information with other organizations providing services"
            }),
  Field.new({"name" => "consent_reporting",
             "type" => "radio_button",
             "display_name_en" => "Consent is given share non-identifiable information for reporting",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "consent_for_tracing",
             "type" => "radio_button",
             "display_name_en" => "Consent has been obtained to disclose information for tracing purposes",
             "option_strings_source" => "lookup lookup-yes-no",
             "help_text" => "If this field is 'No', the child's case record will not show up in Matches with Inquirer Tracing Requests."
            }),
  Field.new({"name" => "disclosure_other_orgs",
             "type" => "tick_box",
             "tick_box_label_en" => "Yes",
             "display_name_en" => "The individual providing consent agrees to share collected information with other "\
                                   "organizations for service provision?",
             "help_text" => "This includes sharing information with other oranizations providing services, this does not "\
                            "include sharing information with UNHCR."
            }),
  Field.new({"name" => "unhcr_export_opt_out",
             "type" => "radio_button",
             "display_name_en" => "Has the child stated that he/she does not want to share personal details with UNHCR?",
             "option_strings_source" => "lookup lookup-yes-no",
             "help_text" => "If the child does not want to share information with UNHCR, select 'Yes' to this question "\
                            "(the child's personal details will not be included in the UNHCR export if this is set to 'Yes)."
            }),
  Field.new({"name" => "consent_share_separator",
             "type" => "separator",
             "display_name_en" => "Consent Details for Sharing Information",
            }),
  Field.new({"name" => "consent_info_sharing",
             "type" => "select_box",
             "display_name_en" => "Consent has been given to share the information collected with",
             "multi_select" => true,
             "visible" => false,
             "option_strings_text_en" => [
                { id: 'family', display_text: "Family" }.with_indifferent_access,
                { id: 'authorities', display_text: "Authorities" }.with_indifferent_access,
                { id: 'unhcr', display_text: "UNHCR" }.with_indifferent_access,
                { id: 'other_organizations', display_text: "Other Organizations" }.with_indifferent_access,
                { id: 'others', display_text: "Others, please specify" }.with_indifferent_access
              ]
            }),
  Field.new({"name" => "consent_info_sharing_others",
             "type" => "text_field",
             "display_name_en" => "If information can be shared with others, please specify who",
             "visible" => false
            }),
  Field.new({"name" => "disclosure_deny_details",
             "type" => "text_field",
             "display_name_en" => "What information should be withheld from a particular person or individual"
            }),
  Field.new({"name" => "withholding_info_reason",
             "type" => "select_box",
             "display_name_en" => "Reason for withholding information",
             "multi_select" => true,
             "option_strings_text_en" => [
                { id: 'fear', display_text: "Fear of harm to themselves or others" }.with_indifferent_access,
                { id: 'communicate_information', display_text: "Want to communicate information themselves" }.with_indifferent_access,
                { id: 'others', display_text: "Other" }.with_indifferent_access
              ]
            }),
  Field.new({"name" => "withholding_info_other_reason",
           "type" => "text_field",
           "display_name_en" => "If other reason for withholding information, please specify"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"consent",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 0,
  :form_group_id => "data_confidentiality",
  "editable" => true,
  :fields => consent_fields,
  "name_en" => "Data Confidentiality",
  "description_en" => "Data Confidentiality",
  :mobile_form => true
})
