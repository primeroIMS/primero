cp_offender_details_fields = [
  Field.new({
    "name" => "cp_incident_abuser_name",
    "type" => "text_field",
    "display_name_en" => "Name",
    "visible" => false
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_nationality",
    "type" => "select_box",
    "display_name_en" => "Nationality",
    "option_strings_source" => "lookup lookup-country"
  }),
  Field.new({
    "name" => "perpetrator_sex",
    "type" => "radio_button",
    "display_name_en" => "Sex",
    "option_strings_source" => "lookup lookup-gender"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_age",
    "type" => "numeric_field",
    "display_name_en" => "Age"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_national_id_no",
    "type" => "text_field",
    "display_name_en" => "National ID Number"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_other_id_type",
    "type" => "text_field",
    "display_name_en" => "Type of Other ID Document"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_other_id_no",
    "type" => "text_field",
    "display_name_en" => "Number of Other ID Document"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_marital_status",
    "type" =>"select_box" ,
    "display_name_en" => "Social Status",
    "show_on_minify_form" => true,
    "option_strings_source" => "lookup lookup-marital-status"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_occupation",
    "type" =>"text_field",
    "display_name_en" => "Occupation"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_relationship",
    "type" =>"select_box" ,
    "display_name_en" => "Relationship with the abused",
    "option_strings_source" => "lookup lookup-perpetrator-relationship"
  })
]

FormSection.create_or_update!({
  :unique_id => "cp_offender_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 20,
  :order => 15,
  :order_subform => 0,
  :form_group_id => "perpetrator_details",
  "editable" => true,
  :fields => cp_offender_details_fields,
  "name_en" => "Perpetrator Details",
  "description_en" => "Perpetrator Details"
})
