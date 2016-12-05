require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

denial_humanitarian_access_section_fields = [
  Field.new({"name" => "denial_method",
             "type" => "select_box",
             "display_name_all" => "Method(s) used to deny humanitarian access",
             "option_strings_text_all" =>
                                    ["Abduction of humanitarian personnel",
                                     "Besiegement",
                                     "Entry restrictions for humanitarian personnel",
                                     "Import restrictions for relief goods",
                                     "Property damage/theft",
                                     "Restrictions of beneficiaries' access",
                                     "Threats/violence against beneficiaries",
                                     "Threats/violence against humanitarian personnel",
                                     "Travel restrictions in country",
                                     "Vehicle hijacking",
                                     "Other"].join("\n"),
            }),
  Field.new({"name" => "denial_method_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide further details "
            }),
  Field.new({"name" => "denial_organizations_affected",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of organization(s) affected",
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
             "visible" => false,
             "display_name_all" => "Impact on Humanitarian Personnel/Property"
            }),
  Field.new({"name" => "denial_personnel_killed",
             "type" => "numeric_field",
             "display_name_all" => "Number of personnel killed"
            }),
  Field.new({"name" => "denial_personnel_injured",
             "type" => "numeric_field",
             "display_name_all" => "Number of personnel injured"
            }),
  Field.new({"name" => "denial_personnel_abducted",
             "type" => "numeric_field",
             "display_name_all" => "Number of personnel abducted"
            }),
  Field.new({"name" => "denial_personnel_threatened",
             "type" => "numeric_field",
             "display_name_all" => "Number of personnel threatened"
            }),
  Field.new({"name" => "denial_vehicles_hijacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of vehicles hijacked"
            }),
  Field.new({"name" => "denial_value_property",
             "type" => "numeric_field",
             "display_name_all" => "Value of property stolen/damaged ",
             "help_text_all" => "Specify in local currency or USD"
            }),
  Field.new({"name" => "human_impact_of_attack_section",
             "type" => "separator",
             "display_name_all" => "Human impact of the attack  "
            }),
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children affected by access restriction/service disruption",
       "autosum_group" => "denial_humanitarian_access_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "denial_total_affected_adults",
             "type" => "numeric_field",
             "display_name_all" => "Number of adults affected by access restriction/service disruption"
            }),
  Field.new({"name" => "denial_total_affected",
             "type" => "numeric_field",
             "display_name_all" => "Population Affected by Service Disruption",
             "visible" => false
            }),
  Field.new({"name" => "denial_population_affected",
             "type" => "textarea",
             "display_name_all" => "Population affected by access restriction/service disruption",
             "help_text_all" => "E.g. particular communities/sub-groups (religious, ethnic, IDP/refugee etc.)"
            }),
  Field.new({"name" => "types_of_aid_disrupted_denial",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of aid/service denied/disrupted.",
             "help_text_all" => "Select all that applies",
             "option_strings_text_all" => ["Food",
                                           "Medical care",
                                           "Medical equipment",
                                           "School supplies",
                                           "WASH",
                                           "Other essential supplies."].join("\n")
            }),
  Field.new({"name" => "denial_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes  "
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
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
  :fields => (denial_humanitarian_access_section_fields + MRM_VERIFICATION_FIELDS),
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
             "display_name_all" => "Denial of humanitarian access for children",
             "expose_unique_id" => true,
             "guiding_questions" => "Denial of humanitarian access to children is the intentional deprivation of or impediment to the passage of humanitarian assistance indispensible to children’s survival, by the parties to the conflict, including wilfully impeding relief supplies as provided for under the Geneva Conventions; and significant
impediments to the ability of humanitarian or other relevant actors to access and assist affected children, in situations of armed conflict.
The denial should be considered in terms of children’s access to assistance as well as humanitarian agencies’ ability to access vulnerable populations, including children. (see MRM Fiedl Manual, page 10). Examples of restrictions of access may include road blocks or checkpoints.Examples of entry restrictions for humanitarian personnel may include deliberate delays in visa issuance or formal registrations, and other bureaucratic impediments.Import restrictions for relief goods may include obstructive custom formalities, regulations and fees.Examples of travel restrictions in country may include systematic denial of, or delays in authorizing, humanitarian convoys."
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
  "name_all" => "Denial of humanitarian access for children",
  "description_all" => "Denial of humanitarian access for children"
})
