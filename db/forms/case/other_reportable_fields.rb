fields = [
  Field.new({"name" => "record_state",
        "type" => "tick_box",
        "editable" => false,
        "disabled" => true,
        "selected_value" => true,
        "display_name_en" => "Valid Record?"
        }),
  Field.new({"name" => "owned_by_agency_id",
        "type" => "select_box",
        "display_name_en" => "Case Manager's Agency",
        "editable" => false,
        "disabled" => true,
        "option_strings_source" => "Agency"
        }),
  Field.new({"name" => "owned_by_location",
        "type" => "select_box",
        "display_name_en" => "Case Manager's Location",
        "editable" => false,
        "disabled" => true,
        "option_strings_source" => "Location"
        }),
  Field.new({"name" => "has_referrals",
        "type" => "tick_box",
        "display_name_en" => "Does this case have any referrals?",
        "editable" => false,
        "disabled" => true
        }),
  Field.new({"name" => "has_case_plan",
        "type" => "tick_box",
        "display_name_en" => "Does this case have a case plan?",
        "editable" => false,
        "disabled" => true
        }),
  Field.new({"name" => "workflow_status",
        "type" =>"select_box",
        "display_name_en" => "Workflow Status",
        "editable" => false,
        "disabled" => true,
        "option_strings_source" => "lookup lookup-workflow"
        })
]

FormSection.create_or_update_form_section({
  unique_id: "other_reportable_fields_case",
  parent_form: "case",
  visible: false,
  order: 1000,
  order_form_group: 1000,
  form_group_id: 'other_reportable_fields',
  editable: true,
  fields: fields,
  name_en: "Other Reportable Fields",
  description_en: "Other Reportable Fields"
})