interview_details_fields = [
  Field.new({"name" => "arrival_date",
             "type" => "date_field",
             "display_name_en" => "Arrival Date"
            }),
  Field.new({"name" => "interview_date",
             "type" => "date_field",
             "display_name_en" => "Interview Date"
            }),
  Field.new({"name" => "interviewer_name",
             "type" => "text_field",
             "display_name_en" => "Interviewer Name"
            }),
  Field.new({"name" => "interviewer_postion",
             "type" => "text_field",
             "display_name_en" => "Interviewer Position"
            }),
  Field.new({"name" => "interviewer_agency",
             "type" =>"select_box" ,
             "display_name_en" => "Interviewer Agency",
             "option_strings_text_en" => [
               { id: 'agency_1', display_text: "Agency 1" },
               { id: 'agency_2', display_text: "Agency 2" },
               { id: 'agency_3', display_text: "Agency 3" },
               { id: 'agency_4', display_text: "Agency 4" },
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "address_interview",
             "type" => "textarea",
             "display_name_en" => "Interview Address"
            }),
  Field.new({"name" => "landmark_interview",
             "type" => "text_field",
             "display_name_en" => "Interview Landmark"
            }),
  Field.new({"name" => "location_interview",
             "type" =>"select_box",
             "display_name_en" => "Interview Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "source_interview",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_en" => "Information Obtained From",
             "option_strings_text_en" => [
               { id: 'child', display_text: "Child" },
               { id: 'caregiver', display_text: "Caregiver" },
               { id: 'gbv_survivor', display_text: "GBV Survivor" },
               { id: 'other', display_text: "Other, please specify" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "source_interview_other",
             "type" =>"text_field" ,
             "display_name_en" => "If information obtained from Other, please specify."
            }),
  Field.new({"name" => "other_org_interview_status",
             "type" => "radio_button",
             "display_name_en" => "Has the child been interviewed by another organization?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "other_org_reference_no",
             "type" =>"text_field" ,
             "display_name_en" => "Reference No. given to child by other organization"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"interview_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 40,
  :order_subform => 0,
  :form_group_id => "identification_registration",
  "editable" => true,
  :fields => interview_details_fields,
  "name_en" => "Interview Details",
  "description_en" => "Interview Details"
})
