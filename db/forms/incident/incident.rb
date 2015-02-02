incident_fields = [
  Field.new({"name" => "incident_id",
             "type" => "text_field",
             "editable" => false,
             "display_name_all" => "Long ID",
             "create_property" => false
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field",
             "editable" => false,
             "display_name_all" => "Incident ID",
             "create_property" => false
            }),
  Field.new({"name" => "incident_code",
             "type" => "text_field",
             "editable" => false,
             "display_name_all" => "Incident Code"
            }),
  Field.new({"name" => "violation_category",
             "type" => "select_box",
             "display_name_all" => "Violation Category",
             "multi_select" => true,
             "option_strings_text_all" => [
                 { id: 'killing', display_text: "Killing of Children" },
                 { id: 'maiming', display_text: "Maiming of Children" },
                 { id: 'abduction', display_text: "Abduction" },
                 { id: 'recruitment', display_text: "Recruitment or Use of Child Soldiers" },
                 { id: 'sexual_violence', display_text: "Rape or Other Grave Sexual Violence" },
                 { id: 'attack_on_schools', display_text: "Attacks on Schools" },
                 { id: 'attack_on_hospitals', display_text: "Attacks on Hospitals" },
                 { id: 'denial_humanitarian_access', display_text: "Denial of Humanitarian Access" },
                 { id: 'other', display_text: "Other" }
              ],
              "help_text" => "When removing a violation category, please ensure that you have removed all Violation forms associated with the violation category. To do this, navigate to the Violations forms, find the specific violation type, and click the remove button on all sub-forms for the violation category."
            }),
  Field.new({"name" => "date_of_first_report",
             "type" => "date_field",
             "display_name_all" => "Date of First Report"
            }),
  Field.new({"name" => "date_of_incident",
             "type" => "date_range",
             "display_name_all" => "Date of Incident"
            }),
  Field.new({"name" => "estimated_indicator",
             "type" => "radio_button",
             "display_name_all" => "Is the date estimated?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "date_description",
             "type" => "textarea",
             "display_name_all" => "Notes on Dates"
            }),
  Field.new({"name" => "super_incident_name",
             "type" => "text_field",
             "display_name_all" => "Name of Super Incident/Event"
            }),
  Field.new({"name" => "un_eyewitness",
             "type" => "radio_button",
             "display_name_all" => "Did UN staff or other MRM-trained affiliate witness the incident?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "monitor_number",
             "type" => "text_field",
             "display_name_all" => "Eye Witness Monitor Number"
            }),
  Field.new({"name" => "status",
             "type" => "select_box",
             "display_name_all" => "Incident Status",
             "option_strings_source" => "lookup IncidentStatus"
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of Incident"
            }),
  Field.new({"name" => "incident_description_for_public_sharing",
             "type" => "textarea",
             "display_name_all" => "Account of Incident for Public Sharing"
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
            }),
  Field.new({"name" => "incident_location_notes",
              "type" => "text_field",
              "display_name_all" => "Notes on Location"
            }),
  Field.new({"name" => "incident_latitude",
             "type" => "text_field",
             "display_name_all" => "Latitude"
            }),
  Field.new({"name" => "incident_longitude",
             "type" => "text_field",
             "display_name_all" => "Longitude"
            }),
  Field.new({"name" => "number_of_individual_perpetrators",
             "type" => "select_box",
             "display_name_all" => "Number of alleged perpetrator(s)",
              "option_strings_text_all" => [
                "1",
                "2",
                "3",
                "More than 3",
                "Unknown"
              ].join("\n")
            }),
  Field.new({"name" => "incident_total_tally",
       "type" => "tally_field",
       "display_name_all" => "Incident Total Victims/Survivors",
       "autosum_group" => "incident_number_of_victims_survivors",
       "tally" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
]

FormSection.create_or_update_form_section({
  :unique_id => "incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 30,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Incident",
  :fields => incident_fields,
  :is_first_tab => true,
  "editable" => true,
  "name_all" => "Incident",
  "description_all" => "Incident"
})