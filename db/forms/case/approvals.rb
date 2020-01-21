approvals_fields_subform = [
  Field.new({"name" => "approval_requested_for",
    "type" => "select_box",
    "display_name_en" => "Approval requested for",
    "editable"=> false,
    "disabled"=> true,
    "option_strings_text_en" => [
      { id: 'bia', display_text: "Bia" },
      { id: 'case_plan', display_text: "Case Plan" },
      { id: 'closure', display_text: "Closure" }
    ].map(&:with_indifferent_access)
  }),
  Field.new({"name" => "approval_response_for",
    "type" => "select_box",
    "display_name_en" => "Approval for",
    "editable"=> false,
    "disabled"=> true,
    "option_strings_text_en" => [
      { id: 'bia', display_text: "Bia" },
      { id: 'case_plan', display_text: "Case Plan" },
      { id: 'closure', display_text: "Closure" }
    ].map(&:with_indifferent_access)
  }),
  Field.new({"name" => "approval_for_type",
    "type" => "select_box",
    "display_name_en" => "Case Plan type",
    "editable"=> false,
    "disabled"=> true,
    "option_strings_source" => "lookup lookup-approval-type"
  }),
  Field.new({"name" => "approval_date",
    "type" => "date_field",
    "display_name_en" => "Date",
    "editable"=> false,
    "disabled"=> true,
  }),
  Field.new({"name" => "approval_manager_comments",
    "type" => "textarea",
    "display_name_en" => "Manager Comments",
    "editable"=> false,
    "disabled"=> true,
  }),
  Field.new({"name" => "approval_status",
    "type" => "select_box",
    "display_name_en" => "Approval Status",
    "editable"=> false,
    "disabled"=> true,
    "option_strings_source" => "lookup lookup-approval-status"
  }),
  Field.new({"name" => "approved_by",
    "type" => "select_box",
    "display_name_en" => "Approved by",
    "editable"=> false,
    "disabled"=> true,
    "option_strings_source" => "User"
  })
]

approvals_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 999,
    :order => 999,
    :order_subform => 1,
    :unique_id=>"approval_subforms",
    :parent_form=>"case",
    "editable"=>true,
    :fields => approvals_fields_subform,
    :initial_subforms => 0,
    :hide_subform_placeholder => true,
    "name_en" => "Approval Subform",
    "description_en" => "Approval Subform",
    "collapsed_field_names" => [
      "approval_requested_for",
      "approval_response_for",
      "approval_for_type",
      "approval_date",
      "approval_status"
    ]
})

approvals_fields = [
  Field.new({"name" => "approval_subforms",
    "type" => "subform",
    "editable" => false,
    "subform_section" => approvals_section,
    "display_name_en" => "Approval"
  }),
]

# FormSection.create_or_update_form_section({
#   :unique_id => "approvals",
#   :parent_form=>"case",
#   "visible" => true,
#   :order_form_group => 9,
#   :order => 9,
#   :order_subform => 0,
#   :form_group_id => "approvals",
#   "editable" => false,
#   :fields => approvals_fields,
#   "name_en" => "Approvals",
#   "description_en" => "Approvals"
# })
