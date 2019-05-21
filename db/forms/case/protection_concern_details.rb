protection_concern_detail_subform_fields = [
  Field.new({"name" => "protection_concern_type",
    "type" => "select_box",
    "display_name_en" => "Type of Protection Concern",
    "option_strings_source" => "lookup lookup-protection-concerns"
  }),
  Field.new({"name" => "date_concern_identified",
    "type" => "select_box",
    "display_name_en" => "Period when identified?",
    "option_strings_text_en" => [
      { id: 'follow_up_after_reunification', display_text: "Follow up After Reunification" },
      { id: 'follow_up_in_care', display_text: "Follow up In Care" },
      { id: 'registration', display_text: "Registration" },
      { id: 'reunification', display_text: "Reunification" },
      { id: 'verification', display_text: "Verification" }
    ].map(&:with_indifferent_access)
  }),
  Field.new({"name" => "concern_details",
    "type" => "textarea",
    "display_name_en" => "Details of the concern"
  }),
  Field.new({"name" => "concern_intervention_needed",
    "type" => "select_box",
    "display_name_en" => "Intervention needed?",
    "option_strings_source" => "lookup lookup-further-action_needed"
  }),
  Field.new({"name" => "date_concern_intervention_needed_by",
    "type" => "date_field",
    "display_name_en" => "Intervention needed by"
  }),
  Field.new({"name" => "concern_action_taken_already",
    "type" => "tick_box",
    "display_name_en" => "Has action been taken?",
    "tick_box_label_en" => "Yes"
  }),
  Field.new({"name" => "concern_action_taken_details",
    "type" => "textarea",
    "display_name_en" => "Details of Action Taken"
  }),
  Field.new({"name" => "concern_action_taken_date",
    "type" => "date_field",
    "display_name_en" => "Date when action was taken"
  }),
  Field.new({"name" => "concern_is_resolved",
    "type" => "tick_box",
    "display_name_en" => "Protection concern resolved?",
    "tick_box_label_en" => "Yes"
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
  :subform_prevent_item_removal => true,
  "name_en" => "Nested Protection Concerns Subform",
  "description_en" => "Nested Protection Concerns Subform",
  "collapsed_fields" => ["protection_concern_type"]
})

protection_concern_detail_fields = [
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "Protection Concerns",
             "option_strings_source" => "lookup lookup-protection-concerns"
            }),
  Field.new({"name" => "protection_concern_detail_subform_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => protection_concern_detail_subform_section.unique_id,
             "display_name_en" => "Protection Concern Details"
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
  "name_en" => "Protection Concern Details",
  "description_en" => "Protection Concern Details"
})
