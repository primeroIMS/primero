bid_fields = [
    Field.new({"name" => "upload_bid_document",
              "type" => "document_upload_box",
              "editable" => false,
              "display_name_all" => "BID Document"
              })
]

FormSection.create_or_update_form_section({
  :unique_id => "bid_documents",
  :parent_form=>"case",
  "visible" => false,
  :order_form_group => 121,
  :order => 9,
  :order_subform_ => 0,
  :fields => bid_fields,
  "editable" => false,
  "name_all" => "BID Records",
  "description_all" => "BID Records",
  "form_group_name" => "Documents",
  "display_help_text_view" => true
})