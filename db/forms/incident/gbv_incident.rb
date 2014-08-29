gbv_incident_fields = [
  Field.new({"name" => "incident_id",
             "type" => "text_field",
             "editable" => false,
             "display_name_all" => "Incident ID"
            }),
  Field.new({"name" => "incident_code",
             "type" => "text_field",
             "editable" => false,
             "display_name_all" => "Incident Code"
            }),
  Field.new({"name" => "consent_reporting",
             "type" => "select_box",
             "display_name_all" => "Consent is given to share non-identifiable information for reporting",
             "option_strings_text_all" => "Yes\nNo"
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
  Field.new({"name" => "displacement_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Stage of displacement at time of incident",
             "option_strings_text_all" => [
                "Not Displaced/Home Country",
                "Pre-displacement",
                "During Flight",
                "During Refuge",
                "During Return/Transit",
                "Post-Displacement",
                "Other, please specify"].join("\n")
            }),
  Field.new({"name" => "if_other_specify",
             "type" => "text_field",
             "display_name_all" => "If other, please specify"
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
  Field.new({"name" => "incident_location_1",
             "type" => "text_field",
             "display_name_all" => "Area"
            }),
  Field.new({"name" => "incident_location_2",
             "type" => "text_field",
             "display_name_all" => "Sub-Area"
            }),
  Field.new({"name" => "Incident_location_3",
             "type" => "text_field",
             "display_name_all" => "Camp/Town/Site/Village"
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
  :perm_visible => true,
  :is_first_tab => true,
  "editable" => true,
  "name_all" => "GBV Incident",
  "description_all" => "GBV Incident"
})