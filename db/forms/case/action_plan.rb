action_plan_fields = [
  Field.new({"name" => "incident_links",
             "type" => "custom",
             "display_name_all" => "Incident Links",
             "custom_template" => "children/incident_links",
             "create_property" => false,
             "editable" => true
            })
]


FormSection.create_or_update_form_section({
  :unique_id=>"action_plan_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 55,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Action Plan",
  "editable" => true,
  :fields => action_plan_fields,
  "name_all" => "Action Plan",
  "description_all" => "Action Plan"
})