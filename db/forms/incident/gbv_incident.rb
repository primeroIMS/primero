gbv_incident_fields = [
  Field.new({"name" => "incident_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Long ID",
             "create_property" => false
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Incident ID",
             "create_property" => false
            }),
  Field.new({"name" => "incident_code",
             "type" => "text_field",
             "editable" => false,
             "disabled" => true,
             "display_name_all" => "Incident Code"
            }),
  Field.new({"name" => "incidentid_ir",
             "type" => "text_field",
             "display_name_all" => "Incident ID IR",
             "help_text_all" => "Incident ID for the IR"
            }),
  Field.new({"name" => "status",
             "type" => "select_box",
             "selected_value" => Record::STATUS_OPEN,
             "display_name_all" => "Incident Status",
             "option_strings_source" => "lookup lookup-incident-status"
            }),
  Field.new({"name" => "consent_reporting",
             "type" => "radio_button",
             "display_name_all" => "Consent is given to share non-identifiable information for reporting",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "date_of_first_report",
             "type" => "date_field",
             "display_name_all" => "Date of Interview"
            }),
  Field.new({"name" => "incident_date",
             "type" => "date_field",
             "display_name_all" => "Date of Incident"
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of Incident"
            }),
  Field.new({"name" => "displacement_incident",
             "type" => "select_box",
             "display_name_all" => "Stage of displacement at time of incident",
             "option_strings_text_all" => [
                "Not Displaced / Home Country",
                "Pre-displacement",
                "During Flight",
                "During Refuge",
                "During Return / Transit",
                "Post-Displacement"].join("\n")
            }),
  Field.new({"name" => "incident_timeofday",
             "type" => "select_box",
             "display_name_all" => "Time of day that the Incident took place",
             "option_strings_text_all" => [
                "Morning (sunrise to noon)",
                "Afternoon (noon to sunset)",
                "Evening/Night (sunset to sunrise)",
                "Unknown/Not Applicable"
              ].join("\n")
            }),
  Field.new({"name" => "incident_location_type",
             "type" => "select_box",
             "display_name_all" => "Type of place where the incident took place",
             "option_strings_text_all" => [
                "Bush/Forest",
                "Garden/Cultivated Field",
                "School",
                "Road",
                "Client's Home",
                "Perpetrator's Home",
                "Other",
                "Market",
                "Streamside",
                "Beach",
                "Farm",
                "Latrine",
                "Perpetrator's Friend's Home",
                "Entertainment Centre",
                "Unfinished House",
                "Guest House - Hotel"
              ].join("\n")
            }),
   Field.new({"name" => "incident_location",
              "type" => "select_box",
              "display_name_all" => "Incident Location",
              "option_strings_source" => "Location",
              "searchable_select" => true
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "gbv_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 30,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Incident",
  :fields => gbv_incident_fields,
  :is_first_tab => true,
  "editable" => true,
  "name_all" => "GBV Incident",
  "description_all" => "GBV Incident"
})