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
             "option_strings_text_all" => ["Female", "Male", "Unknown"].join("\n"),
             "help_text_all" => "This field is mandatory"
            }),
  Field.new({"name" => "individual_age",
             "type" => "numeric_field",
             "display_name_all" => "Victim's age",
             "help_text_all" => "At the time of violation. (This field is mandatory)",
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
            }),
  Field.new({"name" => "victim_deprived_liberty_security_reasons",
             "type" => "select_box",
             "display_name_all" => "Was/were the victim(s) deprived of liberty for security reasons?",
             "option_strings_source" => "lookup YesNoUnknown"
            }),
  Field.new({"name" => "entity_responsible_deprivation_liberty",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Select the entity responsible for the deprivation of liberty",
             "option_strings_text_all" => ["Armed force", "Armed group", "Other party to the conflict", "Unknown"].join("\n")
            }),
  Field.new({"name" => "armed_force_appropiate",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If armed force, please select as appropriate",
             "option_strings_source" => "lookup ArmedForceName"
            }),
  Field.new({"name" => "armed_group_appropiate",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If armed group, please select as appropriate",
             "option_strings_source" => "lookup ArmedGroupName"
            }),
  Field.new({"name" => "armed_party_appropiate",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If other party to the conflict, please select as appropriate",
             "option_strings_source" => "lookup OtherPartyName"
            }),
  Field.new({"name" => "facilty_victims_held",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Please select the facilty where the victims(s) was/were being held",
             "option_strings_text_all" => ["Civilian infrastructure", "Informal detention facility",
                                           "Intelligence agency premises", "Juvenile detention center",
                                           "Military facility", "Prison", "Other"].join("\n")
            }),
  Field.new({"name" => "other_facilty_victims_held",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details "
            }),
  Field.new({"name" => "details_reasons_deprivation_liberty",
             "type" => "textarea",
             "display_name_all" => "Please provide details on the reasons for deprivation of liberty"
            }),
  Field.new({"name" => "length_deprivation_liberty",
             "type" => "date_range",
             "display_name_all" => "Please select length of deprivation of liberty"
            }),
  Field.new({"name" => "torture_punishment_while_deprivated_liberty",
             "type" => "select_box",
             "display_name_all" => "Was/were the child(ren) subject to torture or other cruel, inhuman or degrading treatment or punishment while deprived of liberty",
             "option_strings_source" => "lookup IllTreatmentViolations"
            }),
  Field.new({"name" => "other_torture_punishment_while_deprivated_liberty",
             "type" => "textarea",
             "display_name_all" => "If yes, please provide details."
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
