killing_subform_fields = [
  Field.new({"name" => "violation_tally",
           "type" => "tally_field",
           "display_name_all" => "Number of victims",
           "autosum_group" => "killing_number_of_victims",
           "tally" => ['boys', 'girls', 'unknown'],
           "autosum_total" => true,
          }),
  Field.new({"name" => "kill_cause_of_death",
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
         "tally" => ['boys', 'girls', 'unknown'],
         "autosum_total" => true,
        }),
  Field.new({"name" => "maim_cause_of",
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
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "factors_of_recruitment",
             "type" => "select_box",
             "multi_select" => true,
             "visible" => false,
             "display_name_all" => "What factors contributed towards the recruitment of the child by the armed group?",
             "option_strings_text_all" =>
                                    ["Abduction",
                                     "Conscription",
                                     "Intimidation",
                                     "Lack of Basic Services",
                                     "Access to Security",
                                     "Financial Reasons",
                                     "Family Problems / Abuse",
                                     "To Join / Follow Friends",
                                     "Idealism",
                                     "To Seek Revenge",
                                     "Other",
                                     "Unknown"].join("\n")
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
  "collapsed_fields" => ["kill_cause_of_death"],
  "shared_subform" => "killing",
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
  "collapsed_fields" => ["maim_cause_of"],
  "shared_subform" => "maiming",
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
  "is_summary_section" => true
})


mrm_summary_page_fields = [
  Field.new({"name" => "killing_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => killing_subform_section.unique_id,
             "display_name_all" => "Killing"
            }),
  Field.new({"name" => "maiming_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => maiming_subform_section.unique_id,
             "display_name_all" => "Maiming"
            }),
  Field.new({"name" => "recruitment_summary",
             "type" => "subform", "editable" => true,
             "subform_section_id" => recruitment_subform_section.unique_id,
             "display_name_all" => "Recruitment"
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