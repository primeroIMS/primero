child_preferences_fields_subform = [
  Field.new({"name" => "wishes_name",
             "type" => "text_field",
             "display_name_all" => "Person(s) child wishes to locate"
           }),
  Field.new({"name" => "wishes_preference_relocated",
             "type" => "select_box",
             "display_name_all" => "Preference of the child to be relocated with this person",
             "option_strings_text_all" => "First choice\nSecond choice\nThird choice"
            }),
  Field.new({"name" => "wishes_relationship",
             "type" => "select_box",
             "display_name_all" => "What is this person's relationship to the child?",
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
  Field.new({"name" => "wishes_address",
             "type" => "textarea",
             "display_name_all" => "Last Known Address"
            }),
  Field.new({"name" => "wishes_landmark",
             "type" => "text_field",
             "display_name_all" => "Landmark"
            }),
  Field.new({"name" => "wishes_location",
             "type" => "select_box",
             "display_name_all" => "Last Known Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "wishes_telephone",
             "type" => "text_field",
             "display_name_all" => "Telephone"
            })
]

child_preferences_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 130,
    :order => 10,
    :order_subform => 1,
    :unique_id=>"child_preferences_section",
    :parent_form=>"case",
    "editable"=>true,
    :fields => child_preferences_fields_subform,
    :initial_subforms => 1,
    "name_all" => "Nested Child's Preferences",
    "description_all" => "Child's Preferences Subform",
  "collapsed_fields" => ["wishes_preference_relocated", "wishes_name"]
})

child_wishes_fields = [
  Field.new({"name" => "wishes_child_family_tracing",
             "type" => "radio_button",
             "display_name_all" => "Does child want to trace family members?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_reason_no_tracing",
             "type" => "textarea",
             "display_name_all" => "If the child does NOT want family tracing , explain why"
           }),
  Field.new({"name" => "wishes_reunification",
             "type" => "select_box",
             "display_name_all" => "Does the child want family reunification?",
             "option_strings_text_all" => "Yes, as soon as possible\nYes, but later\nNot sure\nNo"
            }),
  Field.new({"name" => "wishes_reason_no_reunification",
             "type" => "textarea",
             "display_name_all" => "If 'No', 'Not sure', or 'Yes, but later', explain why"
           }),
  Field.new({"name" => "wishes_contacted",
             "type" => "radio_button",
             "display_name_all" => "Has the child heard from/been in contact with any relatives?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_contacted_details",
             "type" => "textarea",
             "display_name_all" => "Please Give Details"
           }),
  ##Subform##
  Field.new({"name" => "child_preferences_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => child_preferences_section.unique_id,
             "display_name_all" => "Child's Preferences"
            }),
  ##Subform##
  Field.new({"name" => "wishes_care_arrangement_desired",
             "type" => "radio_button",
             "display_name_all" => "Does the child wish to continue in the current care arrangement?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_reason_no_care_arrangement",
             "type" => "textarea",
             "display_name_all" => "If the child does NOT want to stay in the current care arrangement, explain why"
           }),
  Field.new({"name" => "wishes_care_arrangement_type_desired",
             "type" => "select_box",
             "display_name_all" => "Type of care arrangement child wishes to have",
             "option_strings_text_all" =>
                                  ["Independent Living",
                                   "Alternative interim care",
                                   "With husband/wife/partner",
                                   "Other family",
                                   "Don't know",
                                   "Other"].join("\n")
            }),
  Field.new({"name" => "wishes_care_arrangement_type_other",
             "type" => "textarea",
             "display_name_all" => "If type of care arrangement child wishes to have is Other, specify"
           }),
  Field.new({"name" => "wishes_location_plan_live",
             "type" => "select_box",
             "display_name_all" => "Where does the child wish/plan to live?",
             "searchable_select" => true,
             "option_strings_source" => "Location"
           }),
  Field.new({"name" => "wishes_address_plan_live",
             "type" => "textarea",
             "display_name_all" => "Street where does the child wish/plan to live?"
           }),
  Field.new({"name" => "wishes_landmarks_plan_live",
             "type" => "text_field",
             "display_name_all" => "Landmarks where does the child wish/plan to live?"
           })
]

FormSection.create_or_update_form_section({
  :unique_id => "child_wishes",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Tracing",
  "editable" => true,
  :fields => child_wishes_fields,
  "name_all" => "Child's Wishes",
  "description_all" => "Child's Wishes"
})
