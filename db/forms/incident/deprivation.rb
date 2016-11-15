require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

deprivation_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of children deprived of liberty for alleged association with a party to the conflic",
           "autosum_group" => "deprivation_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "deprivation_apprehended_date",
             "type" => "date_field",
             "display_name_all" => "Date the child(ren) was/were apprehended?"
          }),
  Field.new({"name" => "deprivation_duration",
             "type" => "date_range",
             "display_name_all" => "Duration of the deprivation"
            }),
  Field.new({"name" => "deprivation_duration_estimated",
             "type" => "radio_button",
             "display_name_all" => "Is the date/date range estimated?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "deprivation_grounds",
             "type" => "select_box",
             "display_name_all" => "On which grounds was/were the child(ren) deprived of liberty?",
             "option_strings_text_all" =>
                                    ["Security-related",
                                     "Religious/ethnic affiliation"].join("\n")
            }),
  Field.new({"name" => "deprivation_facility",
             "type" => "select_box",
             "display_name_all" => "In which type of facility was/were the child(ren) held?",
             "option_strings_text_all" =>
                                    ["Police station",
                                     "Intelligence agency premises",
                                     "Juvenile detention center",
                                     "Prison",
                                     "Illegal detention facility",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "deprivation_tortured",
             "type" => "radio_button",
             "display_name_all" => "Was/were the child(ren) tortured?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "violation_linked",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Other violations associated to the deprivation of liberty?",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "deprivation_claim_source",
             "type" => "select_box",
             "display_name_all" => "Source of claims of torture",
             "option_strings_text_all" =>
                                    ["Victim(s)",
                                     "Family",
                                     "CTFMR monitors/partners",
                                     "Other detainees",
                                     "Detention facility personnel",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "deprivation_ctfmr_access",
             "type" => "radio_button",
             "display_name_all" => "Did any CTFMR members/partners have access to the detained child(ren)",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "deprivation_formal_charges_brought",
             "type" => "radio_button",
             "display_name_all" => "Were any formal charges brought agaisnt the child?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "deprivation_formal_charges_brought_details",
             "type" => "textarea",
             "display_name_all" => "If 'Yes', please include details"
            }),
  Field.new({"name" => "deprivation_referred_justice_system",
             "type" => "radio_button",
             "display_name_all" => "Was/were the referred to the formal justice system?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

deprivation_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 3,
  :unique_id => "deprivation",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (deprivation_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Deprivation Subform",
  "description_all" => "Nested Deprivation Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["deprivation_grounds"]
})

deprivation_fields = [
  Field.new({"name" => "deprivation",
             "type" => "subform", "editable" => true,
             "subform_section_id" => deprivation_subform_section.unique_id,
             "display_name_all" => "Deprivation of liberty due to alleged association with a party to the conflict",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "deprivation_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 25,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => deprivation_fields,
  "name_all" => "Deprivation of liberty due to alleged association with a party to the conflict",
  "description_all" => "Deprivation of liberty due to alleged association with a party to the conflict"
})



