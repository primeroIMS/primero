attack_on_schools_subform_fields = [
  Field.new({"name" => "site_number_attacked",
             "type" => "numeric_field",
             "display_name_all" => "Number of Sites Attacked"
            }),
  Field.new({"name" => "site_attack_type",
             "type" => "select_box",
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
            }),
  Field.new({"name" => "site_school_type",
             "type" => "select_box",
             "display_name_all" => "Type of School",
             "option_strings_text_all" =>
                                    ["Early Childhood",
                                     "Primary",
                                     "Secondary",
                                     "Vocational",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "site_school_type_classification",
             "type" => "select_box",
             "display_name_all" => "Classification",
             "option_strings_text_all" => "Formal\nInformal"
            }),
  Field.new({"name" => "site_school_type_relgious",
             "type" => "select_box",
             "display_name_all" => "Religious or secular school?",
             "option_strings_text_all" => "Secular\nReligious"
            }),
  Field.new({"name" => "site_school_type_details",
             "type" => "textarea",
             "display_name_all" => "Details"
            }),
  Field.new({"name" => "school_name",
             "type" => "text_field",
             "display_name_all" => "School Name"
            }),
  Field.new({"name" => "site_number_of_students",
             "type" => "numeric_field",
             "display_name_all" => "Number of Students"
            }),
  Field.new({"name" => "site_students_sex",
             "type" => "select_box",
             "display_name_all" => "Sex Of Students",
             "option_strings_text_all" =>
                                    ["Male",
                                     "Female",
                                     "Mixed",
                                     "Unknown"].join("\n")
            }),
  Field.new({"name" => "human_impact_of_attack_section",
             "type" => "separator",
             "display_name_all" => "Human Impact of Attack"
            }),
  Field.new({"name" => "violation_killed_attack_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children killed",
       "autosum_group" => "sexual_violence_number_of_children_killed",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "violation_injured_attack_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of children injured",
       "autosum_group" => "sexual_violence_number_of_children_injured",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "facility_staff_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Killed"
            }),
  Field.new({"name" => "facility_staff_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Injured"
            }),
  Field.new({"name" => "facility_other_adults_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Killed"
            }),
  Field.new({"name" => "facility_other_adults_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Injured"
            }),
  Field.new({"name" => "number_children_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Affected by Service Disruption"
            }),
  Field.new({"name" => "number_adults_service_disruption",
             "type" => "numeric_field",
             "display_name_all" => "Number of Adults Affected by Service Disruption"
            }),
  Field.new({"name" => "number_children_recruited",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Recruited During Attack"
            }),
  Field.new({"name" => "facility_management",
             "type" => "select_box",
             "display_name_all" => "What organization manages this facility?",
             "option_strings_text_all" =>
                                    ["Government",
                                     "NGO",
                                     "Community",
                                     "Other"].join("\n")
             }),
  Field.new({"name" => "facility_attack_objective",
             "type" => "textarea",
             "display_name_all" => "What was the main objective of the \"attack\"?",
            }),
  Field.new({"name" => "facility_impact",
             "type" => "select_box",
             "display_name_all" => "Physical Impact of Attack",
             "option_strings_text_all" =>
                                    ["Total Destruction",
                                     "Serious Damage",
                                     "Minor Damage",
                                     "None"].join("\n")
             }),
  Field.new({"name" => "facility_closed",
             "type" => "radio_button",
             "display_name_all" => "Was Facility Closed As A Result?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "facility_closed_duration",
             "type" => "numeric_field",
             "display_name_all" => "For How Long? (Days)"
            })
]

attack_on_schools_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 1,
  :unique_id => "attack_on_schools",
  :parent_form=>"incident",
  "editable" => true,
  :fields => attack_on_schools_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Attack on Schools Subform",
  "description_all" => "Nested Attack on Schools Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type"]
})

attack_on_schools_fields = [
  Field.new({"name" => "attack_on_schools",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_schools_subform_section.unique_id,
             "display_name_all" => "Attack on Schools"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "attack_on_schools_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 60,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => attack_on_schools_fields,
  :perm_enabled => true,
  "name_all" => "Attack on Schools",
  "description_all" => "Attack on Schools"
})
