other_documents_fields = [
    Field.new({"name" => "upload_document",
              "type" => "document_upload_box", "editable" => false,
              "display_name_all" => "Other Document"
              })
]

FormSection.create_or_update_form_section({
  :unique_id => "incident_other_documents",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 100,
  :order => 11,
  :order_subform_ => 0,
  :fields => other_documents_fields,
  "editable" => false,
  "name_all" => "Other Documents",
  "description_all" => "Other Documents",
  "form_group_name" => "Other Documents",
  "display_help_text_view" => true
})