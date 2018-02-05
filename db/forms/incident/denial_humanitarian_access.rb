require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

denial_humanitarian_access_section_fields = [
  Field.new({"name" => "denial_method",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Method(s) used to deny humanitarian access",
             "option_strings_text_all" => ["Abduction of humanitarian personnel", "Besiegement",
                                           "Entry restrictions for humanitarian personnel",
                                           "Import restrictions for relief goods",
                                           "Financial restrictions on humanitarian organizations",
                                           "Property damage", "Theft", "Restrictions of beneficiaries' access",
                                           "Threats/violence against beneficiaries",
                                           "Threats/violence against humanitarian personnel",
                                           "Travel restrictions in country", "Vehicle hijacking", "Other"].join("\n"),
             "help_text_all" => "This field is required for reporting."
            }),
  Field.new({"name" => "denial_method_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details"
            }),
  Field.new({"name" => "denial_organizations_affected",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of organization(s) affected",
             "option_strings_text_all" => ["Governmental", "International/Inter-Governmental", "NGO/International",
                                           "NGO/National", "De-facto authorities", "ICRC-Red Cross/Crescent",
                                           "Religious/faith based institution", "Community organization",
                                           "Private (e.g. demining company)", "Unknown", "Other"].join("\n")
            }),
  Field.new({"name" => "denial_organizations_affected_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details "
            }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If yes, please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "denial_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "denial_personnel_killed",
             "type" => "tally_field",
             "display_name_all" => "Number of humanitarian personnel killed",
             "autosum_group" => "denial_number_of_personnel_killed",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "denial_personnel_killed_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?",
            }),
  Field.new({"name" => "denial_personnel_injured",
             "type" => "tally_field",
             "display_name_all" => "Number of humanitarian personnel injured",
             "autosum_group" => "denial_number_of_personnel_injured",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "denial_personnel_injured_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated? ",
            }),
  Field.new({"name" => "denial_personnel_abducted",
             "type" => "tally_field",
             "display_name_all" => "Number of humanitarian personnel abducted",
             "autosum_group" => "denial_number_of_personnel_abducted",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "denial_personnel_abducted_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?  ",
            }),
  Field.new({"name" => "denial_personnel_threatened",
             "type" => "tally_field",
             "display_name_all" => "Number of humanitarian personnel threatened",
             "autosum_group" => "denial_number_of_personnel_threatened",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "denial_personnel_threatened_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?   ",
            }),
  Field.new({"name" => "denial_vehicles_hijacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of humanitarian vehicles hijacked"
            }),
  Field.new({"name" => "denial_vehicles_hijacked_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?    ",
            }),
  Field.new({"name" => "denial_value_property",
             "type" => "numeric_field",
             "display_name_all" => "Value of property stolen/damaged ",
             "help_text_all" => "Specify in local currency or USD"
            }),
  Field.new({"name" => "human_impact_of_attack_section",
             "type" => "separator",
             "display_name_all" => "Human impact of the attack  "
            }),
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children affected by access restriction/service disruption",
       "autosum_group" => "denial_humanitarian_access_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_tally_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?     ",
            }),
  Field.new({"name" => "denial_total_affected_adults",
             "type" => "numeric_field",
             "display_name_all" => "Number of adults affected by access restriction/service disruption"
            }),
  Field.new({"name" => "denial_total_affected_adults_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?      ",
            }),
  Field.new({"name" => "denial_population_affected",
             "type" => "textarea",
             "display_name_all" => "Population affected by access restriction/service disruption",
             "help_text_all" => "E.g. particular communities/sub-groups (religious, ethnic, IDP/refugee, etc.)"
            }),
  Field.new({"name" => "types_of_aid_disrupted_denial",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of aid/service denied/disrupted.",
             "help_text_all" => "Select all that applies",
             "option_strings_text_all" => ["Food", "Medical care", "Medical equipment", "School supplies",
                                           "WASH", "Other essential supplies"].join("\n")
            }),
  Field.new({"name" => "denial_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

denial_humanitarian_access_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 40,
  :order => 80,
  :order_subform => 2,
  :unique_id=>"denial_humanitarian_access",
  :parent_form=>"incident",
  "editable"=>true,
  :fields => (denial_humanitarian_access_section_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Human Impact of Attack Subform",
  "description_all" => "Nested Human Impact of Attack Subform",
  "collapsed_fields" => ["denial_method"],
  :initial_subforms => 1
})

denial_humanitarian_access_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "denial_guiding_questions",
             "type" => "select_box",
             "disabled" => true,
             "display_name_all" => "Definition",
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "Denial of humanitarian access to children is the intentional deprivation of or "\
                                    "impediment to the passage of humanitarian assistance indispensible to children’s "\
                                    "survival, by the parties to the conflict, including wilfully impeding relief supplies "\
                                    "as provided for under the Geneva Conventions; and significant impediments to the "\
                                    "ability of humanitarian or other relevant actors to access and assist affected "\
                                    "children, in situations of armed conflict.  The denial should be considered in terms "\
                                    "of children’s access to assistance as well as humanitarian agencies’ ability to access "\
                                    "vulnerable populations, including children. (see MRM Fiedl Manual, page 10). Examples "\
                                    "of restrictions of access may include road blocks or checkpoints.Examples of entry "\
                                    "restrictions for humanitarian personnel may include deliberate delays in visa issuance "\
                                    "or formal registrations, and other bureaucratic impediments.  Import restrictions for "\
                                    "relief goods may include obstructive custom formalities, regulations and fees.  "\
                                    "Examples of travel restrictions in country may include systematic denial of, or delays "\
                                    "in authorizing, humanitarian convoys."
            }),
  ##Subform##
  Field.new({"name" => "denial_humanitarian_access",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.unique_id,
             "display_name_all" => "Denial of humanitarian access for children",
             "expose_unique_id" => true
            })
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "denial_humanitarian_access_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 80,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => denial_humanitarian_access_fields,
  "name_all" => "Denial of humanitarian access for children",
  "description_all" => "Denial of humanitarian access for children"
})
