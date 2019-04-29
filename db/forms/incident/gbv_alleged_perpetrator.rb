alleged_perpetrator_subform_fields = [
  Field.new({"name" => "primary_perpetrator",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Is this the primary perpetrator?",
             "option_strings_text_en" => [
               { id: 'primary', display_text: "Primary" },
               { id: 'secondary', display_text: "Secondary" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "perpetrator_sex",
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Sex of Alleged Perpetrator",
             "option_strings_source" => "lookup lookup-gender"
            }),
  Field.new({"name" => "former_perpetrator",
             "mobile_visible" => false,
             "type" => "radio_button",
             "display_name_en" => "Past GBV by alledged perpetrator?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "perpetrator_nationality",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "Nationality of alleged perpetrator",
             "option_strings_source" => "lookup lookup-nationality"
            }),
  Field.new({"name" => "perpetrator_ethnicity",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "Clan or Ethnicity of alleged perpetrator",
             "option_strings_source" => "lookup lookup-ethnicity"
            }),
  Field.new({"name" => "age_group",
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Age group of alleged perpetrator",
             "option_strings_text_en" => [
               { id: '0_11', display_text: "0-11" },
               { id: '12_17', display_text: "12-17" },
               { id: '18_25', display_text: "18-25" },
               { id: '26_40', display_text: "26-40" },
               { id: '41_60', display_text: "41-60" },
               { id: '61+', display_text: "61+" },
               { id: 'unknown', display_text: "Unknown" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "age_type",
             "mobile_visible" => false,
             "type" => "select_box",
             "display_name_en" => "Age type of alleged perpetrator",
             "visible" => false,
             "option_strings_source" => "lookup lookup-age-group-type"
            }),
  Field.new({"name" => "perpetrator_relationship",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Alleged perpetrator relationship with survivor",
             "option_strings_source" => "lookup lookup-perpetrator-relationship"
            }),
  Field.new({"name" => "perpetrator_occupation",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Main occupation of alleged perpetrator (if known)",
             "option_strings_text_en" => [
               { id: 'other', display_text: "Other" },
               { id: 'unemployed', display_text: "Unemployed" },
               { id: 'unknown', display_text: "Unknown" },
               { id: 'occupation_1', display_text: "Occupation 1" },
               { id: 'occupation_2', display_text: "Occupation 2" },
               { id: 'occupation_3', display_text: "Occupation 3" },
               { id: 'occupation_4', display_text: "Occupation 4" },
               { id: 'occupation_5', display_text: "Occupation 5" }
             ].map(&:with_indifferent_access)
            })
]

alleged_perpetrator_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 80,
  :order => 10,
  :order_subform => 1,
  :unique_id => "alleged_perpetrator",
  :parent_form=>"incident",
  "editable" => true,
  :fields => alleged_perpetrator_subform_fields,
  mobile_form: true,
  :initial_subforms => 0,
  "name_en" => "Nested Alleged Perpetrator Subform",
  "description_en" => "Nested Alleged Perpetrator Subform"
})

alleged_perpetrator_fields = [
  Field.new({"name" => "alleged_perpetrator",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "subform",
             "editable" => true,
             "subform_section" => alleged_perpetrator_subform_section,
             "display_name_en" => "Alleged Perpetrator"
            })
]

FormSection.create_or_update_form_section({
  unique_id: "alleged_perpetrators_wrapper",
  parent_form: "incident",
  visible: true,
  order_form_group: 80,
  order: 10,
  order_subform: 0,
  form_group_id: "alleged_perpetrator",
  editable: true,
  mobile_form: true,
  fields: alleged_perpetrator_fields,
  name_en: "Alleged Perpetrator",
  description_en: "Alleged Perpetrator"
})
