attack_on_hospitals_subform_fields = [
  Field.new({"name" => "site_number_attacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of Sites Attacked"
            }),
  Field.new({"name" => "site_attack_type",
             "type" => "select_box",
             "display_name_all" => "Type of Attack On Site",
             "option_strings_text_all" =>
                                    ["Shelling",
                                     "Arson",
                                     "Aerial Bombardment",
                                     "Theft/Looting",
                                     "Occupation of Building",
                                     "Direct Attack on students/teachers",
                                     "Intimidation of Individuals",
                                     "Direct attack on medical person",
                                     "Physical Destruction",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "hospital_name",
             "type" => "text_field",
             "display_name_all" => "Hospital Name"
            }),
  Field.new({"name" => "site_number_of_patients",
             "type" => "numeric_field",
             "display_name_all" => "Number of Patients"
            }),
  Field.new({"name" => "human_impact_attack_hospital_section",
             "type" => "separator",
             "display_name_all" => "Human Impact of Attack"
            }),
  Field.new({"name" => "violation_killed_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children killed",
       "autosum_group" => "attack_on_hospitals_number_of_children_killed",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children injured",
       "autosum_group" => "attack_on_hospitals_number_of_children_injured",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "facility_staff_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Killed"
            }),
  Field.new({"name" => "facility_staff_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Injured"
            }),
  Field.new({"name" => "facility_other_adults_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Killed"
            }),
  Field.new({"name" => "facility_other_adults_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Injured"
            }),
  Field.new({"name" => "number_children_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Affected by Service Disruption"
            }),
  Field.new({"name" => "number_adults_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Number of Adults Affected by Service Disruption"
            }),
  Field.new({"name" => "number_children_recruited",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Recruited During Attack"
            }),
  Field.new({"name" => "facility_management",
             "type" => "select_box",
             "display_name_all" => "What organization manages this facilty?",
             "option_strings_text_all" =>
                                    ["Government",
                                     "NGO",
                                     "Community",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "facility_attack_objective",
             "type" => "text_field",
             "display_name_all" => "What was the main objective of the \"attack\"?"
            }),
  Field.new({"name" => "facility_impact",
             "type" => "select_box",
             "display_name_all" => "Physical Impact of Attack",
             "option_strings_text_all" =>
                                    ["Total Destruction",
                                     "Serious Damage",
                                     "Minor Damage",
                                     "None"].join("\n")
            }),
  Field.new({"name" => "facility_closed",
             "type" => "radio_button",
             "display_name_all" => "Was Facility Closed As A Result?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "facility_closed_duration",
             "type" => "numeric_field",
             "display_name_all" => "For How Long? (Days)"
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

attack_on_hospitals_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 1,
  :unique_id => "attack_on_hospitals",
  :parent_form=>"incident",
  "editable" => true,
  :fields => attack_on_hospitals_subform_fields,
  "name_all" => "Nested Attack on Hospitals Subform",
  "description_all" => "Nested Attack on Hospitals Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type"]
})

attack_on_hospitals_fields = [
  Field.new({"name" => "attack_on_hospitals",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_hospitals_subform_section.unique_id,
             "display_name_all" => "Attack on Hospitals",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "attack_on_hospitals_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => attack_on_hospitals_fields,
  "name_all" => "Attack on Hospitals",
  "description_all" => "Attack on Hospitals"
})
