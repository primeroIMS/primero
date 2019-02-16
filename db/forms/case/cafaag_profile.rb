caafag_profile_fields = [
  Field.new({"name" => "un_ddr_no",
             "type" => "text_field",
             "display_name_en" => "UN DDR Number"
            }),
  Field.new({"name" => "cafaag_name_armed_group",
             "type" => "select_box",
             "display_name_en" => "With which Armed Force or Armed Group was the child associated?",
             "option_strings_text_en" => [
               { id: 'government_force', display_text: "Government Force" },
               { id: 'ltte', display_text: "LTTE" },
               { id: 'ml24', display_text: "Ml24" },
               { id: 'non_government_forces', display_text: "Non government forces" },
               { id: 'none', display_text: "None" },
               { id: 'other_paramilitary_group', display_text: "Other Paramilitary group" },
               { id: 'sf', display_text: "SF" },
               { id: 'sla', display_text: "SLA" },
               { id: 'spla', display_text: "SPLA" },
               { id: 'tmvp', display_text: "TMVP" },
               { id: 'unknown', display_text: "Unknown" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "cafaag_enrollment_reason_not_forced",
             "type" => "select_box",
             "display_name_en" => "If not forced, what was the main reason why the child became involved in the Armed Force or Armed Group? (type of recruitment)",
             "option_strings_text_en" => [
               { id: 'voluntary_enrollment', display_text: "Voluntary enrollment" },
               { id: 'family_problems_abuse', display_text: "Family problems/abuse" },
               { id: 'financial_reasons', display_text: "Financial reasons" },
               { id: 'lack_of_access_to_essential_services', display_text: "Lack of access to essential services" },
               { id: 'poverty', display_text: "Poverty" },
               { id: 'wanted_to_fight_for_their_beliefs', display_text: "Wanted to fight for their beliefs" },
               { id: 'wanted_to_follow_friends', display_text: "Wanted to follow friends" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "cafaag_enrollment_reason_not_forced_text",
             "type" => "text_field",
             "display_name_en" => "Other reason for enrollment"
            }),
  Field.new({"name" => "cafaag_name_militaryunit",
             "type" => "text_field",
             "display_name_en" => "Name of Military Unit"
            }),
  Field.new({"name" => "cafaag_name_commander",
             "type" => "text_field",
             "display_name_en" => "Commander's Name"
            }),
  Field.new({"name" => "address_cafaag_militaryunit",
             "type" => "textarea",
             "display_name_en" => "Area of Military Unit"
            }),
  Field.new({"name" => "location_cafaag_militaryunit",
             "type" => "select_box",
             "display_name_en" => "Location of Military Unit",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cafaag_child_role",
             "type" => "select_box",
             "display_name_en" => "What was the main role of the child?",
             "option_strings_text_en" => [
               { id: 'combat', display_text: "Combat" },
               { id: 'combat_support', display_text: "Combat support" },
               { id: 'combattant', display_text: "Combattant" },
               { id: 'commander_ranked_position', display_text: "Commander/Ranked position" },
               { id: 'girlfriend', display_text: "Girlfriend" },
               { id: 'girlfriend_wife_forced_sexual_activity', display_text: "Girlfriend/""Wife""/Forced Sexual Activity" },
               { id: 'non_combat', display_text: "Non-Combat" },
               { id: 'non_combat_cook_guide_porter_etc', display_text: "Non-Combat (cook, guide, porter, etc.)" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "cafaag_child_owned_weapon",
             "type" => "select_box",
             "display_name_en" => "Did the child own/use a weapon",
             "option_strings_source" => "lookup lookup-yes-no-unknown"
            }),
  Field.new({"name" => "cafaag_weapon_type",
             #TODO (get values from MRM)
             "type" => "text_field",
             "display_name_en" => "Type of Weapon"
            }),
  Field.new({"name" => "cafaag_date_child_join",
             "type" => "date_range",
             "display_name_en" => "When did the child join the Armed Force or Armed Group?"
            }),
  Field.new({"name" => "address_cafaag_registration",
             "type" => "textarea",
             "display_name_en" => "Place of registration (Village/Address/Area) - Address"
            }),
  Field.new({"name" => "address_cafaag_mobilization",
             "type" => "textarea",
             "display_name_en" => "Area of Mobilization"
            }),
  Field.new({"name" => "location_cafaag_mobilization",
             "type" => "select_box",
             "display_name_en" => "Location of Mobilization",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cafaag_date_child_leave",
             "type" => "date_range",
             "display_name_en" => "When did the child leave the Armed Force or Armed Group?"
            }),
  Field.new({"name" => "cafaag_how_did_child_leave_armed_group",
             "type" => "select_box",
             "display_name_en" => "How did the child leave the Armed Force or Armed Group?",
             "option_strings_text_en" => [
               { id: 'captured', display_text: "Captured" },
               { id: 'deceased', display_text: "Deceased" },
               { id: 'dissolution_of_the_group', display_text: "Dissolution of the group" },
               { id: 'escape_runaway', display_text: "Escape/Runaway" },
               { id: 'formal_ddr_program', display_text: "Formal DDR program" },
               { id: 'locally_negotiated_demobilization', display_text: "Locally negotiated demobilization" },
               { id: 'normal', display_text: "Normal" },
               { id: 'other', display_text: "Other (Please specify)" },
               { id: 'released_handover_to_family', display_text: "Released/Handover to family" },
               { id: 'released_handover_to_government', display_text: "Released/Handover to government" },
               { id: 'released_handover_to_organization', display_text: "Released/Handover to Organization" },
               { id: 'runaway', display_text: "Runaway" },
               { id: 'surrendered', display_text: "Surrendered" },
               { id: 'unicef_ddr', display_text: "UNICEF DDR" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "cafaag_how_child_left_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "address_cafaag_demobilization",
             "type" => "textarea",
             "display_name_en" => "Address of Demobilization"
            }),
  Field.new({"name" => "location_cafaag_demobilization",
             "type" => "select_box",
             "display_name_en" => "Location of Demobilization",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cafaag_demobilization_papers_served",
             "type" => "select_box",
             "display_name_en" => "Has the Child been served any demobilization papers?",
             "option_strings_source" => "lookup lookup-yes-no-unknown"
            }),
  Field.new({"name" => "cafaag_reason_for_release_from_military",
             "type" => "select_box",
             "display_name_en" => "Reason for release from Military",
             "option_strings_text_en" => [
               { id: 'captured', display_text: "Captured" },
               { id: 'deceased', display_text: "Deceased" },
               { id: 'dissolution_of_the_group', display_text: "Dissolution of the group" },
               { id: 'formal_ddr_program', display_text: "Formal DDR program" },
               { id: 'released_handover_to_government', display_text: "Released/Handover to government" },
               { id: 'released_handover_to_organization', display_text: "Released/Handover to organization" },
               { id: 'released_handover_to_family', display_text: "Released/Handover to family" },
               { id: 'runaway', display_text: "Runaway" },
               { id: 'surrendered', display_text: "Surrendered" }
             ].map(&:with_indifferent_access)
            })
]

FormSection.create_or_update_form_section({
  unique_id: "caafag_profile",
  parent_form: "case",
  visible: true,
  order_form_group: 70,
  order: 50,
  order_subform: 0,
  form_group_id: "assessment",
  fields: caafag_profile_fields,
  editable: true,
  name_en: "CAAFAG Profile",
  description_en: "CAAFAG Profile"
})