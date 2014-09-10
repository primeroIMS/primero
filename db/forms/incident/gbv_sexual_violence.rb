gbv_reported_elsewhere_subform_fields = [
  Field.new({"name" => "gbv_reported_elsewhere_organization_type",
             "type" => "select_box",
             "display_name_all" => "Type of service provider where the survivor reported the incident",
             "option_strings_text_all" =>
                                    ["No",
                                     "Health/Medical Services",
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
            })
]

gbv_reported_elsewhere_subform = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "gbv_reported_elsewhere_subform",
  :parent_form=>"incident",
  "editable" => true,
  :fields => gbv_reported_elsewhere_subform_fields,
  :initial_subforms => 1,
  "name_all" => "GBV Reported Elsewhere Subform",
  "description_all" => "GBV Reported Elsewhere Subform",
  "collapsed_fields" => ["gbv_reported_elsewhere_organization_provider"]
})

gbv_sexual_violence_fields = [
  Field.new({"name" => "gbv_sexual_violence_type",
             "type" => "select_box",
             "display_name_all" => "Type of Incident Violence",
             "option_strings_text_all" =>
                                    ["Rape",
                                     "Sexual Assault",
                                     "Physical Assault",
                                     "Forced Marriage",
                                     "Denial of Resources, Opportunities, or Services",
                                     "Psychological/Emotional Abuse",
                                     "Non-GBV"].join("\n")
            }),
  Field.new({"name" => "non_gbv_type_notes",
             "type" => "textarea",
             "display_name_all" => "If Non-GBV, describe"
            }),
  Field.new({"name" => "harmful_traditional_practice",
             "type" => "select_box",
             "display_name_all" => "Was this incident a Harmful Traditional Practice",
             "option_strings_text_all" => "Option 1\nOption 2\nOption 3\nOption 4\nOption 5\nNo",
             "option_strings_text_all" =>
                                    ["No",
                                     "Type of Practice 1",
                                     "Type of Practice 2",
                                     "Type of Practice 3",
                                     "Type of Practice 4",
                                     "Type of Practice 5"].join("\n")
            }),
  Field.new({"name" => "goods_money_exchanged",
             "type" => "radio_button",
             "display_name_all" => "Were money, goods, benefits, and/or services exchanged in relation to the incident?",
             "option_strings_text_all" => "Yes\nNo"
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
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_subform",
             "type" => "subform", 
             "editable" => true,
             "subform_section_id" => gbv_reported_elsewhere_subform.unique_id,
             "display_name_all" => "If yes, where?"
            }),
  Field.new({"name" => "gbv_previous_incidents",
             "type" => "radio_button",
             "display_name_all" => "Has the client had any previous incidents of GBV perpetrated against them?",
             "option_strings_text_all" => "Yes\nNo"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "gbv_sexual_violence",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "GBV Sexual Violence",
  "editable" => true,
  :fields => gbv_sexual_violence_fields,
  "name_all" => "GBV Sexual Violence",
  "description_all" => "GBV Sexual Violence"
})
