incident_details_subform_fields = [
  Field.new({"name" => "cp_incident_identification_violence",
             "type" => "select_box",
             "display_name_all" => "Identification of Incident",
             "option_strings_source" => "lookup lookup-incident-identification"
            }),
  Field.new({"name" => "cp_incident_violence_header",
             "type" => "separator",
             "display_name_all" => "Incident",
            }),
  Field.new({"name" => "cp_incident_date",
            "type" => "date_field",
            "display_name_all" => "Date of Incident"
            }),
  Field.new({"name" => "cp_incident_location_type",
             "type" => "select_box",
             "display_name_all" => "Area of the Incident",
             "option_strings_source" => "lookup lookup-incident-location"
            }),
  Field.new({"name" => "cp_incident_location_type_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify"
            }),
  Field.new({"name" => "cp_incident_location",
             "type" => "select_box",
             "display_name_all" => "Location of the Incident",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cp_incident_timeofday",
             "type" => "select_box",
             "display_name_all" => "Time of Incident",
             "option_strings_source" => "lookup lookup-time-of-day"
            }),
  Field.new({"name" => "cp_incident_timeofday_actual",
             "type" => "text_field",
             "display_name_all" => "Please specify the actual time of the Incident"
            }),
  Field.new({"name" => "cp_incident_violence_type",
             "type" => "select_box",
             "display_name_all" => "Type of Violence",
             "option_strings_source" => "lookup lookup-cp-violence-type"
            }),
  Field.new({"name" => "cp_incident_previous_incidents",
             "type" => "radio_button",
             "display_name_all" => "Has the case been previously abused?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_previous_incidents_description",
             "type" => "textarea",
             "display_name_all" => "If yes please describe in brief"
            }),
  Field.new({"name" => "cp_incident_abuser_header",
             "type" => "separator",
             "display_name_all" => "Perpetrator information",
            }),
  Field.new({"name" => "cp_incident_abuser_name",
             "type" => "text_field",
             "display_name_all" => "Name"
            }),
  Field.new({"name" => "cp_incident_perpetrator_nationality",
             "type" => "select_box",
             "display_name_all" => "Nationality",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "perpetrator_sex",
             "type" => "radio_button",
             "display_name_all" => "Sex",
             "option_strings_source" => "lookup lookup-gender"
            }),
  Field.new({"name" => "cp_incident_perpetrator_date_of_birth",
            "type" => "date_field",
            "display_name_all" => "Date of Birth"
            }),
  Field.new({"name" => "cp_incident_perpetrator_age",
            "type" => "numeric_field",
            "display_name_all" => "Age"
            }),
  Field.new({"name" => "cp_incident_perpetrator_national_id_no",
             "type" => "text_field",
             "display_name_all" => "National ID Number"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_type",
             "type" => "text_field",
             "display_name_all" => "Type of Other ID Document"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_no",
             "type" => "text_field",
             "display_name_all" => "Number of Other ID Document"
            }),
  Field.new({"name" => "cp_incident_perpetrator_marital_status",
             "type" =>"select_box" ,
             "display_name_all" => "Social Status",
             "show_on_minify_form" => true,
             "option_strings_source" => "lookup lookup-marital-status"
            }),
  Field.new({"name" => "cp_incident_perpetrator_mobile_phone",
             "type" => "text_field",
             "display_name_all" => "Mobile Phone"
            }),
  Field.new({"name" => "cp_incident_perpetrator_phone",
             "type" => "text_field",
             "display_name_all" => "Land Phone"
            }),
  Field.new({"name" => "cp_incident_perpetrator_address",
             "type" => "textarea",
             "display_name_all" => "Address"
            }),
  Field.new({"name" => "cp_incident_perpetrator_occupation",
              "type" =>"text_field",
              "display_name_all" => "Occupation"
            }),
  Field.new({"name" => "cp_incident_perpetrator_relationship",
             "type" =>"select_box" ,
             "display_name_all" => "Relationship with the victim",
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
  "name_all" => "Nested Incident Details Subform",
  "description_all" => "Nested Incident Details Subform",
  "collapsed_fields" => ["cp_incident_violence_type", "cp_incident_date"]
})

incident_details_fields = [
  Field.new({
    "name" => "incident_details",
    "type" => "subform", "editable" => true,
    "subform_section_id" => incident_details_subform_section.unique_id,
    "display_name_all" => "Incident Details",
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
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => incident_details_fields,
  "name_all" => "Incident Details",
  "description_all" => "Incident details information about a child.",
  :mobile_form => true
})
