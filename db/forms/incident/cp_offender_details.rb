cp_offender_details_fields = [
  Field.new({
    "name" => "cp_incident_abuser_name",
    "type" => "text_field",
    "display_name_all" => "Name",
    "visible" => false
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_nationality",
    "type" => "select_box",
    "display_name_all" => "Nationality",
    "option_strings_source" => "lookup lookup-country"
  }),
  Field.new({
    "name" => "perpetrator_sex",
    "type" => "radio_button",
    "display_name_all" => "Sex",
    "option_strings_source" => "lookup lookup-gender"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_age",
    "type" => "numeric_field",
    "display_name_all" => "Age"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_national_id_no",
    "type" => "text_field",
    "display_name_all" => "National ID Number"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_other_id_type",
    "type" => "text_field",
    "display_name_all" => "Type of Other ID Document"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_other_id_no",
    "type" => "text_field",
    "display_name_all" => "Number of Other ID Document"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_marital_status",
    "type" =>"select_box" ,
    "display_name_all" => "Social Status",
    "show_on_minify_form" => true,
    "option_strings_source" => "lookup lookup-marital-status"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_occupation",
    "type" =>"text_field",
    "display_name_all" => "Occupation"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_relationship",
    "type" =>"select_box" ,
    "display_name_all" => "Relationship with the abused",
    "option_strings_source" => "lookup lookup-perpetrator-relationship"
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_offender_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 20,
  :order => 15,
  :order_subform => 0,
  :form_group_name => "Perpetrator Details",
  "editable" => true,
  :fields => cp_offender_details_fields,
  "name_all" => "Perpetrator Details",
  "description_all" => "Perpetrator Details"
})
