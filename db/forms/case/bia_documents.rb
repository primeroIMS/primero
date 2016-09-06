bia_fields = [
    Field.new({"name" => "upload_bia_document",
              "type" => "document_upload_box",
              "editable" => false,
              "display_name_all" => "BIA Document"
              })
]

FormSection.create_or_update_form_section({
  :unique_id => "bia_documents",
  :parent_form=>"case",
  "visible" => false,
  :order_form_group => 121,
  :order => 9,
  :order_subform_ => 0,
  :fields => bia_fields,
  "editable" => false,
  "name_all" => "BIA Records",
  "description_all" => "BIA Records",
  "form_group_name" => "Documents",
  "display_help_text_view" => true
})