source_subform_fields = [
  Field.new({"name" => "source_interview_date",
             "type" => "date_field",
             "display_name_all" => "Date of Interview"
            }),
  Field.new({"name" => "interviewer",
             "type" => "select_box",
             "display_name_all" => "Monitor ID",
             "option_strings_text_all" =>
                          ["Option1",
                           "Option2",
                           "Option3"].join("\n")
            }),
  Field.new({"name" => "primary_reporting_organization",
             "type" => "select_box",
             "display_name_all" => "Primary Report Agency",
             "option_strings_text_all" =>
                          ["Option1",
                           "Option2",
                           "Option3"].join("\n")
            }),
  Field.new({"name" => "other_reporting_organization",
             "type" => "select_box",
             "display_name_all" => "Other Reporting Agency",
             "option_strings_text_all" =>
                          ["Option1",
                           "Option2",
                           "Option3"].join("\n")
            }),
  Field.new({"name" => "location_report",
             "type" => "select_box",
             "display_name_all" => "Location of Report",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "source_type",
             "type" => "select_box",
             "display_name_all" => "Type of Source",
             "option_strings_text_all" =>
                          ["Primary",
                           "Supporting-Testimony",
                           "Supporting-Evidence"].join("\n")
            }),
  Field.new({"name" => "source_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "source_violations_notes",
             "type" => "textarea",
             "display_name_all" => "Notes"
            }),
  Field.new({"name" => "source_category",
             "type" => "select_box",
             "display_name_all" => "Category of Source",
             "option_strings_text_all" =>
                          ["Option1",
                           "Option2",
                           "Option3"].join("\n")
            }),
  Field.new({"name" => "source_gender",
             "type" => "select_box",
             "display_name_all" => "Sex of Source",
             "option_strings_text_all" =>
                          ["Male",
                           "Female"].join("\n")
            }),
  Field.new({"name" => "source_age",
             "type" => "select_box",
             "display_name_all" => "Age of Source",
             "option_strings_text_all" =>
                          ["Child",
                           "Adult",
                           "N/A"].join("\n")
            }),
  Field.new({"name" => "source_reliability",
             "type" => "select_box",
             "display_name_all" => "Reliability of Source",
             "option_strings_text_all" =>
                          ["High",
                           "Medium",
                           "Low"].join("\n")
            }),
  Field.new({"name" => "source_reliability_reason",
             "type" => "text_field",
             "display_name_all" => "Details of Source Reliabilty Ranking"
            }),
  Field.new({"name" => "source_id",
             "type" => "text_field",
             "display_name_all" => "Source ID"
            }),
  Field.new({"name" => "source_consent_follow_up",
             "type" => "radio_button",
             "display_name_all" => "Permission for Follow Up or to Contact again?",
             "option_strings_text_all" =>
                          ["Yes", "No"].join("\n")
            }),
  Field.new({"name" => "source_consent_data_sharing",
             "type" => "radio_button",
             "display_name_all" => "Consent for Data Sharing/Reporting?",
             "option_strings_text_all" =>
                          ["Yes",
                           "No",
                           "Don't Know"].join("\n")
            }),
  Field.new({"name" => "source_requires_services",
             "type" => "radio_button",
             "display_name_all" => "If the source is a child, does the child require services?",
             "option_strings_text_all" =>
                          ["Yes", "No"].join("\n")
            })
]

source_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 70,
  :order => 10,
  :order_subform => 1,
  :unique_id => "source_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => source_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Source Subform",
  "description_all" => "Nested Source Subform",
  "collapsed_fields" => ["source_type", "source_violations"]
})

source_fields = [
  Field.new({"name" => "source_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => source_subform_section.unique_id,
             "display_name_all" => "Source"
            })
]

# FormSection.create_or_update_form_section({
#   :unique_id => "source",
#   :parent_form=>"incident",
#   "visible" => true,
#   :order_form_group => 70,
#   :order => 10,
#   :order_subform => 0,
#   :form_group_name => "Source",
#   "editable" => true,
#   :fields => source_fields,
#   "name_all" => "Source",
#   "description_all" => "Source"
# })