protection_concern_detail_subform_fields = [
  Field.new({"name" => "protection_concern_type",
    "type" => "select_box",
    "display_name_all" => "Type of Protection Concern",
    "option_strings_source" => "lookup lookup-protection-concerns"
  }),
  Field.new({"name" => "date_concern_identified",
    "type" => "select_box",
    "display_name_all" => "Period when identified?",
    "option_strings_text_all" => [
      "Follow up After Reunification",
      "Follow up In Care",
      "Registration",
      "Reunification",
      "Verification"
    ].join("\n")
  }),
  Field.new({"name" => "concern_details",
    "type" => "textarea",
    "display_name_all" => "Details of the concern"
  }),
  Field.new({"name" => "concern_intervention_needed",
    "type" => "select_box",
    "display_name_all" => "Intervention needed?",
    "option_strings_text_all" => [
      "No Further Action Needed",
      "Ongoing Monitoring",
      "Urgent Intervention"
    ].join("\n")
  }),
  Field.new({"name" => "date_concern_intervention_needed_by",
    "type" => "date_field",
    "display_name_all" => "Intervention needed by"
  }),
  Field.new({"name" => "concern_action_taken_already",
    "type" => "tick_box",
    "display_name_all" => "Has action been taken?",
    "tick_box_label_all" => "Yes"
  }),
  Field.new({"name" => "concern_action_taken_details",
    "type" => "textarea",
    "display_name_all" => "Details of Action Taken"
  }),
  Field.new({"name" => "concern_action_taken_date",
    "type" => "date_field",
    "display_name_all" => "Date when action was taken"
  }),
  Field.new({"name" => "concern_is_resolved",
    "type" => "tick_box",
    "display_name_all" => "Protection concern resolved?",
    "tick_box_label_all" => "Yes"
  })
]

protection_concern_detail_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 70,
  :order => 30,
  :order_subform => 1,
  :unique_id => "protection_concern_detail_subform_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => protection_concern_detail_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Protection Concerns Subform",
  "description_all" => "Nested Protection Concerns Subform",
  "collapsed_fields" => ["protection_concern_type"]
})

protection_concern_detail_fields = [
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Protection Concerns",
             "option_strings_source" => "lookup lookup-protection-concerns"
            }),
  Field.new({"name" => "protection_concern_detail_subform_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => protection_concern_detail_subform_section.unique_id,
             "display_name_all" => "Protection Concern Details"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "protection_concern_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Assessment",
  :fields => protection_concern_detail_fields,
  "editable" => true,
  "name_all" => "Protection Concern Details",
  "description_all" => "Protection Concern Details"
})