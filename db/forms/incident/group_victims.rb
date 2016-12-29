group_victims_section_fields_subform = [
  Field.new({"name" => "group_description",
             "type" => "text_field",
             "display_name_all" => "Description of group victim(s)",
             "help_text_all" => "E.g., students of a school destroyed in an aerial bombardment; doctors and patients of a hospital hit by a missile."
            }),
  Field.new({"name" => "group_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violation(s)",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "group_number",
             "type" => "numeric_field",
             "display_name_all" => "How many children were affected?"
            }),
  Field.new({"name" => "group_number_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?",
            }),
  Field.new({"name" => "group_gender",
             "type" => "select_box",
             "display_name_all" => "Sex of the children affected",
             "option_strings_text_all" => ["All Female", "All Male", "Mixed", "Unknown"].join("\n")
            }),
  Field.new({"name" => "group_age_band",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Age range of the children affected",
             "option_strings_text_all" => ["0 - 5", "6 - 10", "11 - 13", "14 - 18", "Unknown"].join("\n")
            }),
  Field.new({"name" => "group_nationality",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Nationality/ies of the children affected",
             "option_strings_source" => "lookup Nationality"
            }),
  Field.new({"name" => "group_ethnicity",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Ethnic affiliation(s) of the children affected",
             "option_strings_source" => "lookup Ethnicity"
            }),

  Field.new({"name" => "group_religion",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Religious affiliation(s) of the children affected.",
             "option_strings_source" => "lookup Religion"
            }),
  Field.new({"name" => "group_adult_number",
             "type" => "numeric_field",
             "display_name_all" => "How many adults were affected?",
             "help_text_all" => " E.g. education personnel; healthcare personnel"
            }),
  Field.new({"name" => "group_adult_number_estimated",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated? ",
            }),
  Field.new({"name" => "group_adult_gender",
             "type" => "select_box",
             "display_name_all" => "Sex of the adults affected",
             "option_strings_text_all" => ["All Female", "All Male", "Mixed", "Unknown"].join("\n")
            }),
  Field.new({"name" => "group_vulnerabilities",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Group victim's vulnerabilities at the time of the incident",
             "option_strings_source" => "lookup VulnerabilityType"
            }),
  Field.new({"name" => "group_additional_details",
             "type" => "textarea",
             "display_name_all" => "Additional details"
            })
]

group_victims_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 60,
  :order => 10,
  :order_subform => 1,
  :unique_id=>"group_victims_section",
  :parent_form=>"incident",
  "editable"=>true,
  :fields => group_victims_section_fields_subform,
  "name_all" => "Nested Group victim(s)",
  "description_all" => "Group victim(s) Subform",
  "collapsed_fields" => ["group_gender", "group_age_band"],
  :initial_subforms => 1
})

group_victims_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "group_victims_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "Please enter here any information on group(s) of unidentified victims"
            }),
  ##Subform##
  Field.new({"name" => "group_victims_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => group_victims_section.unique_id,
             "display_name_all" => "Group victim"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "group_victims",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 60,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Group victim(s)",
  "editable" => true,
  :fields => group_victims_fields,
  "name_all" => "Group victim(s)",
  "description_all" => "Group victim(s)"
})
