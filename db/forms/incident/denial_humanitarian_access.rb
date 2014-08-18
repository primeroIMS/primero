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
             "option_strings_text_all" =>
                                    ["National",
                                     "International",
                                     "N/A",
                                     "NGO",
                                     "United Nations Agencies",
                                     "Red Cross / Crescent",
                                     "Other"].join("\n")
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
  Field.new({"name" => "violation_boys",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: boys",
             "autosum_group" => "denial_humanitarian_access_number_of_survivors"
            }),
  Field.new({"name" => "violation_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: girls",
             "autosum_group" => "denial_humanitarian_access_number_of_survivors"
            }),
  Field.new({"name" => "violation_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: unknown",
             "autosum_group" => "denial_humanitarian_access_number_of_survivors"
            }),
  Field.new({"name" => "violation_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of total survivors",
             "autosum_total" => true,
             "autosum_group" => "denial_humanitarian_access_number_of_survivors"
            }),
  Field.new({"name" => "denial_total_affected_adults",
             "type" => "numeric_field", 
             "display_name_all" => "Adults"
            }),
  Field.new({"name" => "denial_total_affected",
             "type" => "numeric_field", 
             "display_name_all" => "Population Affected by Service Disruption"
            })
]

denial_humanitarian_access_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 2,
  :unique_id=>"denial_humanitarian_access_section",
  :parent_form=>"incident",
  "editable"=>true,
  :fields => denial_humanitarian_access_section_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Human Impact of Attack Subform",
  "description_all" => "Nested Human Impact of Attack Subform",
  "collapsed_fields" => ["denial_method"]
})

denial_humanitarian_access_fields = [
  ##Subform##
  Field.new({"name" => "denial_humanitarian_access_section",
             "type" => "subform", 
             "editable" => true,
             "subform_section_id" => denial_humanitarian_access_section.id,
             "display_name_all" => "Denial of Humanitarian Access"
            })
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "denial_humanitarian_access",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => denial_humanitarian_access_fields,
  :perm_enabled => true,
  "name_all" => "Denial of Humanitarian Access",
  "description_all" => "Denial of Humanitarian Access"
})
