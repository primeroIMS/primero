require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

attack_on_hospitals_subform_fields = [
  Field.new({"name" => "site_number_attacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of Sites Attacked",
             "visible" => false
            }),
  Field.new({"name" => "site_attack_type",
             "type" => "select_box",
             "display_name_all" => "Type of health-related violation(s)",
             "option_strings_text_all" =>
                                    ["Attack on hospital(s)",
                                     "Attack on medical personnel",
                                     "Threats of attack",
                                     "Military use of hospitals",
                                     "Other interference with health care"].join("\n")
            }),
  Field.new({"name" => "site_attack_type_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify"
            }),
  Field.new({"name" => "health_facility_management",
             "type" => "select_box",
             "display_name_all" => "Health facility management",
             "option_strings_text_all" =>
                                    ["Governmental/International",
                                     "Governmental/National",
                                     "NGO/International",
                                     "NGO/National",
                                     "ICRC-Red Cross/Crescent",
                                     "Community",
                                     "Private",
                                     "Unknown",
                                     "N/A"].join("\n")
            }),
  Field.new({"name" => "hospital_name",
             "type" => "text_field",
             "display_name_all" => "Hospital Name",
             "visible" => false
            }),
  Field.new({"name" => "site_number_of_patients",
             "type" => "numeric_field",
             "display_name_all" => "Number of Patients",
             "visible" => false
            }),
  Field.new({"name" => "attack_on_facility_details",
             "type" => "textarea",
             "display_name_all" => "Details of the affected health care facility",
             "help_text_all" => "E.g. hospital name, type of hospital, total capacity, name of organization managing the facility. "
            }),
  Field.new({"name" => "facility_attack_weapon_used",
             "type" => "select_box",
             "display_name_all" => "Type of weapon used",
             "option_strings_text_all" => ["Aircraft bomb",
                                           "Barrel bomb",
                                           "Booby trap",
                                           "Chemical weapons",
                                           "Unmanned aerial vehicle (UAV [e.g. drone])",
                                           "Explosive remnant of war – ERW [includes unexploded ordnance and abandoned ordnance]",
                                           "Improvised Explosive Device (IED)",
                                           "Grenade",
                                           "Landmine [includes anti-personnel and anti-vehicle landmine]",
                                           "Light weapons",
                                           "Missile",
                                           "Mortar/Rocket",
                                           "Sharp weapon",
                                           "Small arm [e.g. AK-47]",
                                           "Submunition",
                                           "Other weapons",
                                           "Unknown"].join("\n")
            }),
  Field.new({"name" => "facility_attack_weapon_used_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other weapons', please provide details"
            }),
  Field.new({"name" => "facility_attack_type",
             "type" => "select_box",
             "display_name_all" => "Type of attack",
             "option_strings_text_all" => ["Aerial attack",
                                           "Arson",
                                           "Command-wire operated IED",
                                           "Flying IEDs",
                                           "Person-borne IED",
                                           "Remote-controlled IED",
                                           "Timer-operated IED",
                                           "Vehicle-borne IED",
                                           "Land-based attack - Laying mines",
                                           "Land-based attack - Pressure plate IED",
                                           "Occupation of building(s)",
                                           "Other shooting",
                                           "Sea-based attack",
                                           "Tactical use of building(s)",
                                           "Targeted shooting [e.g. sniper]",
                                           "Theft/Looting",
                                           "Threat/Intimidation/Harassment"].join("\n")
            }),
  Field.new({"name" => "facility_attack_targeting_personnel",
             "type" => "select_box",
             "display_name_all" => "Was the health care facility/personnel directly targeted?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "facility_attack_objective",
             "type" => "textarea",
             "display_name_all" => "If 'No', what was the main objective of the attack?",
            }),
  Field.new({"name" => "human_impact_attack_section",
             "type" => "separator",
             "display_name_all" => "Human impact of the attack"
            }),
  Field.new({"name" => "violation_killed_tally",
       "type" => "tally_field",
       "display_name_all" => "Total number of children killed ",
       "autosum_group" => "attack_on_hospitals_number_of_children_killed",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_tally",
       "type" => "tally_field",
       "display_name_all" => "Total number of children injured ",
       "autosum_group" => "attack_on_hospitals_number_of_children_injured",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "facility_staff_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of medical personnel killed"
            }),
  Field.new({"name" => "facility_staff_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of medical personnel injured"
            }),
  Field.new({"name" => "facility_other_adults_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of other adults killed"
            }),
  Field.new({"name" => "facility_other_adults_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of other adults injured"
            }),
  Field.new({"name" => "number_children_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Estimated number of children affected by service disruption"
            }),
  Field.new({"name" => "number_adults_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Estimated number of adults affected by service disruption"
            }),
  Field.new({"name" => "number_children_recruited",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Recruited During Attack",
             "visible" => false
            }),
  Field.new({"name" => "were_children_recruited",
             "type" => "radio_button",
             "display_name_all" => "Were any children recruited/abducted during the attack?",
             "option_strings_text_all" => "Yes\nNo",
             "help_text_all" => "If 'Yes', please fill in/refer to the corresponding 'Violation' section"
            }),
  Field.new({"name" => "facility_management",
             "type" => "select_box",
             "display_name_all" => "What organization manages this facilty?",
             "visible" => false,
             "option_strings_text_all" =>
                                    ["Government",
                                     "NGO",
                                     "Community",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "facility_attack_separator",
             "type" => "separator",
             "display_name_all" => "Physical impact of the attack"
            }),
  Field.new({"name" => "facility_impact",
             "type" => "select_box",
             "display_name_all" => "Type and extent of physical impact",
             "option_strings_text_all" =>
                                    ["Total Destruction",
                                     "Serious Damage",
                                     "Minor Damage",
                                     "None"].join("\n")
            }),
  Field.new({"name" => "facility_closed",
             "type" => "radio_button",
             "display_name_all" => "Was the facility closed as a result of the attack?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "facility_closed_duration",
             "type" => "numeric_field",
             "display_name_all" => "For how long? (days)"
            }),
  Field.new({"name" => "duration_of_military_occupation",
             "type" => "date_range",
             "display_name_all" => "Duration of military use of hospital(s)"
            }),
  Field.new({"name" => "estimated_military_occupation",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Are those dates estimated?",
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
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
  :fields => (attack_on_hospitals_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Attack on hospitals Subform",
  "description_all" => "Nested Attack on hospitals Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type"]
})

attack_on_hospitals_fields = [
  Field.new({"name" => "attack_on_hospitals",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_hospitals_subform_section.unique_id,
             "display_name_all" => "Attack on hospitals",
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
  "name_all" => "Attack on hospitals",
  "description_all" => "Attack on hospitals"
})
