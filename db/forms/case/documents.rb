documents_fields = [
    Field.new({"name" => "upload_document",
              "type" => "document_upload_box", "editable" => false,
              "display_name_all" => "Document"
              })
]

FormSection.create_or_update_form_section({
  :unique_id => "documents",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 141,
  :order => 11,
  :order_subform_ => 0,
  :fields => documents_fields,
  "editable" => false,
  "name_all" => "Documents",
  "description_all" => "Documents",
  "form_group_name" => "Documents",
  "display_help_text_view" => true
})