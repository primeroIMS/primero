abduction_fields = [
  Field.new({"name" => "violation_abduction_boys",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: boys"
            }),
  Field.new({"name" => "violation_abduction_girls",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: girls"
            }),
  Field.new({"name" => "violation_abduction_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Number of victims: unknown"
            }),
  Field.new({"name" => "violation_abduction_total",
             "type" => "numeric_field",
             "display_name_all" => "Number of total victims"
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

FormSection.create_or_update_form_section({
  :unique_id => "abduction",
  :parent_form=>"incident",
  "visible" => true,
  :order => 100,
  "editable" => true,
  :fields => abduction_fields,
  :perm_enabled => true,
  "name_all" => "Abduction",
  "description_all" => "Abduction"
})