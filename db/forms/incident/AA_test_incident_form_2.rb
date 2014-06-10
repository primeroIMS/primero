aa_test_incident_fields = [  
  Field.new({"name" => "aa_test_incident_field_1",
             "type" => "text_field",
             "display_name_all" => "AA Test Field 1"
            })  
]

FormSection.create_or_update_form_section({
  :unique_id => "aa_test_incident_form",
  :parent_form=>"incident",
  "visible" => true,
  :order => 2,
  "editable" => true,
  :fields => aa_test_incident_fields,
  :perm_enabled => true,
  "name_all" => "AA Test Incident Form 2",
  "description_all" => "AA Test Incident Form 2"
})