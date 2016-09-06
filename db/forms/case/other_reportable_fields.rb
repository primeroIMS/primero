fields = [
  Field.new({"name" => "record_state",
        "type" => "tick_box",
        "editable" => false,
        "disabled" => true,
        "display_name_all" => "Valid Record?"
        }),
  Field.new({"name" => "owned_by_agency",
        "type" => "select_box",
        "display_name_all" => "Case Manager's Agency",
        "editable" => false,
        "disabled" => true,
        "option_strings_source" => "Agency"
        }),
  Field.new({"name" => "owned_by_location",
        "type" => "select_box",
        "display_name_all" => "Case Manager's Location",
        "searchable_select" => true,
        "editable" => false,
        "disabled" => true,
        "option_strings_source" => "Location"
        })
]

FormSection.create_or_update_form_section({
  :unique_id=>"other_reportable_fields_case",
  :parent_form=>"case",
  "visible" => false,
  :order => 1000,
  :order_form_group => 1000,
  "editable" => true,
  :fields => fields,
  "name_all" => "Other Reportable Fields",
  "description_all" => "Other Reportable Fields"
})