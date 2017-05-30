cp_incident_fields = [
  Field.new({
    "name" => "cp_case_id",
    "type" => "text_field",
    "editable" => false,
    "disabled" => true,
    "display_name_all" => "Long ID",
    "create_property" => false,
    "mobile_visible" => false,
    "visible" => false
  }),
  Field.new({
    "name" => "cp_short_id",
    "type" => "text_field",
    "editable" => false,
    "disabled" => true,
    "display_name_all" => "Short ID",
    "create_property" => false,
    "mobile_visible" => false
  }),
  Field.new({
    "name" => "status",
    "type" => "select_box",
    "selected_value" => Record::STATUS_OPEN,
    "display_name_all" => "Incident Status",
    "option_strings_source" => "lookup lookup-incident-status"
  }),
  Field.new({
    "name" => "cp_incident_identification_violence",
    "type" => "select_box",
    "display_name_all" => "Identification of Violence Case",
    "option_strings_text_all" => [
      "Disclosure / complaint by the abused person or family member",
      "Discovered by service provider",
      "Report by the institution providing the service (discovery)",
      "Other"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_date",
    "type" => "date_field",
    "display_name_all" => "Date of Incident"
  }),
  Field.new({
    "name" => "cp_incident_location_type",
    "type" => "select_box",
    "display_name_all" => "Area of the Incident",
    "option_strings_text_all" => [
      "Home",
      "Street",
      "School",
      "Work Place",
      "Other"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_location_type_other",
    "type" => "text_field",
    "display_name_all" => "If 'Other', please specify"
  }),
  Field.new({
    "name" => "cp_incident_location",
    "type" => "select_box",
    "display_name_all" => "Location of the Incident",
    "option_strings_source" => "Location"
  }),
  Field.new({
    "name" => "cp_incident_timeofday",
    "type" => "select_box",
    "display_name_all" => "Time of Incident",
    "option_strings_text_all" => [
      "Morning",
      "Noon",
      "Evening",
      "Night"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_timeofday_actual",
    "type" => "text_field",
    "display_name_all" => "Please specify the actual time of the Incident"
  }),
  Field.new({
    "name" => "cp_incident_sexual_violence_type",
    "type" => "select_box",
    "display_name_all" => "Type of Violence",
    "option_strings_text_all" => [
      "Physical",
      "Sexual - within the family",
      "Sexual - outside the family",
      "Neglect",
      "Other"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_family_members_affected",
    "type" => "select_box",
    "multi_select" => true,
    "display_name_all" => "Family members affected by the incident",
    "option_strings_text_all" => [
      "Wife",
      "Child/Children",
      "Wife and Children",
      "Others"
    ].join("\n")
  }),
  Field.new({
    "name" => "cp_incident_previous_incidents",
    "type" => "radio_button",
    "display_name_all" => "Has the case been previously abused?",
    "option_strings_source" => "lookup lookup-yes-no"
  }),
  Field.new({
    "name" => "cp_incident_previous_incidents_description",
    "type" => "textarea",
    "display_name_all" => "If yes please describe in brief"
  }),
  Field.new({
    "name" => "cp_incident_reporting",
    "type" => "radio_button",
    "display_name_all" => "Does this incident meet the criteria for Mandatory Reporting?",
    "help_text_all" => "(This determination is copied from the Incident Details on the Case record but can be changed here if it is determined this is not a reportable incident.)",
    "guiding_questions" => "Criteria of Mandatory Reporting
      Reporting is made in the following cases :
      1.        If the abused desires to report or to lodge a complaint, regardless of the risk criteria.
      2.        Any case of sexual violence or suspicion of sexual violence.
      3.        Any violence on a child or on an incapable person.
      4.        If there might be a life threat on the abused by the abuser, the family or the abused himself/ herself.

      If all of the above are not applicable, Conduct Critical Risk Factors Assessment to determine urgency and/or reporting need.

      The case should be managed as an emergency/priority case and/or  consider  reporting  to the Family Protection Department in the case of any (one single factor) of the following risk factors

      •        Does the case suffer from  physical injuries that need medical interventions?
      •        Has the case been assaulted by several abusers?
      •        Has the abused been assaulted/threatened  by a weapon or sharp tools?",
    "option_strings_source" => "lookup lookup-yes-no"
  })
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 10,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "CP Incident",
  :fields => cp_incident_fields,
  :is_first_tab => true,
  "editable" => true,
  "name_all" => "CP Incident",
  "description_all" => "CP Incident"
})