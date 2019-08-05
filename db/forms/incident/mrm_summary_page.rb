killing_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "killing_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "weapon_type",
             "type" => "select_box",
             "display_name_all" => "Type of weapon used",
             "option_strings_source" => "lookup WeaponType"
            })
]

maiming_subform_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of victims",
         "autosum_group" => "maiming_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "weapon_type",
             "type" => "select_box",
             "display_name_all" => "Type of weapon used",
             "option_strings_source" => "lookup WeaponType"
            })
]

recruitment_subform_fields = [
  Field.new({"name" => "violation_tally",
             "type" => "tally_field",
             "display_name_all" => "Number of victims",
             "autosum_group" => "recruitment_number_of_survivors",
             "tally_all" => ['boys', 'girls', 'unknown'],
             "autosum_total" => true,
      }),
  Field.new({"name" => "factors_of_recruitment",
             "type" => "select_box",
             "visible" => false,
             "display_name_all" => "What factors contributed to the recruitment and/or use of the child(ren) by the armed group?",
             "option_strings_text_all" => ["Abduction", "Conscription", "Family/community pressure", "Family problems/abuse",
                                           "Financial reasons", "Idealism", "Intimidation", "Lack of basic services",
                                           "Security concerns", "To join/follow friends", "To seek revenge", "Unknown", "Other"].join("\n")
            }),
]

sexual_violence_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "sexual_violence_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "sexual_violence_type",
             "type" => "select_box",
             "multi_select" => true,
             "visible" => false,
             "display_name_all" => "Type of Violence",
             "option_strings_text_all" => [
                { id: 'rape', display_text: "Rape and/or other forms of sexual violence" },
                { id: 'sexual_assault', display_text: "Sexual assault" },
                { id: 'forced_marriage', display_text: "Forced marriage" },
                { id: 'mutilation', display_text: "Mutilation" },
                { id: 'forced_sterilization', display_text: "Forced sterilization" },
                { id: 'other', display_text: "Other" }
              ]
            })
]

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
             "visible" => false,
             "display_name_all" => "Category",
             "option_strings_text_all" => ["Extortion",
                                           "Forced marriage",
                                           "Indoctrination",
                                           "Intimidation",
                                           "Killing/Maiming",
                                           "Punishment",
                                           "Recruitment and use",
                                           "Rape and/or other forms of sexual violence",
                                           "Unknown",
                                           "Other"].join("\n")
            })
]

attack_on_subform_fields = [
  Field.new({"name" => "violation_killed_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children killed",
       "autosum_group" => "attack_number_of_children_killed",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children injured",
       "autosum_group" => "attack_number_of_children_injured",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "facility_attack_type",
             "type" => "select_box",
             "multi_select" => true,
             "visible" => false,
             "display_name_all" => "Type of education or health-related violation",
             "option_strings_text_all" => ["Attack on school(s)", "Attack on education personnel",
                                           "Threats of attack on school(s)", "Other interference with education",
                                           "Attack on hospital(s)", "Attack on medical personnel",
                                           "Threats of attack on hospital(s)", "Military use of hospitals",
                                           "Other interference with health care"].join("\n"),
             "guiding_questions" => "See  'Protect Schools+Hospitals - Guidance Note on Security Council Resolution 1998', "\
                                    "2014 (available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf), page 6."
            }),
]

military_use_subform_fields = [
    Field.new({"name" => "number_children_service_disruption",
               "type" => "tally_field",
               "display_name_all" => "Number of children affected by service disruption",
               "autosum_group" => "military_number_of_children_service_disruption",
               "tally_all" => ['boys', 'girls', 'unknown'],
               "autosum_total" => true,
              }),
    Field.new({"name" => "military_use_type",
               "type" => "select_box",
               "display_name_all" => "Type of violation",
               "option_strings_text_all" => ["Military use of school", "Military use of hospital"].join("\n")
              }),
]

denial_humanitarian_access_section_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "denial_humanitarian_access_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "denial_method",
             "type" => "select_box",
             "visible" => false,
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
            })
]

killing_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 10,
  :order_subform => 1,
  :unique_id => "killing_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => killing_subform_fields,
  "name_all" => "Violation Killing Summary",
  "description_all" => "Violation Killing Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["weapon_type"],
  "shared_subform" => "killing",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

maiming_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 20,
  :order_subform => 1,
  :unique_id => "maiming_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => maiming_subform_fields,
  "name_all" => "Violation Maiming Summary",
  "description_all" => "Violation Maiming Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["weapon_type"],
  "shared_subform" => "maiming",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

recruitment_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 1,
  :unique_id => "recruitment_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => recruitment_subform_fields,
  "name_all" => "Violation Recruitment Summary",
  "description_all" => "Violation Recruitment Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["factors_of_recruitment"],
  "shared_subform" => "recruitment",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

sexual_violence_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "sexual_violence_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => sexual_violence_subform_fields,
  "name_all" => "Violation Rape and/or other forms of sexual violence Summary",
  "description_all" => "Violation Rape and/or other forms of sexual violence Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["sexual_violence_type"],
  "shared_subform" => "sexual_violence",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

abduction_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 50,
  :order_subform => 1,
  :unique_id => "abduction_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => abduction_subform_fields,
  "name_all" => "Violation Abduction Summary",
  "description_all" => "Violation Abduction Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["abduction_purpose"],
  "shared_subform" => "abduction",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

attack_on_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 1,
  :unique_id => "attack_on_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => attack_on_subform_fields,
  "name_all" => "Violation Attacks on schools and/or hospitals",
  "description_all" => "Violation Attacks on schools and/or hospitals",
  :initial_subforms => 1,
  "collapsed_fields" => ["facility_attack_type"],
  "shared_subform" => "attack_on",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

military_use_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 1,
  :unique_id => "military_use_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => military_use_subform_fields,
  "name_all" => "Violation Military use of schools and/or hospitals",
  "description_all" => "Violation Military use of schools and/or hospitals",
  :initial_subforms => 1,
  "collapsed_fields" => ["military_use_type"],
  "shared_subform" => "military_use",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

denial_humanitarian_access_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 40,
  :order => 80,
  :order_subform => 2,
  :unique_id=>"denial_humanitarian_access_summary",
  :parent_form=>"incident",
  "editable"=>true,
  :fields => denial_humanitarian_access_section_fields,
  "name_all" => "Violation Human Impact of Attack Summary",
  "description_all" => "Violation Human Impact of Attack Summary",
  "collapsed_fields" => ["denial_method"],
  :initial_subforms => 1,
  "shared_subform" => "denial_humanitarian_access",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

mrm_summary_page_fields = [
  Field.new({"name" => "summary_of_incident",
             "type" => "separator",
             "display_name_all" => "Summary of the Incident"
            }),
  Field.new({"name" => "incident_total_tally",
             "type" => "tally_field",
             "display_name_all" => "Number of victims",
             "autosum_group" => "incident_number_of_victims_survivors",
             "tally_all" => ['boys', 'girls', 'unknown'],
             "autosum_total" => true,
            }),
  Field.new({"name" => "date_of_incident",
             "type" => "date_range",
             "display_name_all" => "Date of the incident",
             "disabled" => true
            }),
  Field.new({"name" => "incident_location",
              "type" => "select_box",
              "display_name_all" => "Incident location",
              "option_strings_source" => "Location",
              "searchable_select" => true
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of Incident",
             "editable" => false
            }),
  Field.new({"name" => "incident_update",
              "type" => "textarea",
              "display_name_all" => "Update of Incident"
            }),
  Field.new({"name" => "killing_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.unique_id,
             "display_name_all" => "Killing of Children",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "maiming_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming of Children",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "recruitment_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.unique_id,
             "display_name_all" => "Recruitment and/or use of children",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "sexual_violence_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.unique_id,
             "display_name_all" => "Rape and/or other forms of sexual violence",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "abduction_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => abduction_subform_section.unique_id,
             "display_name_all" => "Abduction",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "attack_on_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_subform_section.unique_id,
             "display_name_all" => "Attacks on schools and/or hospitals",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "military_use_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => military_use_subform_section.unique_id,
             "display_name_all" => "Military use of schools and/or hospitals",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "denial_humanitarian_access_summary",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.unique_id,
             "display_name_all" => "Denial of humanitarian access for children",
             "expose_unique_id" => true
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "mrm_summary_page",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 1,
  :order => 1,
  :order_subform => 0,
  :form_group_keyed => false,
  :form_group_name => "Summary of the Incident",
  "editable" => true,
  :fields => mrm_summary_page_fields,
  "name_all" => "Summary of the Incident",
  "description_all" => "Summary of the Incident"
})
