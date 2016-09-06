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
             "display_name_all" => "Cause",
             "option_strings_text_all" =>
                                    ["IED",
                                     "IED - Command Activated",
                                     "UXO/ERW",
                                     "Landmines",
                                     "Cluster Munitions",
                                     "Shooting",
                                     "Artillery - Shelling/Mortar Fire",
                                     "Artillery - Cluster Munitions",
                                     "Aerial Bombardment",
                                     "White Weapon Use",
                                     "Gas",
                                     "Suicide Attack Victim",
                                     "Perpetrator of Suicide Attack",
                                     "Cruel and Inhumane Treatment",
                                     "Summary and Arbitrary Execution/ Extra Judicial Killing"].join("\n")
            })
]

maiming_subform_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of survivors",
         "autosum_group" => "maiming_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "cause",
             "type" => "select_box",
             "visible" => false,
             "display_name_all" => "Cause",
             "option_strings_text_all" =>
                                    ["IED",
                                     "IED - Command Activated",
                                     "UXO/ERW",
                                     "Landmines",
                                     "Cluster Munitions",
                                     "Shooting",
                                     "Artillery - Shelling/Mortar Fire",
                                     "Artillery - Cluster Munitions",
                                     "Aerial Bombardment",
                                     "White Weapon Use",
                                     "Gas",
                                     "Suicide Attack Victim",
                                     "Perpetrator of Suicide Attack",
                                     "Cruel and Inhumane Treatment"].join("\n")
            })
]

recruitment_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
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
                { id: 'lack_of_basic_services', display_text: "Lack of Basic Services" },
                { id: 'access_to_security', display_text: "Access to Security" },
                { id: 'financial_reasons', display_text: "Financial Reasons" },
                { id: 'family_problems_abuse', display_text: "Family Problems / Abuse" },
                { id: 'to_join_follow_friends', display_text: "To Join / Follow Friends" },
                { id: 'idealism', display_text: "Idealism" },
                { id: 'to_see_revenge', display_text: "To Seek Revenge" },
                { id: 'other', display_text: "Other" },
                { id: 'unknown', display_text: "Unknown" }
              ]
             })
]

sexual_violence_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
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
                { id: 'rape', display_text: "Rape" },
                { id: 'sexual_assault', display_text: "Sexual Assault" },
                { id: 'forced_marriage', display_text: "Forced Marriage" },
                { id: 'mutilation', display_text: "Mutilation" },
                { id: 'forced_sterilization', display_text: "Forced Sterilization" },
                { id: 'other', display_text: "Other" }
              ]
            })
]

abduction_subform_fields = [
  Field.new({"name" => "violation_tally",
         "type" => "tally_field",
         "display_name_all" => "Number of survivors",
         "autosum_group" => "abduction_number_of_survivors",
         "tally_all" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "abduction_purpose",
             "type" => "select_box",
             "visible" => false,
             "display_name_all" => "Category",
             "option_strings_text_all" => ["Child Recruitment",
                                           "Child Use",
                                           "Sexual Violence",
                                           "Political Indoctrination",
                                           "Hostage (Intimidation)",
                                           "Hostage (Extortion)",
                                           "Unknown",
                                           "Other"].join("\n")
            })
]

attack_on_schools_subform_fields = [
  Field.new({"name" => "violation_killed_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children killed",
       "autosum_group" => "sexual_violence_number_of_children_killed",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children injured",
       "autosum_group" => "sexual_violence_number_of_children_injured",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "site_attack_type",
             "type" => "select_box",
             "visible" => false,
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
            })
]

attack_on_hospitals_subform_fields = [
  Field.new({"name" => "violation_killed_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children killed",
       "autosum_group" => "attack_on_hospitals_number_of_children_killed",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children injured",
       "autosum_group" => "attack_on_hospitals_number_of_children_injured",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "site_attack_type",
             "type" => "select_box",
             "visible" => false,
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
            })
]

denial_humanitarian_access_section_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of survivors",
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
         "display_name_all" => "Number of survivors",
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
  "name_all" => "Violation Sexual Violence Summary",
  "description_all" => "Violation Sexual Violence Summary",
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

attack_on_schools_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 1,
  :unique_id => "attack_on_schools_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => attack_on_schools_subform_fields,
  "name_all" => "Violation Attack on Schools Summary",
  "description_all" => "Violation Attack on Schools Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type"],
  "shared_subform" => "attack_on_schools",
  "shared_subform_group" => "Violations",
  "is_summary_section" => true
})

attack_on_hospitals_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 1,
  :unique_id => "attack_on_hospitals_summary",
  :parent_form=>"incident",
  "editable" => true,
  :fields => attack_on_hospitals_subform_fields,
  "name_all" => "Violation Attack on Hospitals Summary",
  "description_all" => "Violation Attack on Hospitals Summary",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type"],
  "shared_subform" => "attack_on_hospitals",
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
           "display_name_all" => "Incident Total Victims/Survivors",
           "autosum_group" => "incident_number_of_victims_survivors",
           "tally_all" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of Incident",
             "editable" => false,
             "disabled" => true
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
             "display_name_all" => "Recruitment",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "sexual_violence_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.unique_id,
             "display_name_all" => "Sexual Violence",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "abduction_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => abduction_subform_section.unique_id,
             "display_name_all" => "Abduction",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "attack_on_schools_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_schools_subform_section.unique_id,
             "display_name_all" => "Attack on Schools",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "attack_on_hospitals_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_hospitals_subform_section.unique_id,
             "display_name_all" => "Attack on Hospitals",
             "expose_unique_id" => true
            }),
  Field.new({"name" => "denial_humanitarian_access_summary",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.unique_id,
             "display_name_all" => "Denial of Humanitarian Access",
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
