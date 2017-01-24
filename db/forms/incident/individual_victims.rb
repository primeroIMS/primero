individual_victims_fields = [
  Field.new({"name" => "id_number",
             "type" => "text_field",
             "display_name_all" => "Victim's ID (if applicable)",
             "help_text_all" => "ID applies to those CTFMRs which assign an ID number to each individual victim for security purposes"
            }),
  Field.new({"name" => "individual_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "individual_sex",
             "type" => "select_box",
             "display_name_all" => "Sex of the victim",
             "option_strings_text_all" => ["Female", "Male", "Unknown"].join("\n")
            }),
  Field.new({"name" => "individual_age",
             "type" => "numeric_field",
             "display_name_all" => "Victim's age",
            }),
  Field.new({"name" => "date_of_birth",
             "type" => "date_field",
             "display_name_all" => "Victim's date of birth (if known)",
             "date_validation" => "not_future_date"
            }),
  Field.new({"name" => "individual_age_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is the age estimated? ",
            }),
  Field.new({"name" => "nationality",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Nationality/ies of the victim",
             "option_strings_source" => "lookup Nationality"
            }),
  Field.new({"name" => "ethnicity",
             "type" => "select_box",
             "display_name_all" => "Ethnic affiliation of the victim",
             "option_strings_source" => "lookup Ethnicity"
            }),
  Field.new({"name" => "religion",
             "type" => "select_box",
             "display_name_all" => "Religious affiliation of the victim",
             "option_strings_source" => "lookup Religion"
            }),
  Field.new({"name" => "child_consent_follow_up",
             "type" => "radio_button",
             "display_name_all" => "Is the victim and/or adult caregiver willing to be contacted again about the violations?",
             "option_strings_text_all" => ["Yes", "No"].join("\n"),
             "help_text_all" => "E.g. on the specific CTFMR member/UN agency/NGO/partner/service provider with whom the "\
                                "victim/adult caregiver consented to share personal details"
            }),
  Field.new({"name" => "child_consent_for_reporting",
             "type" => "radio_button",
             "display_name_all" => "Does the victim consent to sharing non-personally identifiable data with the CTFMR "\
                                   "for reporting purposes?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "child_consent_data_sharing",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "With whom is the victim and/or adult caregiver willing to share the victim's name and "\
                                   "other personal details for referral purposes?",
             "option_strings_text_all" => ["UNICEF", "Other CTFMR member(s)", "CTFMR partners/service providers",
                                           "No one", "Other"].join("\n")
            }),
  Field.new({"name" => "child_consent_data_sharing_other",
             "type" => "textarea",
             "display_name_all" => "If ‘Other', please provide details",
             "help_text_all" => "E.g. on the specific CTFMR member/UN agency/NGO/partner/service provider with whom the "\
                                "victim/adult caregiver consented to share personal details"
            }),
  Field.new({"name" => "individual_vulnerabilities",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Victim's vulnerabilities",
             "option_strings_source" => "lookup VulnerabilityType"
            }),
  Field.new({"name" => "victim_disability_type",
             "type" => "select_box",
             "display_name_all" => "If the victim is a person with a disability, please clarify type of disability",
             "option_strings_text_all" => ["Mental disability", "Physical disability", "Mental and physical disability"].join("\n")
            }),
  Field.new({"name" => "individual_additional_details",
             "type" => "textarea",
             "display_name_all" => "Additional details"
            })
]

individual_victims_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 1,
  :unique_id => "individual_victims_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => individual_victims_fields,
  "name_all" => "Nested Individual victim(s) Subform",
  "description_all" => "Nested Individual victim(s) Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["individual_sex", "individual_age"]
})

FormSection.create_or_update_form_section({
  :unique_id => "individual_victims",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 50,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Individual victim(s)",
  "editable" => true,
  :fields => [Field.new({"name" => "individual_victims_subform_section",
                         "type" => "subform", "editable" => true,
                         "subform_section_id" => individual_victims_subform_section.unique_id,
                         "display_name_all" => "Individual victim"
                        })
             ],
  "name_all" => "Individual victim(s)",
  "description_all" => "Individual victim(s)"
})
