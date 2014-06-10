test_incident_fields = [
  Field.new({"name" => "incident_id",
             "type" => "text_field", 
             "editable" => false,
             "display_name_all" => "Incident ID"
            }),
  Field.new({"name" => "incident_short_id",
             "type" => "text_field", 
             "editable" => false,
             "display_name_all" => "Short ID"
            }),
  Field.new({"name" => "test_incident_date",
             "type" => "date_field",
             "display_name_all" => "Date of Incident"
            }),
  Field.new({"name" => "test_incident_description",
             "type" => "text_field",
             "display_name_all" => "Incident Description"
            }),
]

FormSection.create_or_update_form_section({
  :unique_id => "test_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order => 1,
  "editable" => true,
  :fields => test_incident_fields,
  :perm_enabled => true,
  "name_all" => "Test Incident Form 1",
  "description_all" => "Test Incident Form 1"
})