other_violation_fields = [
  Field.new({"name" => "violation_other_type",
             "type" => "select_box",
             "display_name_all" => "Other Violation Type",
             "option_strings_text_all" =>
                                    ["Forced Displacement",
                                     "Denial of Civil Rights",
                                     "Use of Children for Propaganda",
                                     "Access Violations"].join("\n")
            }),
  Field.new({"name" => "violation_other_description",
             "type" => "textarea", 
             "display_name_all" => "Other Violation Description"
            }),
  Field.new({"name" => "other_violation_boys",
             "type" => "numeric_field", 
             "display_name_all" => "Number of victims: boys"
            }),
  Field.new({"name" => "other_violation_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of victims: girls"
            }),
  Field.new({"name" => "other_violation_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of victims: unknown"
            }),
  Field.new({"name" => "other_violation_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of total victims"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "other_violation",
  :parent_form=>"incident",
  "visible" => true,
  :order => 110,
  "editable" => true,
  :fields => other_violation_fields,
  :perm_enabled => true,
  "name_all" => "Other Violation",
  "description_all" => "Other Violation"
})
