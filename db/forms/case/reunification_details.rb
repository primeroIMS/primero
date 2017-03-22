#########################################
# Reunification subform

reunification_subform = [
    Field.new({"name" => "name_reunified_adult",
               "type" => "text_field",
               "display_name_all" => "Name of adult child was reunified with",
              }),
    Field.new({"name" => "relationship_reunified_adult",
               "type" => "text_field",
               "display_name_all" => "Relationship of adult to child",
              }),
    Field.new({"name" => "address_reunified_adult",
               "type" => "textarea",
               "display_name_all" => "Address",
              }),
    Field.new({"name" => "location_reunified_adult",
               "type" => "select_box",
               "display_name_all" => "Location of adult with whom the child was reunified",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "address_reunification",
               "type" => "textarea",
               "display_name_all" => "Address where the reunification is taking place",
              }),
    Field.new({"name" => "location_reunification",
               "type" => "select_box",
               "display_name_all" => "Location where the reunifcation is taking place",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "reunification_type",
               "type" => "select_box",
               "display_name_all" => "What type of reunification?",
               "option_strings_text_all" => [
                  "Case by case",
                  "Informal/Spontaneous",
                  "Mass Tracing",
                  "Mediation",
                  "Other (Please Specify)",
                  "Photo Tracing",
                  "Spontaneous"
               ].join("\n")
              }),
    Field.new({"name" => "date_reunification",
               "type" => "date_field",
               "display_name_all" => "Date of reunification",
              }),
    Field.new({"name" => "child_reunited_with_verified_adult",
               "type" => "radio_button",
               "display_name_all" => "Was the child reunified with the verfified adult?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "not_reunited_with_verified_adult_reason",
               "type" => "select_box",
               "display_name_all" => "If not, what was the reason for the change?",
               "option_strings_text_all" => [
                   "Change of Mind",
                   "Death",
                   "Death of Adult",
                   "Failed Verification",
                   "Not Applicable",
                   "Other (Please Specify)"
               ].join("\n")
              }),
    Field.new({"name" => "reunification_follow_up_needed",
               "type" => "radio_button",
               "display_name_all" => "Is there a need for follow up?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "closure_recommendation",
               "type" => "radio_button",
               "display_name_all" => "If not, do you recommend that the case be closed?",
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
    :initial_subforms => 1,
    "name_all" => "Nested Reunification",
    "description_all" => "Reunification Subform",
    "collapsed_fields" => ["relationship_reunified_adult", "name_reunified_adult"]
})

reunification_details_fields = [
  Field.new({"name" => "reunification_details_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => reunification_details_section.unique_id,
             "display_name_all" => "Reunification Details"
            })
]


FormSection.create_or_update_form_section({
  :unique_id => "reunification_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 140,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Tracing",
  :fields => reunification_details_fields,
  "editable" => true,
  "name_all" => "Reunification Details",
  "description_all" => "Reunification Details",
})