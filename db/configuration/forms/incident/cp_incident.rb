cp_incident_fields = [
  Field.new({
    "name" => "cp_case_id",
    "type" => "text_field",
    "editable" => false,
    "disabled" => true,
    "display_name_en" => "Long ID",
    "mobile_visible" => false,
    "visible" => false
  }),
  Field.new({
    "name" => "short_id",
    "type" => "text_field",
    "editable" => false,
    "disabled" => true,
    "display_name_en" => "Short ID",
    "mobile_visible" => false
  }),
  Field.new({
    "name" => "status",
    "type" => "select_box",
    "selected_value" => Record::STATUS_OPEN,
    "display_name_en" => "Incident Status",
    "option_strings_source" => "lookup lookup-incident-status"
  }),
  Field.new({
    "name" => "cp_incident_identification_violence",
    "type" => "select_box",
    "display_name_en" => "Identification of Violence Case",
    "option_strings_source" => "lookup lookup-incident-identification"
  }),
  Field.new({
    "name" => "incident_date",
    "type" => "date_field",
    "display_name_en" => "Date of Incident"
  }),
  Field.new({
    "name" => "cp_incident_location_type",
    "type" => "select_box",
    "display_name_en" => "Area of the Incident",
    "option_strings_source" => "lookup lookup-incident-location"
  }),
  Field.new({
    "name" => "cp_incident_location_type_other",
    "type" => "text_field",
    "display_name_en" => "If 'Other', please specify"
  }),
  Field.new({
    "name" => "incident_location",
    "type" => "select_box",
    "display_name_en" => "Location of the Incident",
    "option_strings_source" => "Location"
  }),
  Field.new({
    "name" => "cp_incident_timeofday",
    "type" => "select_box",
    "display_name_en" => "Time of Incident",
    "option_strings_source" => "lookup lookup-time-of-day"
  }),
  Field.new({
    "name" => "cp_incident_timeofday_actual",
    "type" => "text_field",
    "display_name_en" => "Please specify the actual time of the Incident"
  }),
  Field.new({
    "name" => "cp_incident_violence_type",
    "type" => "select_box",
    "display_name_en" => "Type of Violence",
    "option_strings_source" => "lookup lookup-cp-violence-type"
  }),
  Field.new({
    "name" => "cp_incident_previous_incidents",
    "type" => "radio_button",
    "display_name_en" => "Has the case been previously abused?",
    "option_strings_source" => "lookup lookup-yes-no"
  }),
  Field.new({
    "name" => "cp_incident_previous_incidents_description",
    "type" => "textarea",
    "display_name_en" => "If yes please describe in brief"
  })
]

FormSection.create_or_update!({
  unique_id: "cp_incident_form",
  parent_form: "incident",
  visible: true,
  order_form_group: 10,
  order: 10,
  order_subform: 0,
  form_group_id: "cp_incident",
  fields: cp_incident_fields,
  is_first_tab: true,
  editable: true,
  name_en: "CP Incident",
  description_en: "CP Incident"
})
