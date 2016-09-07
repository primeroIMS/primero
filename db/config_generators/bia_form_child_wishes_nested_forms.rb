wishes_fields = [
  Field.new({"name" => "wishes_name",
             "type" => "text_field",
             "display_name_all" => "Full Name",
             "disabled" => true
           }),
  Field.new({"name" => "wishes_relationship",
             "type" => "select_box",
             "multi_select": false,
             "disabled" => true,
             "display_name_all" => "Relationship to the child?",
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
  Field.new({"name": "wishes_name_age",
             "type": "numeric_field",
             "display_name_all": "Age ",
             "disabled" => true
            }),
  Field.new({"name": "wishes_name_sex",
             "type": "select_box",
             "multi_select": false,
             "disabled" => true,
             "display_name_all": "Sex ",
             "option_strings_text_en": "Male\r\nFemale"
            }),
  Field.new({"name": "wishes_name_alive",
             "type": "select_box",
             "multi_select": false,
             "disabled" => true,
             "display_name_all": "Alive? ",
             "option_strings_text_en": "Alive\r\nDead\r\nUnknown"
            }),
  Field.new({"name" => "wishes_address",
             "type" => "textarea",
             "display_name_all" => "Last Known Address",
             "disabled" => true
            }),
  Field.new({"name" => "wishes_landmark",
             "type" => "text_field",
             "display_name_all" => "Last Known Landmark",
             "disabled" => true
            }),
  Field.new({"name" => "wishes_location",
             "type" => "select_box",
             "display_name_all" => "Last Known Location",
             "searchable_select" => true,
             "option_strings_source" => "Location",
             "disabled" => true
            }),
  Field.new({"name": "wishes_tracing_for_this_person",
             "type": "select_box",
             "multi_select": false,
             "disabled" => true,
             "display_name_en": "Wants tracing for contact or reunification?",
             "option_strings_text_en": "Contact\r\nReunification",
            })
]

wishes = FormSection.create_or_update_form_section({
    :unique_id => "bia_child_wishes_subform",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => wishes_fields,
    :initial_subforms => 1,
    "name_all" => "Child's Preferences",
    "description_all" => "Child's Preferences"
})
