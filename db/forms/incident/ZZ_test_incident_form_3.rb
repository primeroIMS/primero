zz_test_incident_fields = [ 
  Field.new({"name" => "zz_test_incident_field_1",
             "type" => "text_field",
             "display_name_all" => "ZZ Test Field 1"
            }),
  Field.new({"name" => "zz_test_incident_field_2",
             "type" => "text_field",
             "display_name_all" => "ZZ Test Field 2"
            }),
  Field.new({"name" => "zz_test_incident_field_3",
             "type" => "text_field",
             "display_name_all" => "ZZ Test Field 3"
            })  
]

FormSection.create_or_update_form_section({
  :unique_id => "zz_test_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order => 3,
  "editable" => true,
  :fields => zz_test_incident_fields,
  :perm_enabled => true,
  "name_all" => "ZZ Test Incident Form 3",
  "description_all" => "ZZ Test Incident Form 3"
})