other_violation_section_fields = [
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
             "display_name_all" => "Number of survivors: boys",
             "autosum_group" => "other_violation_number_of_survivors"
            }),
  Field.new({"name" => "other_violation_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: girls",
             "autosum_group" => "other_violation_number_of_survivors"
            }),
  Field.new({"name" => "other_violation_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: unknown",
             "autosum_group" => "other_violation_number_of_survivors"
            }),
  Field.new({"name" => "other_violation_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of total survivors",
             "autosum_total" => true,
             "autosum_group" => "other_violation_number_of_survivors"
            })
]

other_violation_subform_section = FormSection.create_or_update_form_section({
  :unique_id => "other_violation",
  :parent_form=>"incident",
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 90,
  :order_subform => 1,
  "editable" => true,
  :fields => other_violation_section_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Other Violations",
  "description_all" => "Other Violations Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["violation_other_type"]
})

other_violation_fields = [
  ##Subform##
  Field.new({"name" => "other_violation",
             "type" => "subform", 
             "editable" => true,
             "subform_section_id" => other_violation_subform_section.id,
             "display_name_all" => "Other Violations"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "other_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 90,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => other_violation_fields,
  :perm_enabled => true,
  "name_all" => "Other Violation",
  "description_all" => "Other Violation"
})
