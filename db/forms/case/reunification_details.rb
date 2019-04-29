#########################################
# Reunification subform

reunification_subform = [
    Field.new({"name" => "name_reunified_adult",
               "type" => "text_field",
               "display_name_en" => "Name of adult child was reunified with",
              }),
    Field.new({"name" => "relationship_reunified_adult",
               "type" => "text_field",
               "display_name_en" => "Relationship of adult to child",
              }),
    Field.new({"name" => "address_reunified_adult",
               "type" => "textarea",
               "display_name_en" => "Address",
              }),
    Field.new({"name" => "location_reunified_adult",
               "type" => "select_box",
               "display_name_en" => "Location of adult with whom the child was reunified",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "address_reunification",
               "type" => "textarea",
               "display_name_en" => "Address where the reunification is taking place",
              }),
    Field.new({"name" => "location_reunification",
               "type" => "select_box",
               "display_name_en" => "Location where the reunifcation is taking place",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "reunification_type",
               "type" => "select_box",
               "display_name_en" => "What type of reunification?",
               "option_strings_text_en" => [
                 { id: 'case_by_case', display_text: "Case by case" },
                 { id: 'informal_spontaneous', display_text: "Informal/Spontaneous" },
                 { id: 'mass_tracing', display_text: "Mass Tracing" },
                 { id: 'mediation', display_text: "Mediation" },
                 { id: 'other', display_text: "Other (Please Specify)" },
                 { id: 'photo_tracing', display_text: "Photo Tracing" },
                 { id: 'spontaneous', display_text: "Spontaneous" }
               ].map(&:with_indifferent_access)
              }),
    Field.new({"name" => "date_reunification",
               "type" => "date_field",
               "display_name_en" => "Date of reunification",
              }),
    Field.new({"name" => "child_reunited_with_verified_adult",
               "type" => "radio_button",
               "display_name_en" => "Was the child reunified with the verfified adult?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "not_reunited_with_verified_adult_reason",
               "type" => "select_box",
               "display_name_en" => "If not, what was the reason for the change?",
               "option_strings_text_en" => [
                 { id: 'change_of_mind', display_text: "Change of Mind" },
                 { id: 'death', display_text: "Death" },
                 { id: 'death_of_adult', display_text: "Death of Adult" },
                 { id: 'failed_verification', display_text: "Failed Verification" },
                 { id: 'n_a', display_text: "Not Applicable" },
                 { id: 'other', display_text: "Other (Please Specify)" }
               ].map(&:with_indifferent_access)
              }),
    Field.new({"name" => "reunification_follow_up_needed",
               "type" => "radio_button",
               "display_name_en" => "Is there a need for follow up?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "closure_recommendation",
               "type" => "radio_button",
               "display_name_en" => "If not, do you recommend that the case be closed?",
               "option_strings_source" => "lookup lookup-yes-no"
              })
]

reunification_details_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 130,
    :order => 20,
    :order_subform => 1,
    :unique_id=>"reunification_details_section",
    :parent_form=>"case",
    "editable"=>true,
    :fields => reunification_subform,
    :initial_subforms => 0,
    "name_en" => "Nested Reunification",
    "description_en" => "Reunification Subform",
    "collapsed_field_names" => ["relationship_reunified_adult", "name_reunified_adult"]
})

reunification_details_fields = [
  Field.new({"name" => "reunification_details_section",
             "type" => "subform", "editable" => true,
             "subform_section" => reunification_details_section,
             "display_name_en" => "Reunification Details"
            })
]


FormSection.create_or_update_form_section({
  :unique_id => "reunification_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 140,
  :order => 40,
  :order_subform => 0,
  :form_group_id => "tracing",
  :fields => reunification_details_fields,
  "editable" => true,
  "name_en" => "Reunification Details",
  "description_en" => "Reunification Details",
})