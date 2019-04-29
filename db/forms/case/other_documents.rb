other_documents_fields = [
    Field.new({"name" => "other_documents",
              "type" => "document_upload_box",
              "editable" => false,
              "disabled" => true,
              "display_name_en" => "Other Document"
              })
]

FormSection.create_or_update_form_section({
  unique_id: "other_documents",
  parent_form: "case",
  visible: true,
  order_form_group: 141,
  order: 11,
  order_subform: 0,
  fields: other_documents_fields,
  editable: false,
  name_en: "Other Documents",
  description_en: "Other Documents",
  form_group_id: "documents",
  display_help_text_view: true
})
