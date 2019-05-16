source_subform_fields = [
  Field.new({"name" => "source_description",
             "type" => "textarea",
             "display_name_all" => "Brief description of the source",
             "help_text_all" => "E.g., victim of rape; eyewitness of aerial bombardment on a school;  prison guard who "\
                                 "shared list of children in administrative detention"
            }),
  Field.new({"name" => "source_id",
             "type" => "text_field",
             "display_name_all" => "Source ID (if applicable)",
             "help_text_all" => "ID applies to those CTFMRs which assign an ID number to each source for security purposes"
            }),
  Field.new({"name" => "source_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violation(s) corroborated by the source (select all that apply)",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "interviewer",
             "type" => "text_field",
             "display_name_all" => "MRM monitor's name/ID (if applicable)",
             "help_text_all" => "ID applies to those CTFMRs which assign an ID number to each MRM monitor for security purposes"
            }),
  Field.new({"name" => "primary_reporting_organization",
             "type" => "select_box",
             "display_name_all" => "CTFMR member/partner which collected the testimony/source of information",
             "option_strings_source" => "lookup CtfmrMemberOrPartner"
            }),
  Field.new({"name" => "primary_reporting_organization_other",
             "type" => "textarea",
             "display_name_all" => "If ‘Other', please provide details"
            }),
  Field.new({"name" => "source_interview_date",
             "type" => "date_field",
             "display_name_all" => "Date of the interview/source collection"
            }),
  #TODO: Spreadsheet asks to change options, but this uses Location lookup.  Open Question to Sue
  Field.new({"name" => "location_report",
             "type" => "select_box",
             "display_name_all" => "Location where the testimony/source of information was collected",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "location_additional_details",
             "type" => "text_field",
             "display_name_all" => "Additional details on location"
            }),
  Field.new({"name" => "source_category",
             "type" => "select_box",
             "display_name_all" => "Category of source",
             "option_strings_text_all" => ["Primary - Victim", "Primary - Witness", "Primary - Alleged perpetrator", "Secondary"].join("\n"),
             "guiding_questions" => "Victim: A victim is a person who has suffered some type of harm (e.g., physical, "\
                                    "psychological or loss of property) as a result of a human rights violation; Witness: "\
                                    "A witness is a person who, being present when a human rights violation occurred, "\
                                    "personally sees, hears or otherwise perceives it through direct experience: "\
                                    "Secondary source:  A source is a person who is in a position to provide secondary "\
                                    "information, including contextual information, about a human rights violation, but "\
                                    "who did not suffer, did not directly experience or was not present when it occurred.",
              "help_text_all" => "This field is mandatory"
            }),
  Field.new({"name" => "source_type",
             "type" => "select_box",
             "display_name_all" => "Type of source",
             "option_strings_text_all" => ["Oral testimony", "Written statement",
                                           "Document (e.g. medical/police report; judicial records)", "Photograph",
                                           "Video material", "Direct observation by MRM monitor", "Satellite images",
                                           "Physical evidence", "Body injuries/scars", "Other"].join("\n")
            }),
  Field.new({"name" => "source_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details "
            }),
  Field.new({"name" => "source_gender",
             "type" => "select_box",
             "display_name_all" => "Sex of source",
             "option_strings_text_all" => ["Male", "Female", "N/A"].join("\n")
            }),
  Field.new({"name" => "source_age",
             "type" => "select_box",
             "display_name_all" => "Age of the source",
             "option_strings_text_all" => ["Child", "Adult", "N/A"].join("\n")
            }),
  Field.new({"name" => "source_reliability",
             "type" => "select_box",
             "display_name_all" => "Reliability of the source",
             "option_strings_text_all" => ["High", "Medium", "Low"].join("\n")
            }),
  Field.new({"name" => "source_reliability_reason",
             "type" => "text_field",
             "display_name_all" => "Please provide details on the assessment of the source's reliability"
            }),
  Field.new({"name" => "source_credibility",
             "type" => "select_box",
             "display_name_all" => "Credibility of information provided",
             "option_strings_text_all" => ["High", "Medium", "Low"].join("\n")
            }),
  Field.new({"name" => "source_credibility_details",
             "type" => "textarea",
             "display_name_all" => "Please provide details on the assessment of the credibility of the information:"
            }),
  Field.new({"name" => "source_consent_data_sharing",
             "type" => "radio_button",
             "display_name_all" => "Does the source consent to sharing non-personally identifiable data with the CTFMR "\
                                   "for reporting purposes?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "source_requires_services",
             "type" => "radio_button",
             "display_name_all" => "If the source is a child, does he/she require services?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "source_consent_with_whom",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "With whom is the source willing to share his/her name and other personal details "\
                                   "for referral purposes?",
             "option_strings_text_all" => ["UNICEF", "Other CTFMR member(s)", "CTFMR partners/service providers",
                                           "No one", "Other"].join("\n")
            }),
  Field.new({"name" => "source_consent_with_whom_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details  ",
             "help_text_all" => "E.g. on the specific CTFMR member/UN agency/NGO/partner/service provider the victim/adult "\
                                "caregiver consented to sharing personal details with"
            }),
  Field.new({"name" => "source_consent_follow_up",
             "type" => "radio_button",
             "display_name_all" => "Is the source willing to be contacted again about the violations?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "source_additional_details",
             "type" => "textarea",
             "display_name_all" => "Additonal Details"
            }),
]

source_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 70,
  :order => 10,
  :order_subform => 1,
  :unique_id => "source_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => source_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Source Subform",
  "description_all" => "Nested Source Subform",
  "collapsed_fields" => ["source_type", "source_violations"]
})

source_fields = [
  Field.new({"name" => "source_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => source_subform_section.unique_id,
             "display_name_all" => "Source"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "source",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 70,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Sources",
  "editable" => true,
  :fields => source_fields,
  "name_all" => "Sources",
  "description_all" => "Sources"
})