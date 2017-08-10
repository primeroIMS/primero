cp_individual_details_fields = [
  Field.new({
    "name" => "age",
    "type" => "numeric_field",
    "display_name_all" => "Age",
    "show_on_minify_form" => true,
    "matchable" => true
  }),
  Field.new({
    "name" => "cp_sex",
    "type" => "select_box",
    "show_on_minify_form" => true,
    "display_name_all" => "Sex",
    "option_strings_source" => "lookup lookup-gender",
    "matchable" => true
  }),
  Field.new({
    "name" => "cp_nationality",
    "type" => "select_box",
    "multi_select" => true,
    "display_name_all" => "Nationality",
    "option_strings_source" => "lookup lookup-country"
  }),
  Field.new({"name" => "national_id_no",
    "type" => "text_field",
    "display_name_all" => "National ID Number"
  }),
  Field.new({
    "name" => "other_id_type",
    "type" => "text_field",
    "display_name_all" => "Type of Other ID Document"
  }),
  Field.new({
    "name" => "other_id_no",
    "type" => "text_field",
    "display_name_all" => "Number of Other ID Document"
  }),
  Field.new({
    "name" => "maritial_status",
    "type" =>"select_box" ,
    "display_name_all" => "Social Status",
    "show_on_minify_form" => true,
    "option_strings_text_all" => [
      "Single",
      "Married",
      "Divorced",
      "Separated",
      "Widow"
    ].join("\n")
  }),
  Field.new({
    "name" => "educational_status",
    "type" =>"select_box" ,
    "display_name_all" => "Educational Status",
    "option_strings_text_all" => [
      "Illiterate",
      "Basic",
      "Secondary",
      "Bachelor",
      "Post-graduate Studies"
    ].join("\n")
  }),
  Field.new({
    "name" => "occupation",
    "type" => "text_field",
    "display_name_all" => "Occupation"
  }),
  Field.new({
    "name" => "cp_disability_type",
    "type" =>"select_box" ,
    "display_name_all" => "Disability Type",
    "option_strings_source" => "lookup lookup-disability-type"
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_individual_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 30,
  :order => 15,
  :order_subform => 0,
  :form_group_name => "CP Individual Details",
  "editable" => true,
  :fields => cp_individual_details_fields,
  "name_all" => "CP Individual Details",
  "description_all" => "CP Individual Details"
})
