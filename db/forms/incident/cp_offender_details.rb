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
    "option_strings_text_all" => ["Male", "Female"].join("\n")
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
    "option_strings_text_all" => [
      "Single",
      "Married",
      "Divorced",
      "Separated",
      "Widow"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_educational_status",
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
    "name" => "cp_incident_perpetrator_occupation_lookup",
    "type" =>"select_box",
    "display_name_all" => "Profession",
    "option_strings_source" => "lookup lookup-perpetrator-occupation"
  }),
  Field.new({
    "name" => "cp_incident_perpetrator_relationship",
    "type" =>"select_box" ,
    "display_name_all" => "Relationship with the abused",
    "option_strings_text_all" => [
      "Husband (or ex-husband)",
      "Family member",
      "Other"
    ].join("\n")
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_offender_details",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 20,
  :order => 15,
  :order_subform => 0,
  :form_group_name => "CP Offender Details",
  "editable" => true,
  :fields => cp_offender_details_fields,
  "name_all" => "CP Offender Details",
  "description_all" => "CP Offender Details"
})
