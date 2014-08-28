attack_on_hospitals_subform_fields = [
  Field.new({"name" => "site_number_attacked_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Sites Attacked"
            }),
  Field.new({"name" => "site_attack_type_hospital",
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
  Field.new({"name" => "hospital_name",
             "type" => "text_field",
             "display_name_all" => "Hospital Name"
            }),
  Field.new({"name" => "site_number_of_patients",
             "type" => "numeric_field",
             "display_name_all" => "Number of Patients"
            }),
  Field.new({"name" => "human_impact_attack_hospital_section",
             "type" => "separator",
             "display_name_all" => "Human Impact of Attack"
            }),
  Field.new({"name" => "violation_boys_killed_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Boys Killed",
             "autosum_group" => "attack_on_hospitals_number_of_children_killed"
            }),
  Field.new({"name" => "violation_girls_killed_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Girls Killed",
             "autosum_group" => "attack_on_hospitals_number_of_children_killed"
            }),
  Field.new({"name" => "violation_unknown_killed_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Unknown Children Killed",
             "autosum_group" => "attack_on_hospitals_number_of_children_killed"
            }),
  Field.new({"name" => "violation_total_killed_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Total Children Killed",
             "autosum_total" => true,
             "autosum_group" => "attack_on_hospitals_number_of_children_killed"
            }),
  Field.new({"name" => "violation_boys_injured_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Boys Injured",
             "autosum_group" => "attack_on_hospitals_number_of_children_injured"
            }),
  Field.new({"name" => "violation_girls_injured_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Girls Injured",
             "autosum_group" => "attack_on_hospitals_number_of_children_injured"
            }),
  Field.new({"name" => "violation_unknown_injured_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Unknown Children Injured",
             "autosum_group" => "attack_on_hospitals_number_of_children_injured"
            }),
  Field.new({"name" => "violation_total_injured_attack_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Total Children Injured",
             "autosum_total" => true,
             "autosum_group" => "attack_on_hospitals_number_of_children_injured"
            }),
  Field.new({"name" => "hospital_staff_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Killed"
            }),
  Field.new({"name" => "hospital_staff_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Staff Injured"
            }),
  Field.new({"name" => "hospital_other_adults_killed_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Killed"
            }),
  Field.new({"name" => "hospital_other_adults_injured_attack",
             "type" => "numeric_field",
             "display_name_all" => "Number of Other Adults Injured"
            }),
  Field.new({"name" => "number_children_service_disruption_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Affected by Service Disruption"
            }),
  Field.new({"name" => "number_adults_service_disruption_hospital",
             "type" => "numeric_field",
             "display_name_all" => "Number of Adults Affected by Service Disruption"
            }),
  Field.new({"name" => "number_children_recruited_hospitals",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Recruited During Attack"
            }),
  Field.new({"name" => "hospital_management",
             "type" => "select_box",
             "display_name_all" => "What organization manages this facilty?",
             "option_strings_text_all" =>
                                    ["Government",
                                     "NGO",
                                     "Community",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "hospital_attack_objective",
             "type" => "text_field",
             "display_name_all" => "What was the main objective of the \"attack\"?"
            }),
  Field.new({"name" => "hospital_impact",
             "type" => "select_box",
             "display_name_all" => "Physical Impact of Attack",
             "option_strings_text_all" =>
                                    ["Total Destruction",
                                     "Serious Damage",
                                     "Minor Damage",
                                     "None"].join("\n")
            }),
  Field.new({"name" => "hospital_closed",
             "type" => "radio_button",
             "display_name_all" => "Was Facility Closed As A Result?",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "hospital_closed_duration",
             "type" => "numeric_field",
             "display_name_all" => "For How Long? (Days)"
            })
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
  :fields => attack_on_hospitals_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Attack on Hospitals Subform",
  "description_all" => "Nested Attack on Hospitals Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["site_attack_type_hospital"]
})

attack_on_hospitals_fields = [
  Field.new({"name" => "attack_on_hospitals",
             "type" => "subform", "editable" => true,
             "subform_section_id" => attack_on_hospitals_subform_section.unique_id,
             "display_name_all" => "Attack on Hospitals"
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
  :perm_enabled => true,
  "name_all" => "Attack on Hospitals",
  "description_all" => "Attack on Hospitals"
})
