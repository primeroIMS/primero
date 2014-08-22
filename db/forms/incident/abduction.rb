abduction_subform_fields = [
  Field.new({"name" => "violation_abduction_boys",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: boys",
             "autosum_group" => "abduction_number_of_survivors"
            }),
  Field.new({"name" => "violation_abduction_girls",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: girls",
             "autosum_group" => "abduction_number_of_survivors"
            }),
  Field.new({"name" => "violation_abduction_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: unknown",
             "autosum_group" => "abduction_number_of_survivors"
            }),
  Field.new({"name" => "violation_abduction_total",
             "type" => "numeric_field",
             "display_name_all" => "Number of total survivors",
             "autosum_total" => true,
             "autosum_group" => "abduction_number_of_survivors"
            }),
  Field.new({"name" => "abduction_purpose",
             "type" => "select_box",
             "display_name_all" => "Category",
             "option_strings_text_all" => ["Child Recruitment",
                                           "Child Use",
                                           "Sexual Violence",
                                           "Political Indoctrination",
                                           "Hostage (Intimidation)",
                                           "Hostage (Extortion)",
                                           "Unknown",
                                           "Other"].join("\n")
            }),
  Field.new({"name" => "abduction_crossborder",
             "type" => "radio_button",
             "display_name_all" => "Cross Border",
             "option_strings_text_all" => ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "abduction_from_location",
             "type" => "text_field",
             "display_name_all" => "Location where they were abducting from"
            }),
  Field.new({"name" => "abduction_held_location",
             "type" => "text_field",
             "display_name_all" => "Location where they were held"
            })
]

abduction_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 50,
  :order_subform => 1,
  :unique_id => "abduction",
  :parent_form=>"incident",
  "editable" => true,
  :fields => abduction_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Abduction Subform",
  "description_all" => "Nested Abduction Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["abduction_purpose"]
})

abduction_fields = [
  Field.new({"name" => "abduction",
             "type" => "subform", "editable" => true,
             "subform_section_id" => abduction_subform_section.id,
             "display_name_all" => "Abduction"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "abduction_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 50,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => abduction_fields,
  :perm_enabled => true,
  "name_all" => "Abduction",
  "description_all" => "Abduction"
})