tracing_request_record_owner_fields = [
  Field.new({"name" => "record_state",
             "type" => "select_box",
             "display_name_all" => "Record state",
             "option_strings_text_all" =>
                                    ["Valid record",
                                     "Invalid record"].join("\n")
            }),
  Field.new({"name" => "current_owner_section",
             "type" => "separator",
             "display_name_all" => "Current Owner"
            }),
  Field.new({"name" => "caseworker_name",
             "type" => "text_field",
             "display_name_all" => "Field/Case/Social Worker"
            }),
  Field.new({"name" => "caseworker_code",
             "type" => "select_box",
             "display_name_all" => "Caseworker Code",
             "option_strings_text_all" =>
                                    ["Case Worker1",
                                     "Case Worker2",
                                     "Case Worker3",
                                     "Case Worker4",
                                     "Case Worker5"].join("\n")
            }),
  Field.new({"name" => "agency_organization",
             "type" => "select_box",
             "display_name_all" => "Agency",
             "option_strings_text_all" =>
                                    ["Agency1",
                                     "Agency2",
                                     "Agency3",
                                     "Agency4",
                                     "Agency5",].join("\n")
            }),
  Field.new({"name" => "record_history_section",
             "type" => "separator",
             "display_name_all" => "Record History"
            }),
  Field.new({"name" => "created_by",
             "type" => "text_field",
             "display_name_all" => "Record created by",
             "editable" => false
            }),
  Field.new({"name" => "created_organisation",
             "type" => "text_field",
             "display_name_all" => "Created by agency",
             "editable" => false
            }),
  Field.new({"name" => "previous_owner",
             "type" => "text_field",
             "display_name_all" => "Previous Owner"
            }),
  Field.new({"name" => "previous_agency",
             "type" => "text_field",
             "display_name_all" => "Previous Agency"
            }),
  Field.new({"name" => "module_id",
          "type" => "text_field",
          "display_name_all" => "Module"
          }),
]

FormSection.create_or_update_form_section({
  :unique_id => "tracing_request_record_owner",
  :parent_form=>"tracing_request",
  "visible" => true,
  :order_form_group => 0,
  :order => 0,
  :order_subform => 0,
  :form_group_name => "Record Owner",
  "editable" => true,
  :fields => tracing_request_record_owner_fields,
  :perm_enabled => true,
  "name_all" => "Record Owner",
  "description_all" => "Record Owner"
})
