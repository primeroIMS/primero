denial_humanitarian_access_section_fields = [
  Field.new({"name" => "denial_method",
             "type" => "select_box",
             "display_name_all" => "What method(s) were used to deny humanitarian access?",
             "option_strings_text_all" =>
                                    ["Entry Restrictions of Personnel",
                                     "Import Restrictions for Goods",
                                     "Travel Restrictions in Country",
                                     "Threats and Violence Against Personnel",
                                     "Interference in Humanitarian Operations",
                                     "Hostage/Abduction of Personnel",
                                     "Conflict/Hostilities Impeding Access",
                                     "Vehicle Hijacking",
                                     "Restriction of Beneficiaries Access",
                                     "Intimidation"].join("\n")
            }),
  Field.new({"name" => "denial_organizations_affected",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What organizations were affected?",
             "option_strings_text_all" => [
                { id: 'national', display_text: "National" },
                { id: 'international', display_text: "International" },
                { id: 'n_a', display_text: "N/A" },
                { id: 'ngo', display_text: "NGO" },
                { id: 'united_nations_agencies', display_text: "United Nations Agencies" },
                { id: 'red_cross_cresent', display_text: "Red Cross / Crescent" },
                { id: 'other', display_text: "Other" }
              ]
            }),
  Field.new({"name" => "impact_on_humanitarian_personnel_property_section",
             "type" => "separator",
             "display_name_all" => "Impact on Humanitarian Personnel/Property"
            }),
  Field.new({"name" => "denial_personnel_killed",
             "type" => "numeric_field",
             "display_name_all" => "Number of Personnel Killed"
            }),
  Field.new({"name" => "denial_personnel_injured",
             "type" => "numeric_field",
             "display_name_all" => "Number of Personnel Injured"
            }),
  Field.new({"name" => "denial_personnel_abducted",
             "type" => "numeric_field",
             "display_name_all" => "Number of Personnel Abducted"
            }),
  Field.new({"name" => "denial_personnel_threatened",
             "type" => "numeric_field",
             "display_name_all" => "Number of Personnel Threatened"
            }),
  Field.new({"name" => "denial_vehicles_hijacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of Vehicles Hijacked"
            }),
  Field.new({"name" => "denial_value_property",
             "type" => "numeric_field",
             "display_name_all" => "Value of Property Stolen / Damaged",
             "help_text_all" => "US $$"
            }),
  Field.new({"name" => "human_impact_of_attack_section",
             "type" => "separator",
             "display_name_all" => "Human Impact of Attack"
            }),
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
       "autosum_group" => "denial_humanitarian_access_number_of_survivors",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "denial_total_affected_adults",
             "type" => "numeric_field",
             "display_name_all" => "Adults"
            }),
  Field.new({"name" => "denial_total_affected",
             "type" => "numeric_field",
             "display_name_all" => "Population Affected by Service Disruption"
            }),
  # Verification fields
  Field.new({"name" => "verification_section",
             "type" => "separator",
             "display_name_all" => "Verification"
            }),
  Field.new({"name" => "verifier_id_code",
             "type" => "text_field",
             "display_name_all" => "Verifier"
            }),
  Field.new({"name" => "verification_decision_date",
             "type" => "date_field",
             "display_name_all" => "Verification Decision Date"
            }),
  Field.new({"name" => "verified",
             "type" => "select_box",
             "display_name_all" => "Verification Status",
             "option_strings_source" => "lookup VerificationStatus"
            }),
  Field.new({"name" => "verification_source_weight",
             "type" => "select_box",
             "display_name_all" => "Has the information been received from a primary and reliable source?",
             "option_strings_text_all" =>
                                    ["Yes, from a credible Primary Source who witnessed the incident",
                                     "Yes, from a credible Primary Source who did not witness the incident",
                                     "No, but there is sufficient supporting documentation of the incident",
                                     "No, all the information is from a Secondary Source(s)",
                                     "No, the Primary Source information is deemed insufficient or not credible"].join("\n")
            }),
  Field.new({"name" => "un_eyewitness",
             "type" => "radio_button",
             "display_name_all" => "Was the incident witnessed by UN staff or other MRM-trained affiliates?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_info_consistent",
             "type" => "radio_button",
             "display_name_all" => "Is the information consistent across various independent sources?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_info_credibility",
             "type" => "radio_button",
             "display_name_all" => "Has the veracity of the allegations been deemed credible using reasonable and sound judgement of trained and reliable monitors?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "reason_non_verification",
             "type" => "select_box",
             "display_name_all" => "If not verified, why?",
             "option_strings_text_all" =>
                                    ["Unwilling Sources",
                                     "Security Constraints",
                                     "Resource Constraints",
                                     "Contradictory Information",
                                     "Pending Further Monitoring",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "verification_decision_description",
             "type" => "textarea",
             "display_name_all" => "Notes on Verification Decision"
            }),
  Field.new({"name" => "ctfmr_verified",
             "type" => "radio_button",
             "display_name_all" => "Verified by CTFMR",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "verification_date_ctfmr",
             "type" => "date_field",
             "display_name_all" => "Date verified by CTFMR"
            })
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
  :fields => denial_humanitarian_access_section_fields,
  "name_all" => "Nested Human Impact of Attack Subform",
  "description_all" => "Nested Human Impact of Attack Subform",
  "collapsed_fields" => ["denial_method"],
  :initial_subforms => 1
})

denial_humanitarian_access_fields = [
  ##Subform##
  Field.new({"name" => "denial_humanitarian_access",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.unique_id,
             "display_name_all" => "Denial of Humanitarian Access",
             "expose_unique_id" => true,
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
  "name_all" => "Denial of Humanitarian Access",
  "description_all" => "Denial of Humanitarian Access"
})
