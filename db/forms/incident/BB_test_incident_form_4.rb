bb_test_incident_fields = [
 
  Field.new({"name" => "bb_test_incident_field_1",
             "type" => "text_field",
             "display_name_all" => "BB Test Field 1"
            }),
  Field.new({"name" => "bb_test_incident_field_2",
             "type" => "text_field",
             "display_name_all" => "BB Test Field 2"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "bb_test_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order => 4,
  "editable" => true,
  :fields => bb_test_incident_fields,
  :perm_enabled => true,
  "name_all" => "BB Test Incident Form 4",
  "description_all" => "BB Test Incident Form 4"
})