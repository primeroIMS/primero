transfers_fields = [
  Field.new({"name" => "to_user_local",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Local User"
            }),
  Field.new({"name" => "to_user_remote",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Remote User"
            }),
  Field.new({"name" => "to_user_agency",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Remote User Agency"
            })
]

transfers = FormSection.create_or_update_form_section({
    :unique_id => "bia_transfers_subform",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => transfers_fields,
    :initial_subforms => 1,
    "name_all" => "Transfers ",
    "description_all" => "Transfers "
})
