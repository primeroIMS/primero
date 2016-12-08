require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

abduction_subform_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of victims",
         "autosum_group" => "abduction_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "abduction_purpose",
             "type" => "select_box",
             "display_name_all" => "Purpose of the abduction",
             "multi_select" => true,
             "option_strings_text_all" => ["Extortion", "Forced marriage", "Indoctrination", "Intimidation",
                                           "Killing/Maiming", "Retaliation", "Recruitment and/or use", "Sexual violence",
                                           "Unknown", "Other"].join("\n")
            }),
  Field.new({"name" => "abduction_purpose_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify"
            }),
  Field.new({"name" => "abduction_from_location_list",
             "type" => "select_box",
             "display_name_all" => "Location where the abduction occurred",
             "option_strings_source" => "lookup Country"
            }),
  Field.new({"name" => "abduction_from_location_list_other",
             "type" => "text_field",
             "display_name_all" => "Other details about the location where the abduction occurred",
             "help_text" => "(Other country, GPS coordinates, etc.)"
            }),
  Field.new({"name" => "abduction_held_location_list",
             "type" => "select_box",
             "display_name_all" => "Location where the victim(s) was/were held",
             "option_strings_source" => "lookup Country"
            }),
  Field.new({"name" => "abduction_held_location_list_other",
             "type" => "text_field",
             "display_name_all" => "Other details about the location where the victim(s) was/were held occurred",
             "help_text" => "(Other country, GPS coordinates, etc.)"
            }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  #NOTE: The following is a multi-select, but made it violation instead of violations so as not to conflict with reload violations JS
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If 'Yes', please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "abduction_regained_freedom",
             "type" => "select_box",
             "display_name_all" => "Did any of the victims eventually regain freedom?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "abduction_regained_freedom_how",
             "type" => "select_box",
             "display_name_all" => "If yes, how did the abduction end?",
             "multi_select" => true,
             "option_strings_text_all" => ["Release by abductors", "Payment of ransom", "Escape",
                                           "Military or law enforcement operation", "Dissolution of armed force/group",
                                           "Formal handover process", "Other"].join("\n")
            }),
  Field.new({"name" => "abduction_regained_freedom_how_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify "
            }),
  Field.new({"name" => "abduction_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "abduction_regained_freedom_when",
             "type" => "date_field",
             "display_name_all" => "Date of leaving"
            }),
  Field.new({"name" => "abduction_freedom_is_date_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is the date estimated? "
            }),
  Field.new({"name" => "abduction_other_victims",
             "type" => "select_box",
             "display_name_all" => "Did the victim(s) witness other children during abduction?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "abduction_other_victims_additional_info",
             "type" => "textarea",
             "display_name_all" => "If 'Yes', please provide any additional information available"
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details:"
            })
 # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

abduction_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 50,
  :order_subform => 1,
  :unique_id => "abduction",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (abduction_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Abduction Subform",
  "description_all" => "Nested Abduction Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["abduction_purpose"]
})

abduction_fields = [
  Field.new({"name" => "abduction",
             "type" => "subform", "editable" => true,
             "subform_section_id" => abduction_subform_section.unique_id,
             "display_name_all" => "Abduction",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "abduction_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 50,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => abduction_fields,
  "name_all" => "Abduction",
  "description_all" => "Abduction"
})
