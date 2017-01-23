incident_fields = [
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
  Field.new({"name" => "status",
             "type" => "select_box",
             "display_name_all" => "Incident Status",
             "option_strings_source" => "lookup IncidentStatus",
             "help_text_all" => "Please select duplicate if the incident was mistakenly entered multiple times in the database."
            }),
  Field.new({"name" => "incident_title",
             "type" => "text_field",
             "display_name_all" => "Incident title",
             "help_text_all" => "One-line description of the incident"
            }),
  Field.new({"name" => "violation_category",
             "type" => "select_box",
             "display_name_all" => "Relevant violations",
             "multi_select" => true,
             "option_strings_text_all" => [
                 { id: 'killing', display_text: "Killing of Children" },
                 { id: 'maiming', display_text: "Maiming of Children" },
                 { id: 'abduction', display_text: "Abduction" },
                 { id: 'recruitment', display_text: "Recruitment and/or use of children" },
                 { id: 'sexual_violence', display_text: "Rape and/or other forms of sexual violence" },
                 { id: 'attack_on', display_text: "Attacks on schools and/or hospitals" },
                 { id: 'military_use', display_text: "Military use of schools and/or hospitals" },
                 { id: 'denial_humanitarian_access', display_text: "Denial of humanitarian access for children" },
                 #{ id: 'other', display_text: "Other" }
              ],
              "help_text" => "If you have entered and saved a violation subform and you want to REMOVE it "\
                             "from reporting (e.g. if the violation was entered by mistake, and should not "\
                             "be counted in the reports), you may delete any data you have entered in that subform, "\
                             "and save the record."\
                             "\n"\
                             "Please do not click on the Action -> Disable button to remove a single violation subform, "\
                             "as the ‘Disable’ button will disable (and exclude from the reports) the whole incident, "\
                             "and not just a single violation."
            }),
  Field.new({"name" => "date_of_first_report",
             "type" => "date_field",
             "display_name_all" => "Date of initial report to CTFMR member"
            }),
  Field.new({"name" => "date_of_incident",
             "type" => "date_range",
             "display_name_all" => "Date of the incident"
            }),
  Field.new({"name" => "estimated_indicator",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is the date/date range estimated?",
            }),
  Field.new({"name" => "date_description",
             "type" => "textarea",
             "display_name_all" => "Additional details on date(s)"
            }),
  Field.new({"name" => "incident_location_type",
             "type" => "select_box",
             "display_name_all" => "Type of place where the incident took place",
             "option_strings_text_all" => ["Religious building", "Cultural property", "Farming field", "Bush/Forest",
                                           "IDP/Refugee camp", "UN premises", "Non-Governmental Organization premises",
                                           "Civil Society Organization premises", "Street/Road", "Market", "Hospital",
                                           "School", "Military facility", "Government building", "Private house",
                                           "Area under partial or full control by armed groups",
                                           "Area close to military installations", "Populated area", "Isolated area",
                                           "Playground", "Sport facility", "Other"].join("\n")
            }),
  Field.new({"name" => "incident_location_type_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please provide details"
            }),
  Field.new({"name" => "incident_location",
              "type" => "select_box",
              "display_name_all" => "Incident location",
              "option_strings_source" => "Location",
              "searchable_select" => true
            }),
  Field.new({"name" => "incident_latitude",
             "type" => "text_field",
             "display_name_all" => "Latitude"
            }),
  Field.new({"name" => "incident_longitude",
             "type" => "text_field",
             "display_name_all" => "Longitude"
            }),
  Field.new({"name" => "incident_location_notes",
             "type" => "text_field",
             "display_name_all" => "Additional details on location"
            }),
  Field.new({"name" => "incident_description",
             "type" => "textarea",
             "display_name_all" => "Account of the incident (strictly confidential)",
             "guiding_questions_all" => "The information entered here is intended to be exclusively shared with authorized CTFMR members, and not for public dissemination."
            }),
  Field.new({"name" => "incident_description_for_public_sharing",
             "type" => "textarea",
             "display_name_all" => "Account of the incident for public sharing",
             "guiding_questions_all" => "The information entered here should not include any sensitive details, including names of victims, witnesses and sources."
            }),
  Field.new({"name" => "incident_total_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "incident_number_of_victims_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "number_of_individual_perpetrators",
             "type" => "select_box",
             "display_name_all" => "Number of alleged perpetrators",
              "option_strings_text_all" => [
                "1",
                "2",
                "3",
                "More than 3",
                "Unknown"
              ].join("\n")
            }),
  Field.new({"name" => "incident_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details on the incident",
             "help_text_all" => "E.g. time of the day at which the incident took place",
             "guiding_questions" => "Supporting materials can be uploaded in the 'Supporting materials' form"
            })
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