verification_subform_fields = [
    Field.new({"name" => "verification_name_inquirer",
               "type" => "text_field",
               "display_name_all" => "Inquirer's Name"
              }),
    Field.new({"name" => "verification_inquirer_relationship",
               "type" => "select_box",
               "display_name_all" => "Relationship",
               "option_strings_text_all" =>
                              ["Mother",
                               "Father",
                               "Aunt",
                               "Uncle",
                               "Grandmother",
                               "Grandfather",
                               "Brother",
                               "Sister",
                               "Husband",
                               "Wife",
                               "Partner",
                               "Other Family",
                               "Other Nonfamily"].join("\n")
              }),
    Field.new({"name" => "verification_inquirer_sex",
               "type" => "select_box",
               "display_name_all" => "Sex",
               "option_strings_text_all" => ["Female", "Male"].join("\n")
              }),
    Field.new({"name" => "verification_inquirer_age",
               "type" => "numeric_field",
               "display_name_all" => "Age"
              }),
    Field.new({"name" => "verification_address_inquirer_current",
               "type" => "select_box",
               "display_name_all" => "Current Location",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "verification_location_inquirer",
               "type" => "textarea",
               "display_name_all" => "Address"
              }),
    Field.new({"name" => "verification_phone_inquirer",
               "type" => "text_field",
               "display_name_all" => "Phone"
              }),
    Field.new({"name" => "verification_inquirer_wants_to_care_for_child",
               "type" => "radio_button",
               "display_name_all" => "Do you want the child to come and live with you?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_inquirer_able_to_care_for_child",
               "type" => "radio_button",
               "display_name_all" => "Are you able to care for him/her/them?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_alternate_caregiver_exists",
               "type" => "radio_button",
               "display_name_all" => "If not, is there any other family member who could take the child?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_alternate_caregiver_name",
               "type" => "text_field",
               "display_name_all" => "Name of alternate caregiver"
              }),
    Field.new({"name" => "verification_alternate_caregiver_relationship",
               "type" => "select_box",
               "display_name_all" => "Relationship of Alternate Caregiver",
               "option_strings_text_all" =>
                              ["Mother",
                               "Father",
                               "Aunt",
                               "Uncle",
                               "Grandmother",
                               "Grandfather",
                               "Brother",
                               "Sister",
                               "Husband",
                               "Wife",
                               "Partner",
                               "Other Family",
                               "Other Nonfamily"].join("\n")
              }),
    Field.new({"name" => "verification_address_alternate_caregiver",
               "type" => "textarea",
               "display_name_all" => "Address of that person (alternative caregiver)"
              }),
    Field.new({"name" => "verification_location_alternate_caregiver",
               "type" => "textarea",
               "display_name_all" => "Alternate Caregiver's Village/Area/Physical Address"
              }),
    Field.new({"name" => "verification_comments",
               "type" => "textarea",
               "display_name_all" => "Comments"
              }),
    Field.new({"name" => "verification_acceptance_date",
               "type" => "date_field",
               "display_name_all" => "Date of acceptance to take care of child"
              }),
    Field.new({"name" => "verification_inquirer_known_to_child",
               "type" => "radio_button",
               "display_name_all" => "Does the child know the adult requesting verification?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_inquirer_child_wishes_reunification_with",
               "type" => "radio_button",
               "display_name_all" => "Does the child wish to be reunified with that person?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_inquirer_information_match",
               "type" => "radio_button",
               "display_name_all" => "Does the information given by the child and adult match?",
               "option_strings_text_all" => ["Yes", "No"].join("\n")
              }),
    Field.new({"name" => "verification_inquierer_recommendation",
               "type" => "select_box",
               "display_name_all" => "Do you recommend reunifcation and if not what other action?",
               "option_strings_text_all" =>
                              ["Yes", "No",
                               "Further Tracing",
                               "Long Term Alternative Care",
                               "Reunification",
                               "Reunification with Enhanced Support"].join("\n")
              }),
    Field.new({"name" => "verification_inquierer_recommendation_comments",
               "type" => "text_field",
               "display_name_all" => "Additional comments"
              }),
    Field.new({"name" => "verification_date",
               "type" => "date_field",
               "display_name_all" => "Date of Verification"
              })
]

verification_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 130,
  :order => 30,
  :order_subform => 1,
  :unique_id => "verification_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => verification_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Verification Subform",
  "description_all" => "Nested Verification Subform",
  "collapsed_fields" => ["verification_inquirer_relationship", "verification_name_inquirer"]
})

verification_fields = [
  Field.new({"name" => "verification_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => verification_subform_section.unique_id,
             "display_name_all" => "Verification"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "verification",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Tracing",
  "editable" => true,
  :fields => verification_fields,
  "name_all" => "Verification",
  "description_all" => "Verification"
})