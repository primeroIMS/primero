incident_details_subform_fields = [
  Field.new({"name" => "cp_incident_identification_violence",
             "type" => "select_box",
             "display_name_en" => "Identification of Incident",
             "option_strings_source" => "lookup lookup-incident-identification"
            }),
  Field.new({"name" => "cp_incident_violence_header",
             "type" => "separator",
             "display_name_en" => "Incident",
            }),
  Field.new({"name" => "cp_incident_date",
            "type" => "date_field",
            "display_name_en" => "Date of Incident"
            }),
  Field.new({"name" => "cp_incident_location_type",
             "type" => "select_box",
             "display_name_en" => "Area of the Incident",
             "option_strings_source" => "lookup lookup-incident-location"
            }),
  Field.new({"name" => "cp_incident_location_type_other",
             "type" => "text_field",
             "display_name_en" => "If 'Other', please specify"
            }),
  Field.new({"name" => "cp_incident_location",
             "type" => "select_box",
             "display_name_en" => "Location of the Incident",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cp_incident_timeofday",
             "type" => "select_box",
             "display_name_en" => "Time of Incident",
             "option_strings_source" => "lookup lookup-time-of-day"
            }),
  Field.new({"name" => "cp_incident_timeofday_actual",
             "type" => "text_field",
             "display_name_en" => "Please specify the actual time of the Incident"
            }),
  Field.new({"name" => "cp_incident_violence_type",
             "type" => "select_box",
             "display_name_en" => "Type of Violence",
             "option_strings_source" => "lookup lookup-cp-violence-type"
            }),
  Field.new({"name" => "cp_incident_previous_incidents",
             "type" => "radio_button",
             "display_name_en" => "Has the case been previously abused?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_previous_incidents_description",
             "type" => "textarea",
             "display_name_en" => "If yes, please describe in brief"
            }),
  Field.new({"name" => "cp_incident_abuser_header",
             "type" => "separator",
             "display_name_en" => "Perpetrator Information",
            }),
  Field.new({"name" => "cp_incident_abuser_name",
             "type" => "text_field",
             "display_name_en" => "Name"
            }),
  Field.new({"name" => "cp_incident_perpetrator_nationality",
             "type" => "select_box",
             "display_name_en" => "Nationality",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "perpetrator_sex",
             "type" => "radio_button",
             "display_name_en" => "Sex",
             "option_strings_source" => "lookup lookup-gender"
            }),
  Field.new({"name" => "cp_incident_perpetrator_date_of_birth",
            "type" => "date_field",
            "display_name_en" => "Date of Birth"
            }),
  Field.new({"name" => "cp_incident_perpetrator_age",
            "type" => "numeric_field",
            "display_name_en" => "Age"
            }),
  Field.new({"name" => "cp_incident_perpetrator_national_id_no",
             "type" => "text_field",
             "display_name_en" => "National ID Number"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_type",
             "type" => "text_field",
             "display_name_en" => "Type of Other ID Document"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_no",
             "type" => "text_field",
             "display_name_en" => "Number of Other ID Document"
            }),
  Field.new({"name" => "cp_incident_perpetrator_marital_status",
             "type" =>"select_box" ,
             "display_name_en" => "Social Status",
             "show_on_minify_form" => true,
             "option_strings_source" => "lookup lookup-marital-status"
            }),
  Field.new({"name" => "cp_incident_perpetrator_mobile_phone",
             "type" => "text_field",
             "display_name_en" => "Mobile Phone"
            }),
  Field.new({"name" => "cp_incident_perpetrator_phone",
             "type" => "text_field",
             "display_name_en" => "Land Phone"
            }),
  Field.new({"name" => "cp_incident_perpetrator_address",
             "type" => "textarea",
             "display_name_en" => "Address"
            }),
  Field.new({"name" => "cp_incident_perpetrator_occupation",
              "type" =>"text_field",
              "display_name_en" => "Occupation"
            }),
  Field.new({"name" => "cp_incident_perpetrator_relationship",
             "type" =>"select_box" ,
             "display_name_en" => "Relationship with the victim",
             "option_strings_source" => "lookup lookup-perpetrator-relationship"
            })
]

incident_details_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 1,
  :unique_id => "incident_details_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => incident_details_subform_fields,
  :initial_subforms => 1,
  "name_en" => "Nested Incident Details Subform",
  "description_en" => "Nested Incident Details Subform",
  "collapsed_fields" => ["cp_incident_violence_type", "cp_incident_date"]
})

incident_details_fields = [
  Field.new({
    "name" => "incident_details",
    "type" => "subform", "editable" => true,
    "subform_section_id" => incident_details_subform_section.unique_id,
    "display_name_en" => "Incident Details",
    "subform_sort_by" => "summary_date"
  })
]

FormSection.create_or_update_form_section({
  :unique_id=>"incident_details_container",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 0,
  :order_subform => 0,
  :form_group_id => "identification_registration",
  "editable" => true,
  :fields => incident_details_fields,
  "name_en" => "Incident Details",
  "description_en" => "Incident details information about a child.",
  :mobile_form => true
})
