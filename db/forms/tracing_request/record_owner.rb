tracing_request_record_owner_fields = [
  Field.new({"name" => "current_owner_section",
             "type" => "separator",
             "display_name_all" => "Current Owner"
            }),
  Field.new({"name" => "caseworker_name",
             "type" => "text_field",
             "display_name_all" => "Field/Case/Social Worker"
            }),
  Field.new({"name" => "owned_by",
             "type" => "select_box",
             "display_name_all" => "Caseworker Code",
             "option_strings_source" => "User",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "owned_by_agency",
             "type" => "select_box",
             "display_name_all" => "Agency",
             "editable" => false,
             "disabled" => true,
             "option_strings_source" => "Agency"
            }),
  Field.new({"name" => "assigned_user_names",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_all" => "Other Assigned Users",
             "option_strings_source" => "User"
            }),
  Field.new({"name" => "record_history_section",
             "type" => "separator",
             "display_name_all" => "Record History"
            }),
  Field.new({"name" => "created_by",
             "type" => "text_field",
             "display_name_all" => "Record created by",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "created_organization",
             "type" => "text_field",
             "display_name_all" => "Created by agency",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "previously_owned_by",
             "type" => "text_field",
             "display_name_all" => "Previous Owner",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "previous_agency",
             "type" => "text_field",
             "display_name_all" => "Previous Agency"
            }),
  Field.new({"name" => "module_id",
          "type" => "text_field",
          "display_name_all" => "Module",
          "editable" => false,
          "disabled" => true
          }),
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing_request_record_owner",
  :parent_form=>"tracing_request",
  "visible" => true,
  :order_form_group => 0,
  :order => 0,
  "mobile_form" => true,
  :order_subform => 0,
  :form_group_name => "Record Owner",
  "editable" => true,
  :fields => tracing_request_record_owner_fields,
  "name_all" => "Record Owner",
  "description_all" => "Record Owner"
})
