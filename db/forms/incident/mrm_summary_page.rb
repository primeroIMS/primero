killing_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "killing_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "cause",
             "type" => "select_box",
             "visible" => false,
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
  Field.new({"name" => "cause",
             "type" => "select_box",
             "visible" => false,
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
             "multi_select" => true,
             "visible" => false,
             "display_name_all" => "What factors contributed towards the recruitment of the child by the armed group?",
             "option_strings_text_all" => [
                { id: 'abduction', display_text: "Abduction" },
                { id: 'conscription', display_text: "Conscription" },
                { id: 'intimidation', display_text: "Intimidation" },
                { id: 'lack_of_basic_services', display_text: "Lack of basic services" },
                { id: 'access_to_security', display_text: "Access to security" },
                { id: 'financial_reasons', display_text: "Financial reasons" },
                { id: 'family_problems_abuse', display_text: "Family problems / abuse" },
                { id: 'to_join_follow_friends', display_text: "To join / f/ollow friends" },
                { id: 'idealism', display_text: "Idealism" },
                { id: 'to_see_revenge', display_text: "To seek revenge" },
                { id: 'other', display_text: "Other" },
                { id: 'unknown', display_text: "Unknown" }
              ]
             })
]

deprivation_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "deprivation_number_of_victims",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "deprivation_grounds",
             "type" => "select_box",
             "visible" => false,
             "display_name_all" => "Cause",
             "option_strings_text_all" =>
                                    ["Security-related",
                                     "Religious/ethnic affiliation"].join("\n")
            })
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

other_violation_section_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of victims",
         "autosum_group" => "other_violation_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "violation_other_type",
             "type" => "select_box",
             "visible" => false,
             "display_name_all" => "Other Violation Type",
             "option_strings_text_all" =>
                                    ["Forced Displacement",
                                     "Denial of Civil Rights",
                                     "Use of Children for Propaganda",
                                     "Access Violations"].join("\n")
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
  "collapsed_fields" => ["cause"],
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
  "collapsed_fields" => ["cause"],
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

deprivation_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 30,
  :order_subform => 1,
  :unique_id => "deprivation_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => deprivation_subform_fields,
  "name_all" => "Violation Deprivation Summary",
  "description_all" => "Violation Deprivation Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["deprivation_grounds"],
  "shared_subform" => "deprivation",
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

other_violation_subform_section = FormSection.create_or_update_form_section({
  :unique_id => "other_violation_summary",
  :parent_form=>"incident",
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 90,
  :order_subform => 1,
  "editable" => true,
  :fields => other_violation_section_fields,
  "name_all" => "Violation Other Violations Summary",
  "description_all" => "Violation Other Violations Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["violation_other_type"],
  "shared_subform" => "other_violation",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

mrm_summary_page_fields = [
  Field.new({"name" => "incident_total_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "incident_number_of_victims_survivors",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of Incident",
             "editable" => false
            }),
  Field.new({"name" => "killing_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.unique_id,
             "display_name_all" => "Killing",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "maiming_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "recruitment_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.unique_id,
             "display_name_all" => "Recruitment and/or use of children",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "deprivation_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => deprivation_subform_section.unique_id,
             "display_name_all" => "Recruitment and/or use - Deprivation of liberty due to alleged association with a party to the conflict",
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
  Field.new({"name" => "denial_humanitarian_access_summary",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.unique_id,
             "display_name_all" => "Denial of humanitarian access for children",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "other_violation_summary",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => other_violation_subform_section.unique_id,
             "display_name_all" => "Other Violations",
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
  :form_group_keyed => true,
  :form_group_name => "Summary Page",
  "editable" => true,
  :fields => mrm_summary_page_fields,
  "name_all" => "Summary Page",
  "description_all" => "Summary Page"
})
