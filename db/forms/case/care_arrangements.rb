care_arrangements_fields = [
  Field.new({"name" => "child_caregiver_status",
             "type" => "radio_button",
             "display_name_en" => "Is this a same caregiver as was previously entered for the child?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "child_caregiver_reason_change",
             "type" => "select_box",
             "display_name_en" => "If this is a new caregiver, give the reason for the change",
             "option_strings_text_en" => [
               { id: 'abuse_exploitation', display_text: "Abuse & Exploitation" },
               { id: 'death_of_caregiver', display_text: "Death of Caregiver" },
               { id: 'Education', display_text: "Education" },
               { id: 'ill_health_of_caregiver', display_text: "Ill health of caregiver" },
               { id: 'other', display_text: "Other" },
               { id: 'poverty', display_text: "Poverty" },
               { id: 'relationship_breakdown', display_text: "Relationship Breakdown" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "care_arrangements_type",
             "type" => "select_box",
             "display_name_en" => "What are the child's current care arrangements?",
             "option_strings_text_en" => [
               { id: 'stays_with_related_caregiver', display_text: "Stays with related caregiver" },
               { id: 'stays_with_unrelated_caregiver', display_text: "Stays with unrelated caregiver" },
               { id: 'residential_care_center', display_text: "Residential Care Center" },
               { id: 'child_headed_household', display_text: "Child Headed Household" },
               { id: 'lives_with_peers_other_children', display_text: "Lives with peers/other children" },
               { id: 'independent_living', display_text: "Independent Living" },
               { id: 'other', display_text: "Other (Please specify)" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "care_arrangements_type_notes",
             "type" => "textarea",
             "display_name_en" => "Care Arrangement Notes"
            }),
  Field.new({"name" => "care_agency_name",
             "type" => "text_field",
             "display_name_en" => "Name of Agency Providing Care Arrangements"
            }),
  Field.new({"name" => "name_caregiver",
             "type" => "text_field",
             "display_name_en" => "Name of Current Caregiver"
            }),
  Field.new({"name" => "relationship_caregiver",
             "type" => "select_box",
             "display_name_en" => "Relationship of the Caregiver to the Child",
             "option_strings_source" => "lookup lookup-family-relationship"
            }),
  Field.new({"name" => "caregiver_id_type_and_no",
             "type" => "text_field",
             "display_name_en" => "Caregiver's Identification - Type and Number"
            }),
  Field.new({"name" => "caregiver_age",
             "type" => "numeric_field",
             "display_name_en" => "Caregiver's Age"
            }),
  Field.new({"name" => "address_caregiver",
             "type" => "textarea",
             "display_name_en" => "Address where the child is currently living?"
            }),
  Field.new({"name" => "location_caregiver",
             "type" => "select_box",
             "display_name_en" => "Caregiver's Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "telephone_caregiver",
             "type" => "text_field",
             "display_name_en" => "Caregiver's Telephone"
            }),
  Field.new({"name" => "care_arrangement_started_date",
             "type" => "date_field",
             "display_name_en" => "When did this care arrangement start?"
            }),
  Field.new({"name" => "caregiver_location_status",
             "type" => "radio_button",
             "display_name_en" => "Is the caregiver's current location temporary",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "address_caregiver_future",
             "type" => "textarea",
             "display_name_en" => "If yes, what is the future address?"
            }),
  Field.new({"name" => "location_caregiver_future",
             "type" => "select_box",
             "display_name_en" => "What is the future location?",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "telephone_caregiver_future",
             "type" => "text_field",
             "display_name_en" => "What is the future telephone?"
            }),
  Field.new({"name" => "caregiver_willing_to_continue",
             "type" => "radio_button",
             "display_name_en" => "Is caregiver willing to continue taking care of the child?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "caregiver_willing_to_continue_for_how_long",
             "type" => "text_field",
             "display_name_en" => "If yes, for how long?"
            }),
  Field.new({"name" => "caregiver_know_family",
             "type" => "radio_button",
             "display_name_en" => "Does the caregiver know the family of the child?",
             "option_strings_source" => "lookup lookup-yes-no"
           }),
  Field.new({"name" => "other_information_from_caregiver",
             "type" => "textarea",
             "display_name_en" => "Other information from the caregiver about the child and his/her family"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "care_arrangements",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 110,
  :order => 10,
  :order_subform => 0,
  :form_group_name_en => "Services / Follow Up",
  "editable" => true,
  :fields => care_arrangements_fields,
  "name_en" => "Care Arrangements",
  "description_en" => "Care Arrangements"
})