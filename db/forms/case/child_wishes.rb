child_preferences_fields_subform = [
  Field.new({"name" => "wishes_name",
             "type" => "text_field",
             "display_name_en" => "Person(s) child wishes to locate"
           }),
  Field.new({"name" => "wishes_preference_relocated",
             "type" => "select_box",
             "display_name_en" => "Preference of the child to be relocated with this person",
             "option_strings_text_en" => [
               { id: 'first_choice', display_text: "First choice" },
               { id: 'second_choice', display_text: "Second choice" },
               { id: 'third_choice', display_text: "Third choice" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "wishes_relationship",
             "type" => "select_box",
             "display_name_en" => "What is this person's relationship to the child?",
             "option_strings_source" => "lookup lookup-family-relationship"
            }),
  Field.new({"name" => "wishes_address",
             "type" => "textarea",
             "display_name_en" => "Last Known Address"
            }),
  Field.new({"name" => "wishes_landmark",
             "type" => "text_field",
             "display_name_en" => "Landmark"
            }),
  Field.new({"name" => "wishes_location",
             "type" => "select_box",
             "display_name_en" => "Last Known Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "wishes_telephone",
             "type" => "text_field",
             "display_name_en" => "Telephone"
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
    :initial_subforms => 0,
    "name_en" => "Nested Child's Preferences",
    "description_en" => "Child's Preferences Subform",
    "collapsed_field_names" => ["wishes_preference_relocated", "wishes_name"]
})

child_wishes_fields = [
  Field.new({"name" => "wishes_child_family_tracing",
             "type" => "radio_button",
             "display_name_en" => "Does child want to trace family members?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_reason_no_tracing",
             "type" => "textarea",
             "display_name_en" => "If the child does NOT want family tracing , explain why"
           }),
  Field.new({"name" => "wishes_reunification",
             "type" => "select_box",
             "display_name_en" => "Does the child want family reunification?",
             "option_strings_text_en" => [
               { id: 'yes_as_soon_as_possible', display_text: "Yes, as soon as possible" },
               { id: 'yes_but_later', display_text: "Yes, but later" },
               { id: 'not_sure', display_text: "Not sure" },
               { id: 'no', display_text: "No" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "wishes_reason_no_reunification",
             "type" => "textarea",
             "display_name_en" => "If 'No', 'Not sure', or 'Yes, but later', explain why"
           }),
  Field.new({"name" => "wishes_contacted",
             "type" => "radio_button",
             "display_name_en" => "Has the child heard from/been in contact with any relatives?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_contacted_details",
             "type" => "textarea",
             "display_name_en" => "Please Give Details"
           }),
  ##Subform##
  Field.new({"name" => "child_preferences_section",
             "type" => "subform",
             "editable" => true,
             "subform_section" => child_preferences_section,
             "display_name_en" => "Child's Preferences"
            }),
  ##Subform##
  Field.new({"name" => "wishes_care_arrangement_desired",
             "type" => "radio_button",
             "display_name_en" => "Does the child wish to continue in the current care arrangement?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "wishes_reason_no_care_arrangement",
             "type" => "textarea",
             "display_name_en" => "If the child does NOT want to stay in the current care arrangement, explain why"
           }),
  Field.new({"name" => "wishes_care_arrangement_type_desired",
             "type" => "select_box",
             "display_name_en" => "Type of care arrangement child wishes to have",
             "option_strings_text_en" => [
               { id: 'independent_living', display_text: "Independent Living" },
               { id: 'alternative_interim_care', display_text: "Alternative interim care" },
               { id: 'with_husband_wife_partner', display_text: "With husband/wife/partner" },
               { id: 'other_family', display_text: "Other family" },
               { id: 'dont_know', display_text: "Don't know" },
               { id: 'other', display_text: "Other" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "wishes_care_arrangement_type_other",
             "type" => "textarea",
             "display_name_en" => "If type of care arrangement child wishes to have is Other, specify"
           }),
  Field.new({"name" => "wishes_location_plan_live",
             "type" => "select_box",
             "display_name_en" => "Where does the child wish/plan to live?",
             "searchable_select" => true,
             "option_strings_source" => "Location"
           }),
  Field.new({"name" => "wishes_address_plan_live",
             "type" => "textarea",
             "display_name_en" => "Street where does the child wish/plan to live?"
           }),
  Field.new({"name" => "wishes_landmarks_plan_live",
             "type" => "text_field",
             "display_name_en" => "Landmarks where does the child wish/plan to live?"
           })
]

FormSection.create_or_update_form_section({
  :unique_id => "child_wishes",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 130,
  :order => 10,
  :order_subform => 0,
  :form_group_id => "tracing",
  "editable" => true,
  :fields => child_wishes_fields,
  "name_en" => "Child's Wishes",
  "description_en" => "Child's Wishes"
})
