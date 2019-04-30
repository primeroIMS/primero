fields = [
  Field.new({
    "name" => "record_state",
    "type" => "tick_box",
    "selected_value" => true,
    "editable" => false,
    "disabled" => true,
    "display_name_en" => "Valid Record?"
  }),
  Field.new({
    "name" => "owned_by_agency_id",
    "type" => "select_box",
    "display_name_en" => "Case Manager's Agency",
    "editable" => false,
    "disabled" => true,
    "option_strings_source" => "Agency"
  }),
  Field.new({
    "name" => "owned_by_location",
    "type" => "select_box",
    "display_name_en" => "Case Manager's Location",
    "searchable_select" => true,
    "editable" => false,
    "disabled" => true,
    "option_strings_source" => "Location"
  }),
  Field.new({
    "name" => "has_referrals",
    "type" => "tick_box",
    "display_name_en" => "Does this case have any referrals?",
    "editable" => false,
    "disabled" => true,
  }),
  Field.new({
    "name" => "has_case_plan",
    "type" => "tick_box",
    "display_name_en" => "Does this case have a case plan?",
    "editable" => false,
    "disabled" => true
  })
]

FormSection.create_or_update_form_section({
  :unique_id=>"cp_other_reportable_fields",
  :parent_form=>"case",
  "visible" => false,
  :order => 1000,
  :order_form_group => 1000,
  "editable" => true,
  :fields => fields,
  "name_en" => "Other Reportable Fields",
  "description_en" => "Other Reportable Fields"
})