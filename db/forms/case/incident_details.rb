incident_details_subform_fields = [
  Field.new({"name" => "cp_incident_identification_violence",
             "type" => "select_box",
             "display_name_all" => "Identification of Violence Case",
             "option_strings_text_all" =>
                          ["Disclosure / complaint by the abused person or family member",
                           "Discovered by service provider",
                           "Report by the institution providing the service (discovery)",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "cp_incident_violence_header",
             "type" => "separator",
             "display_name_all" => "Violence Incident",
            }),
  Field.new({"name" => "cp_incident_date",
            "type" => "date_field",
            "display_name_all" => "Date of Incident"
            }),
  Field.new({"name" => "cp_incident_location_type",
             "type" => "select_box",
             "display_name_all" => "Area of the Incident",
             "option_strings_text_all" =>
                          ["Home",
                           "Street",
                           "School",
                           "Work Place",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "cp_incident_location_type_other",
             "type" => "text_field",
             "display_name_all" => "If 'Other', please specify"
            }),
  Field.new({"name" => "cp_incident_location",
             "type" => "select_box",
             "display_name_all" => "Governorate / District of the Incident",
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "cp_incident_timeofday",
             "type" => "select_box",
             "display_name_all" => "Time of Incident",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_text_all" =>
                          ["Morning",
                           "Noon",
                           "Evening",
                           "Night"].join("\n")
            }),
  Field.new({"name" => "cp_incident_timeofday_actual",
             "type" => "text_field",
             "display_name_all" => "Please specify the actual time of the Incident",
             "help_text_all" => "(This information is entered by the case coordinator.)"
            }),
  Field.new({"name" => "cp_incident_sexual_violence_type",
             "type" => "select_box",
             "display_name_all" => "Type of Violence",
             "option_strings_text_all" =>
                          ["Physical",
                           "Sexual - within the family",
                           "Sexual - outside the family",
                           "Neglect",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "cp_incident_family_members_affected",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Family members affected by the incident",
             "option_strings_text_all" =>
                          ["Wife",
                           "Child/Children",
                           "Wife and Children",
                           "Others"].join("\n")
            }),
  Field.new({"name" => "cp_incident_previous_incidents",
             "type" => "radio_button",
             "display_name_all" => "Has the case been previously abused?",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_previous_incidents_description",
             "type" => "textarea",
             "display_name_all" => "If yes please describe in brief",
             "help_text_all" => "(This information is entered by the case coordinator.)"
            }),
  Field.new({"name" => "cp_incident_abuser_header",
             "type" => "separator",
             "display_name_all" => "Abuser information",
            }),
  Field.new({"name" => "cp_incident_abuser_name",
             "type" => "text_field",
             "display_name_all" => "Name"
            }),
  Field.new({"name" => "cp_incident_abuser_psychological_problem",
             "type" => "radio_button",
             "display_name_all" => "Does the abuser suffer from psychological problem",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_abuser_alcohol_drugs",
             "type" => "radio_button",
             "display_name_all" => "Is the abuser suffer from addiction to alcohol or drugs",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_abuser_criminal_record",
             "type" => "radio_button",
             "display_name_all" => "Does the abuser have a criminal record",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_abuser_threaten_abused_family",
             "type" => "radio_button",
             "display_name_all" => "Did the abuser threaten the abused or any family member",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_perpetrator_nationality",
             "type" => "select_box",
             "display_name_all" => "Nationality",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "perpetrator_sex",
             "type" => "radio_button",
             "display_name_all" => "Sex",
             "option_strings_text_all" => ["Male", "Female"].join("\n")
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
             "display_name_all" => "National ID Number for Jordanian"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_type",
             "type" => "text_field",
             "display_name_all" => "Type of Other ID Document (for non Jordanian)"
            }),
  Field.new({"name" => "cp_incident_perpetrator_other_id_no",
             "type" => "text_field",
             "display_name_all" => "Number of Other ID Document (for non Jordanian) "
            }),
  Field.new({"name" => "cp_incident_perpetrator_marital_status",
             "type" =>"select_box" ,
             "display_name_all" => "Social Status",
             "show_on_minify_form" => true,
             "option_strings_text_all" =>
                          ["Single",
                           "Married",
                           "Divorced",
                           "Separated",
                           "Widow"].join("\n")
            }),
  Field.new({"name" => "cp_incident_perpetrator_educational_status",
             "type" =>"select_box" ,
             "display_name_all" => "Educational Status",
             "option_strings_source" => "lookup lookup-perpetrator-education"
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
             "type" => "text_field",
             "display_name_all" => "Profession",
             "visible" => false
            }),
  Field.new({"name" => "cp_incident_perpetrator_occupation_lookup",
             "type" =>"select_box",
             "display_name_all" => "Profession",
             "option_strings_source" => "lookup lookup-perpetrator-occupation"
            }),
  Field.new({"name" => "cp_incident_perpetrator_work_place",
             "type" => "text_field",
             "display_name_all" => "Work Place",
            }),
  Field.new({"name" => "cp_incident_perpetrator_work_phone",
             "type" => "text_field",
             "display_name_all" => "Work Phone",
            }),
  Field.new({"name" => "cp_incident_perpetrator_work_address",
             "type" => "textarea",
             "display_name_all" => "Work Address",
            }),
  Field.new({"name" => "cp_incident_perpetrator_relationship",
             "type" =>"select_box" ,
             "display_name_all" => "Relationship with the abused",
             "option_strings_text_all" =>
                          ["Husband (or ex-husband)",
                           "Family member",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "primary_risk_indicators_header",
             "type" => "separator",
             "display_name_all" => "Primary Risk Indicators",
             "visible" => false
            }),
  Field.new({"name" => "primary_risk_indicators_physical",
             "type" => "radio_button",
             "display_name_all" => "Does the abused suffer from physical injuries?",
             "option_strings_source" => "lookup lookup-yes-no",
             "visible" => false
            }),
  Field.new({"name" => "primary_risk_indicators_mental",
             "type" => "radio_button",
             "display_name_all" => "Does the abused suffer from mental instability?",
             "option_strings_source" => "lookup lookup-yes-no",
             "visible" => false
            }),
  Field.new({"name" => "primary_risk_indicators_safety",
             "type" => "radio_button",
             "display_name_all" => "Does the abused show fear on safety for himself or other family members?",
             "option_strings_source" => "lookup lookup-yes-no",
             "visible" => false
            }),
  Field.new({"name" => "primary_risk_indicators_violence_now",
             "type" => "radio_button",
             "display_name_all" => "Is the violence incident happening now?",
             "option_strings_source" => "lookup lookup-yes-no",
             "visible" => false
            }),
  Field.new({"name" => "cp_incident_violence_header_2",
             "type" => "separator",
             "display_name_all" => "Violence Incident "
            }),
  Field.new({"name" => "cp_incident_reported_elsewhere",
             "type" => "radio_button",
             "display_name_all" => "Did the Abused report on the incident?",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "cp_incident_reported_elsewhere_organization_type",
             "type" =>"select_box" ,
             "display_name_all" => "If yes please specify the institution",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "option_strings_text_all" =>
                          ["Family Protection Department",
                           "Institution concerned with Domestic Violence",
                           "Health Institution",
                           "Psychosocial Institution",
                           "Legal Institution",
                           "Other"].join("\n")
            }),
  Field.new({"name" => "cp_incident_procedure_performed",
             "type" => "textarea",
             "help_text_all" => "(This information is entered by the case coordinator.)",
             "display_name_all" => "What procedure has been carried out (in case of reporting)?"
            }),
  Field.new({"name" => "cp_incident_reporting",
             "type" => "radio_button",
             "display_name_all" => "Does this incident meet the criteria for Mandatory Reporting",
             "help_text_all" => "(This determination is made by the supervisor or case coordinator.)",
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
                  •        Has the abused been assaulted/threatened  by a weapon or sharp tools?
                  •        Does the abused suffer of any of the following symptoms  : Bouts of severe crying, aggressiveness, stupor, confusion, confusion, inability to concentrate, fear, trembling, anxiety?
                  •        Does the abused show suicidal tendencies  or thoughts?
                  •        Does the abused represent a treat on others?
                  •        Is there a direct threat from the abuser or any of his family members?
                  •        Does the abused indicate fear on herself or other family members?
                  •        Had the abused been seriously assaulted previously in an incident of violence?",
             "option_strings_source" => "lookup lookup-yes-no"
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
  "collapsed_fields" => ["cp_incident_sexual_violence_type", "cp_incident_date"]
})

incident_details_fields = [
  Field.new({
    "name" => "incident_details_form_description",
    "type" => "separator",
    "display_name_all" => "The Incident Details form fields correspond to the fields in the Reception and Initial Assessment paper forms."
  }),
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
