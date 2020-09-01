bia_fields = [
    Field.new({"name" => "upload_bia_document",
              "type" => "document_upload_box",
              "editable" => false,
              "disabled" => true,
              "display_name_en" => "BIA Document"
              })
]

FormSection.create_or_update!({
  unique_id: "bia_documents",
  parent_form: "case",
  visible: false,
  order_form_group: 121,
  order: 9,
  order_subform: 0,
  fields: bia_fields,
  editable: false,
  name_en: "BIA Records",
  description_en: "BIA Records",
  form_group_id: "documents",
  display_help_text_view: true
})
