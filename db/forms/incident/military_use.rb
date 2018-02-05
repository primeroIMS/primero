require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

military_use_subform_fields = [
    Field.new({"name" => "military_use_type",
               "type" => "select_box",
               "display_name_all" => "Type of military use",
               "option_strings_text_all" => ["Military use of school", "Military use of hospital"].join("\n"),
               "help_text_all" => "This field is required for reporting."
              }),
    Field.new({"name" => "facility_operational_before",
               "type" => "select_box",
               "display_name_all" => "Was the facility operational before the military use?",
               "option_strings_text_all" => ["Yes", "No", "Partially", "Unknown"].join("\n")
              }),
    Field.new({"name" => "military_use_duration",
               "type" => "date_range",
               "display_name_all" => "Duration of military use",
               "help_text_all" => "Select initial and end dates."
              }),
    Field.new({"name" => "military_use_duration_estimated",
               "type" => "tick_box",
               "tick_box_label_all" => "Yes",
               "display_name_all" => "Is the timeframe estimated?",
              }),
    Field.new({"name" => "military_use_purpose",
               "type" => "select_box",
               "multi_select" => true,
               "display_name_all" => "Purpose of the military use",
               "option_strings_text_all" => ["Barracks/Dormitory", "Command post",  "Sniper position", "Storage",
                                             "Weapons depot", "Unknown", "Other"].join("\n")
              }),
    Field.new({"name" => "military_use_purpose_other",
               "type" => "text_field",
               "display_name_all" => "If ‘Other', please provide details  "
              }),
    Field.new({"name" => "associated_violation_status",
               "type" => "select_box",
               "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
               "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
              }),
    Field.new({"name" => "associated_violation",
               "type" => "select_box",
               "multi_select" => true,
               "display_name_all" => "If 'Yes', please specify:",
               "option_strings_source" => "lookup ViolationType"
              }),
    Field.new({"name" => "military_use_crossborder",
               "type" => "select_box",
               "display_name_all" => "Was this a cross-border violation?",
               "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
              }),
    Field.new({"name" => "military_use_schools_section",
               "type" => "separator",
               "display_name_all" => "Military use of school(s)"
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
                                    "(available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf), page 43.",
               "help_text_all" => "This field is required for reporting Military use of schools."
              }),
    Field.new({"name" => "school_type_other",
               "type" => "text_field",
               "display_name_all" => "If ‘Other', please provide details   "
              }),
    Field.new({"name" => "school_age_level",
               "type" => "select_box",
               "multi_select" => true,
               "display_name_all" => "Age level of students attending the affected school",
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
    Field.new({"name" => "military_use_hospitals_section",
               "type" => "separator",
               "display_name_all" => "Military use of hospital(s)"
              }),
    Field.new({"name" => "health_type",
               "type" => "select_box",
               "multi_select" => true,
               "display_name_all" => "Type of healthcare facility affected",
               "option_strings_source" => "lookup HealthcareFacilityType",
               "help_text_all" => "This field is required for reporting Military use of hospitals."
              }),
    Field.new({"name" => "health_type_other",
               "type" => "text_field",
               "display_name_all" => "If ‘Other', please provide details    "
              }),
    Field.new({"name" => "health_type_details",
               "type" => "textarea",
               "display_name_all" => "Details of the affected healthcare facility",
               "help_text_all" => "E.g. name(s) of affected facility/ies; hospital's patient capacity; name and type of organization managing the facility."
              }),
    Field.new({"name" => "human_impact_of_military_use_section",
               "type" => "separator",
               "display_name_all" => "Human impact of the military use"
              }),
    Field.new({"name" => "number_children_service_disruption",
               "type" => "tally_field",
               "display_name_all" => "Number of children affected by service disruption",
               "autosum_group" => "military_number_of_children_service_disruption",
               "tally_all" => ['boys', 'girls', 'unknown'],
               "autosum_total" => true,
              }),
    Field.new({"name" => "number_children_service_disruption_estimated",
               "type" => "tick_box",
               "tick_box_label_all" => "Yes",
               "display_name_all" => "Is this number estimated?",
              }),
    Field.new({"name" => "facility_impact_section",
               "type" => "separator",
               "display_name_all" => "Physical impact of the military use"
              }),
    Field.new({"name" => "facility_impact",
               "type" => "select_box",
               "display_name_all" => "Type and extent of physical impact",
               "option_strings_source" => "lookup FacilityImpactType"
              }),
    Field.new({"name" => "facility_closed",
               "type" => "select_box",
               "display_name_all" => "Was the facility closed as a result of the military use?",
               "option_strings_text_all" => ["Yes", "No", "Partially", "Unknown"].join("\n")
              }),
    Field.new({"name" => "facility_closed_duration",
               "type" => "numeric_field",
               "display_name_all" => "For how long? (days)"
              }),
    Field.new({"name" => "military_use_facility_notes",
               "type" => "textarea",
               "display_name_all" => "Additional details",
               "help_text_all" => " E.g., estimated number of adults affected by service disruption, overall impact "\
                                  "beyond physical damage"
              })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

military_use_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 1,
  :unique_id => "military_use",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (military_use_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Military use Subform",
  "description_all" => "Nested Military use Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["military_use_type"]
})

military_use_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "military_use_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "The military use of schools and hospitals is not a grave violation per se under "\
                                    "UN Security Council Resolution 1998. Therefore, reporting on military use of schools "\
                                    "and hospitals should be reported upon in detail, but separately. For further guidance "\
                                    "see 'Protect Schools+Hospitals - Guidance Note on Security Council Resolution 1998, 2014, "\
                                    "available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf "
            }),
  Field.new({"name" => "military_use",
             "type" => "subform", "editable" => true,
             "subform_section_id" => military_use_subform_section.unique_id,
             "display_name_all" => "Military use of school(s) and/or hospital(s)",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "military_use_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => military_use_fields,
  "name_all" => "Military use of school(s) and/or hospital(s)",
  "description_all" => "Military use of school(s) and/or hospital(s)"
})
