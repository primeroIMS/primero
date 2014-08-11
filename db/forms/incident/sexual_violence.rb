sexual_violence_subform_fields = [
  Field.new({"name" => "violation_boys",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: boys"
            }),
  Field.new({"name" => "violation_girls",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: girls"
            }),
  Field.new({"name" => "violation_unknown",
             "type" => "numeric_field", 
             "display_name_all" => "Number of survivors: unknown"
            }),
  Field.new({"name" => "violation_total",
             "type" => "numeric_field", 
             "display_name_all" => "Number of total survivors"
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
  Field.new({"name" => "gbv_type",
             "type" => "select_box",
             "display_name_all" => "Type of GBV",
             "option_strings_text_all" =>
                                    ["Rape",
                                     "Sexual Assault",
                                     "Physical Assault",
                                     "Forced Marriage",
                                     "Denial of Resources, Opportunities, or Services",
                                     "Psychological/Emotional Abuse",
                                     "Non-GBV"].join("\n")
            }),
  Field.new({"name" => "non_gbv_tyoe_notes",
             "type" => "textarea",
             "display_name_all" => "If Non-GBV, describe"
            }),
  Field.new({"name" => "harmful_traditional_practice",
             "type" => "select_box",
             "display_name_all" => "Was this incident a Harmful Traditional Practice",
             "option_strings_text_all" => "Option 1\nOption 2\nOption 3\nOption 4\nOption 5\nNo"
            }),
  Field.new({"name" => "goods_money_exchanged",
             "type" => "radio_button",
             "display_name_all" => "Were money, goods, benefits, and/or services exchanged in relation to the incident?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
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
            }),
  Field.new({"name" => "gbv_reported_elsewhere",
             "type" => "radio_button",
             "display_name_all" => "Has the client reported this incident anywhere else?",
             "option_strings_text_all" => "Yes\nNo\nUnknown"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_organization_type",
             "type" => "select_box",
             "display_name_all" => "If yes, type of service provider where the survivor reported the incident",
             "option_strings_text_all" =>
                                    ["Health/Medical Services",
                                     "Psychosocial/Counseling Services",
                                     "Police/Other Security Actor",
                                     "Legal Assistance Services",
                                     "Livelihoods Program",
                                     "Safe House/Shelter",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "gbv_reported_elsewhere_organization_provider",
             "type" => "text_field", 
             "display_name_all" => "Name of the service provider"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_reporting",
             "type" => "radio_button",
             "display_name_all" => "Is this a GBV reporting organization?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "gbv_previous_incidents",
             "type" => "radio_button",
             "display_name_all" => "Has the client had any previous incidents of GBV perpetrated against them?",
             "option_strings_text_all" => "Yes\nNo"
            })
]

sexual_violence_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "sexual_violence_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => sexual_violence_subform_fields,
  :perm_enabled => false,
  :perm_visible => false,
  "name_all" => "Nested Sexual Violence Subform",
  "description_all" => "Nested Sexual Violence Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["sexual_violence_type"]
})

sexual_violence_fields = [
  Field.new({"name" => "sexual_violence_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.id,
             "display_name_all" => "Sexual Violence"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "sexual_violence",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => sexual_violence_fields,
  :perm_enabled => true,
  "name_all" => "Sexual Violence",
  "description_all" => "Sexual Violence"
})
