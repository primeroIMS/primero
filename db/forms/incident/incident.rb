incident_fields = [
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
  Field.new({"name" => "violation_category",
             "type" => "select_box",
             "display_name_all" => "Violation Category",
             "multi_select" => true,
             "option_strings_text_all" => [
                "Killing of Children",
                "Maiming of Children",
                "Abduction",
                "Recruitment or Use of Child Soldiers",
                "Rape or Other Grave Sexual Violence",
                "Attacks on Schools",
                "Attacks on Hospitals",
                "Denial of Humanitarian Access",
                "Other"
              ].join("\n")
            }),
  Field.new({"name" => "date_of_first_report",
             "type" => "date_field",
             "display_name_all" => "Date of First Report or Interview"
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
  Field.new({"name" => "super_incident_name",
             "type" => "text_field",
             "display_name_all" => "Name of Super Incident/Event"
            }),  
  Field.new({"name" => "UN_eyewitness",
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
             "option_strings_text_all" => [
                "Active",
                "Inactive"
              ].join("\n")
            }),
  Field.new({"name" => "mrm_verification_status", # TODO: populate from verified
             "type" => "text_field",
             "display_name_all" => "MRM Verification Status"
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
                "Customizable. Default values:",
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
  Field.new({"name" => "incident_latitude",
             "type" => "text_field",
             "display_name_all" => "Latitude"
            }),
  Field.new({"name" => "incident_longitude",
             "type" => "text_field",
             "display_name_all" => "Longitude"
            }),
  Field.new({"name" => "incident_location_1", # TODO: Customizable
             "type" => "text_field",
             "display_name_all" => "Area"
            }),
  Field.new({"name" => "incident_location_2", # TODO: Customizable
             "type" => "text_field",
             "display_name_all" => "Sub-Area"
            }),
  Field.new({"name" => "Incident_location_3", # TODO: Customizable
             "type" => "text_field",
             "display_name_all" => "Camp/Town/Site/Village"
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
  Field.new({"name" => "incident_total_boys",
             "type" => "numeric_field",
             "display_name_all" => "Incident Total Victims/Survivors:Boys",
             "autosum_group" => "incident_number_of_victims_survivors"
            }),
  Field.new({"name" => "incident_total_girls",
             "type" => "numeric_field",
             "display_name_all" => "Incident Total Victims/Survivors:Girls",
             "autosum_group" => "incident_number_of_victims_survivors"
            }),
  Field.new({"name" => "incident_total_unknown",
             "type" => "numeric_field",
             "display_name_all" => "Incident Total Victims/Survivors:Unknown",
             "autosum_group" => "incident_number_of_victims_survivors"
            }), 
  Field.new({"name" => "incident_total_total",
             "type" => "numeric_field",
             "display_name_all" => "Incident Total Victims/Survivors:Total",
             "autosum_total" => true,
             "autosum_group" => "incident_number_of_victims_survivors"
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