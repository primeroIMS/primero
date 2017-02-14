interview_details_fields = [
  Field.new({"name" => "arrival_date",
             "type" => "date_field",
             "display_name_all" => "Arrival Date"
            }),
  Field.new({"name" => "interviewer_name",
             "type" => "text_field",
             "display_name_all" => "Interviewer Name"
            }),
  Field.new({"name" => "interviewer_postion",
             "type" => "text_field",
             "display_name_all" => "Interviewer Position"
            }),
  Field.new({"name" => "interviewer_agency",
             "type" =>"select_box" ,
             "display_name_all" => "Interviewer Agency",
             "option_strings_text_all" =>
                          ["Agency 1",
                           "Agency 2",
                           "Agency 3",
                           "Agency 4"].join("\n")
            }),
  Field.new({"name" => "address_interview",
             "type" => "textarea",
             "display_name_all" => "Interview Address"
            }),
  Field.new({"name" => "landmark_interview",
             "type" => "text_field",
             "display_name_all" => "Interview Landmark"
            }),
  Field.new({"name" => "location_interview",
             "type" =>"select_box",
             "display_name_all" => "Interview Location",
             "searchable_select" => true,
             "option_strings_source" => "Location"
            }),
  Field.new({"name" => "source_interview",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Information Obtained From",
             "option_strings_text_all" =>
                          ["Child",
                           "Caregiver",
                           "GBV Survivor",
                           "Other, please specify"].join("\n")
            }),
  Field.new({"name" => "source_interview_other",
             "type" =>"text_field" ,
             "display_name_all" => "If information obtained from Other, please specify."
            }),
  Field.new({"name" => "other_org_interview_status",
             "type" => "radio_button",
             "display_name_all" => "Has the child been interviewed by another organization?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "other_org_reference_no",
             "type" =>"text_field" ,
             "display_name_all" => "Reference No. given to child by other organization"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"interview_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => interview_details_fields,
  "name_all" => "Interview Details",
  "description_all" => "Interview Details"
})
