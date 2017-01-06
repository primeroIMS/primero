require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

attack_on_subform_fields = [
  Field.new({"name" => "facility_attack_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of education or health-related violation",
             "option_strings_text_all" => ["Attack on school(s)", "Attack on education personnel",
                                           "Threat of attack on school(s)", "Other interference with education",
                                           "Attack on hospital(s)", "Attack on medical personnel",
                                           "Threat of attack on hospital(s)", "Other interference with healthcare"].join("\n"),
             "guiding_questions" => "See  'Protect Schools+Hospitals - Guidance Note on Security Council Resolution 1998', "\
                                    "2014 (available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf), page 6."
            }),

  Field.new({"name" => "weapon_type",
             "type" => "select_box",
             "display_name_all" => "Type of weapon used",
             "option_strings_source" => "lookup WeaponType",
             "guiding_questions" => "For further guidance, please refer to UNMAS 'Glossary of mine action terms, "\
                                    "definitions and abbreviations', available at: "\
                                    "http://www.mineactionstandards.org/fileadmin/MAS/documents/imas-international-standards/english/series 04/IMAS_04.10_Glossary_of_mine_action_terms__definitions_and_abbreviations.pdf; "\
                                    "to the UN Coordinating Action on Small Arms (CASA) 'Glossary of terms, definitions "\
                                    "and abbreviations', available at: http://www.smallarmsstandards.org/isacs/0120-en.pdf; "\
                                    "and to UNIDIR 'Addressing Improvised Explosive Devices' paper, pp. 14-15 "\
                                    "available at: http://www.unidir.org/files/publications/pdfs/-en-641.pdf."
            }),
  Field.new({"name" => "weapon_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details "
            }),
  Field.new({"name" => "attack_type",
             "type" => "select_box",
             "display_name_all" => "Type of attack",
             "option_strings_source" => "lookup AttackType"
            }),
  Field.new({"name" => "attack_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details"
            }),
  Field.new({"name" => "facility_operational_before",
             "type" => "select_box",
             "display_name_all" => "Was the facility operational before the attack?",
             "option_strings_text_all" => ["Yes", "No", "Partially", "Unknown"].join("\n")
            }),
  Field.new({"name" => "facility_attack_targeting_personnel",
             "type" => "select_box",
             "display_name_all" => "Was the protected facility/personnel directly targeted?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "facility_attack_objective",
             "type" => "textarea",
             "display_name_all" => "If 'No', what was the main objective of the attack?",
            }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "attacks_schools_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If 'Yes', please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "attacks_on_schools",
             "type" => "separator",
             "display_name_all" => "Attack on school(s)"
            }),
  Field.new({"name" => "school_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of school affected",
             "option_strings_source" => "lookup SchoolType",
             "guiding_questions" => "'Schools' refer to all learning sites and education facilities, as determined by "\
                                    "the local context, both formal and informal, secular or religious, providing early "\
                                    "childhood, primary and secondary education as well as vocational training to children. "\
                                    "'Schools' include all school-related spaces, structures, infrastructure and grounds "\
                                    "attached to them, such as water, sanitation and hygiene facilities. See "\
                                    "'Protect Schools+Hospitals - Guidance Note on Security Council Resolution 1998', 2014 "\
                                    "(available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf), page 43."
            }),
  Field.new({"name" => "school_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details  "
            }),
  Field.new({"name" => "school_age_level",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Age level of students attending he affected school",
             "option_strings_source" => "lookup SchoolAgeLevel"
            }),
  Field.new({"name" => "school_students_sex",
             "type" => "select_box",
             "display_name_all" => "Sex of students",
             "option_strings_source" => "lookup SchoolSexType"
            }),
  Field.new({"name" => "school_type_details",
             "type" => "textarea",
             "display_name_all" => "Details of affected school",
             "help_text_all" => "E.g., school name, number of students attending the affected school, name and type of "\
                                  "organization managing the facility (e.g. NGO-run, Government-run, community-based')."
            }),
  Field.new({"name" => "attacks_on_hospitals",
             "type" => "separator",
             "display_name_all" => "Attack on hospital(s)"
            }),
  Field.new({"name" => "health_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of healthcare facility affected",
             "option_strings_source" => "lookup HealthcareFacilityType"
            }),
  Field.new({"name" => "health_type_other",
             "type" => "text_field",
             "display_name_all" => "If ‘Other', please provide details   "
            }),
  Field.new({"name" => "health_type_details",
             "type" => "textarea",
             "display_name_all" => "Details of the affected healthcare facility",
             "help_text_all" => "E.g. name(s) of affected facility/ies; hospital's patient capacity; name and type of "\
                                "organization managing the facility."
            }),
  Field.new({"name" => "human_impact_of_attack_section",
             "type" => "separator",
             "display_name_all" => "Human impact of the attack"
            }),
  Field.new({"name" => "violation_killed_tally",
             "type" => "tally_field",
             "display_name_all" => "Total number of children killed",
             "autosum_group" => "attack_number_of_children_killed",
             "tally_all" => ['boys', 'girls', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "violation_injured_tally",
             "type" => "tally_field",
             "display_name_all" => "Total number of children injured",
             "autosum_group" => "attack_number_of_children_injured",
             "tally_all" => ['boys', 'girls', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "facility_staff_killed_attack",
             "type" => "tally_field",
             "display_name_all" => "Number of protected personnel killed",
             "autosum_group" => "attack_number_of_personnel_killed",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "facility_staff_injured_attack",
             "type" => "tally_field",
             "display_name_all" => "Number of protected personnel injured",
             "autosum_group" => "attack_number_of_personnel_injured",
             "tally_all" => ['men', 'women', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "number_children_service_disruption",
             "type" => "tally_field",
             "display_name_all" => "Number of children affected by service disruption",
             "autosum_group" => "attack_number_of_children_service_disruption",
             "tally_all" => ['boys', 'girls', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "number_children_service_disruption_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?",
            }),
  Field.new({"name" => "were_children_recruited",
             "type" => "radio_button",
             "display_name_all" => "Were any children recruited/abducted during the attack?",
             "option_strings_text_all" => "Yes\nNo",
             "help_text_all" => "If 'Yes', please fill in/refer to the corresponding 'Violation' section"
            }),
  Field.new({"name" => "facility_impact_section",
             "type" => "separator",
             "display_name_all" => "Physical impact of the attack"
            }),
  Field.new({"name" => "facility_impact",
             "type" => "select_box",
             "display_name_all" => "Type and extent of physical impact",
             "option_strings_source" => "lookup FacilityImpactType"
            }),
  Field.new({"name" => "facility_closed",
             "type" => "select_box",
             "display_name_all" => "Was the facility closed as a result of the attack?",
             "option_strings_text_all" => ["Yes", "No", "Partially", "Unknown"].join("\n")
            }),
  Field.new({"name" => "facility_closed_duration",
             "type" => "numeric_field",
             "display_name_all" => "For how long? (days)"
            }),
  Field.new({"name" => "attack_on_facility_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details",
             "help_text_all" => "E.g., estimated number of adults affected by service disruption"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

attack_on_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 1,
  :unique_id => "attack_on",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (attack_on_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested attacks on subform",
  "description_all" => "Nested attacks on subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["facility_attack_type"]
})

attack_on_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "attack_on_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "Does not include 'Military use of schools and/or hospitals', which is not a grave " \
                                    "violation under UN Security Council 1998 and should be recorded separately in the " \
                                    "dedicated violation form of the database."
            }),
  ##Subform##
  Field.new({"name" => "attack_on",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_subform_section.unique_id,
             "display_name_all" => "Attacks on school(s) and/or hospital(s)",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "attack_on_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => attack_on_fields,
  "name_all" => "Attacks on schools and/or hospitals",
  "description_all" => "Attacks on schools and/or hospitals"
})
