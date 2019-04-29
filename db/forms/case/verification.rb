verification_subform_fields = [
    Field.new({"name" => "verification_name_inquirer",
               "type" => "text_field",
               "display_name_en" => "Inquirer's Name"
              }),
    Field.new({"name" => "verification_inquirer_relationship",
               "type" => "select_box",
               "display_name_en" => "Relationship",
               "option_strings_source" => "lookup lookup-family-relationship"
              }),
    Field.new({"name" => "verification_inquirer_sex",
               "type" => "select_box",
               "display_name_en" => "Sex",
               "option_strings_source" => "lookup lookup-gender"
              }),
    Field.new({"name" => "verification_inquirer_age",
               "type" => "numeric_field",
               "display_name_en" => "Age"
              }),
    Field.new({"name" => "verification_inquirer_address_current",
               "type" => "textarea",
               "display_name_en" => "Address"
              }),
    Field.new({"name" => "verification_inquirer_location",
               "type" => "select_box",
               "display_name_en" => "Current Location",
               "searchable_select" => true,
               "option_strings_source" => "Location"
              }),
    Field.new({"name" => "verification_phone_inquirer",
               "type" => "text_field",
               "display_name_en" => "Phone"
              }),
    Field.new({"name" => "verification_inquirer_wants_to_care_for_child",
               "type" => "radio_button",
               "display_name_en" => "Do you want the child to come and live with you?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_inquirer_able_to_care_for_child",
               "type" => "radio_button",
               "display_name_en" => "Are you able to care for him/her/them?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_alternate_caregiver_exists",
               "type" => "radio_button",
               "display_name_en" => "If not, is there any other family member who could take the child?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_alternate_caregiver_name",
               "type" => "text_field",
               "display_name_en" => "Name of alternate caregiver"
              }),
    Field.new({"name" => "verification_alternate_caregiver_relationship",
               "type" => "select_box",
               "display_name_en" => "Relationship of Alternate Caregiver",
               "option_strings_source" => "lookup lookup-family-relationship"
              }),
    Field.new({"name" => "verification_address_alternate_caregiver",
               "type" => "textarea",
               "display_name_en" => "Address of that person (alternative caregiver)"
              }),
    Field.new({"name" => "verification_location_alternate_caregiver",
               "type" => "textarea",
               "display_name_en" => "Alternate Caregiver's Village/Area/Physical Address"
              }),
    Field.new({"name" => "verification_comments",
               "type" => "textarea",
               "display_name_en" => "Comments"
              }),
    Field.new({"name" => "verification_acceptance_date",
               "type" => "date_field",
               "display_name_en" => "Date of acceptance to take care of child"
              }),
    Field.new({"name" => "verification_inquirer_known_to_child",
               "type" => "radio_button",
               "display_name_en" => "Does the child know the adult requesting verification?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_inquirer_child_wishes_reunification_with",
               "type" => "radio_button",
               "display_name_en" => "Does the child wish to be reunified with that person?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_inquirer_information_match",
               "type" => "radio_button",
               "display_name_en" => "Does the information given by the child and adult match?",
               "option_strings_source" => "lookup lookup-yes-no"
              }),
    Field.new({"name" => "verification_inquierer_recommendation",
               "type" => "select_box",
               "display_name_en" => "Do you recommend reunifcation and if not what other action?",
               "option_strings_text_en" => [
                 { id: 'yes', display_text: "Yes" },
                 { id: 'no', display_text: "No" },
                 { id: 'further_tracing', display_text: "Further Tracing" },
                 { id: 'long_term_alternative_care', display_text: "Long Term Alternative Care" },
                 { id: 'reunification', display_text: "Reunification" },
                 { id: 'reunification_enhanced_support', display_text: "Reunification with Enhanced Support" }
               ].map(&:with_indifferent_access)
              }),
    Field.new({"name" => "verification_inquierer_recommendation_comments",
               "type" => "text_field",
               "display_name_en" => "Additional comments"
              }),
    Field.new({"name" => "verification_date",
               "type" => "date_field",
               "display_name_en" => "Date of Verification"
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
  :initial_subforms => 0,
  "name_en" => "Nested Verification Subform",
  "description_en" => "Nested Verification Subform",
  "collapsed_field_names" => ["verification_inquirer_relationship", "verification_name_inquirer"]
})

verification_fields = [
  Field.new({"name" => "verification_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section" => verification_subform_section,
             "display_name_en" => "Verification"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "verification",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 30,
  :order_subform => 0,
  :form_group_id => "tracing",
  "editable" => true,
  :fields => verification_fields,
  "name_en" => "Verification",
  "description_en" => "Verification"
})
