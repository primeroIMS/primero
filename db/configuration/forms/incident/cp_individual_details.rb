cp_individual_details_fields = [
  Field.new({
    "name" => "age",
    "type" => "numeric_field",
    "display_name_en" => "Age",
    "show_on_minify_form" => true,
    "matchable" => true
  }),
  Field.new({
    "name" => "cp_sex",
    "type" => "select_box",
    "show_on_minify_form" => true,
    "display_name_en" => "Sex",
    "option_strings_source" => "lookup lookup-gender",
    "matchable" => true
  }),
  Field.new({
    "name" => "cp_nationality",
    "type" => "select_box",
    "multi_select" => true,
    "display_name_en" => "Nationality",
    "option_strings_source" => "lookup lookup-country"
  }),
  Field.new({"name" => "national_id_no",
    "type" => "text_field",
    "display_name_en" => "National ID Number"
  }),
  Field.new({
    "name" => "other_id_type",
    "type" => "text_field",
    "display_name_en" => "Type of Other ID Document"
  }),
  Field.new({
    "name" => "other_id_no",
    "type" => "text_field",
    "display_name_en" => "Number of Other ID Document"
  }),
  Field.new({
    "name" => "maritial_status",
    "type" =>"select_box" ,
    "display_name_en" => "Social Status",
    "show_on_minify_form" => true,
    "option_strings_source" => "lookup lookup-marital-status"
  }),
  Field.new({
    "name" => "educational_status",
    "type" =>"select_box" ,
    "display_name_en" => "Educational Status",
    "option_strings_text_en" => [
      { id: 'illiterate', display_text: "Illiterate" },
      { id: 'basic', display_text: "Basic" },
      { id: 'secondary', display_text: "Secondary" },
      { id: 'bachelor', display_text: "Bachelor" },
      { id: 'post_graduate_studies', display_text: "Post-graduate Studies" }
    ].map(&:with_indifferent_access)
  }),
  Field.new({
    "name" => "occupation",
    "type" => "text_field",
    "display_name_en" => "Occupation"
  }),
  Field.new({
    "name" => "cp_disability_type",
    "type" =>"select_box" ,
    "display_name_en" => "Disability Type",
    "option_strings_source" => "lookup lookup-disability-type"
  })
]

FormSection.create_or_update!({
  :unique_id => "cp_individual_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 30,
  :order => 15,
  :order_subform => 0,
  :form_group_id => "cp_individual_details",
  "editable" => true,
  :fields => cp_individual_details_fields,
  "name_en" => "CP Individual Details",
  "description_en" => "CP Individual Details"
})
