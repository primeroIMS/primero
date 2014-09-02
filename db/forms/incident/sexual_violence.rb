sexual_violence_subform_fields = [
  Field.new({"name" => "violation_boys",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: boys",
             "autosum_group" => "sexual_violence_number_of_survivors"
            }),
  Field.new({"name" => "violation_girls",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: girls",
             "autosum_group" => "sexual_violence_number_of_survivors"
            }),
  Field.new({"name" => "violation_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Number of survivors: unknown",
             "autosum_group" => "sexual_violence_number_of_survivors"
            }),
  Field.new({"name" => "violation_total",
             "type" => "numeric_field",
             "display_name_all" => "Number of total survivors",
             "autosum_total" => true,
             "autosum_group" => "sexual_violence_number_of_survivors"
            }),
  Field.new({"name" => "sexual_violence_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Type of Violence",
             "option_strings_text_all" =>
                                    ["Rape",
                                     "Sexual Assault",
                                     "Forced Marriage",
                                     "Mutilation",
                                     "Forced Sterilization",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "displacement_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Stage of displacement at time of incident",
             "option_strings_text_all" =>
                                    ["Not Displaced/Home Country",
                                     "Pre-displacement",
                                     "During Flight",
                                     "During Refuge",
                                     "During Return/Transit",
                                     "Post-Displacement"].join("\n")
            }),
  Field.new({"name" => "abduction_status_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Type of abduction at time of the incident",
             "option_strings_text_all" =>
                                    ["None",
                                     "Forced Conscription",
                                     "Trafficked",
                                     "Other Abduction/Kidnapping"].join("\n")
            })
]

sexual_violence_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "sexual_violence",
  :parent_form=>"incident",
  "editable" => true,
  :fields => sexual_violence_subform_fields,
  "name_all" => "Nested Sexual Violence Subform",
  "description_all" => "Nested Sexual Violence Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["sexual_violence_type"]
})

sexual_violence_fields = [
  Field.new({"name" => "sexual_violence",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.unique_id,
             "display_name_all" => "Sexual Violence"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "sexual_violence_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => sexual_violence_fields,
  "name_all" => "Sexual Violence",
  "description_all" => "Sexual Violence"
})
