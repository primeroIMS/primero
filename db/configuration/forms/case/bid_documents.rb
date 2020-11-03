bid_fields = [
    Field.new(
      name: 'upload_bid_document',
      type: 'document_upload_box',
      editable: false,
      disabled: true,
      display_name_en: 'BID Document'
    )
]

FormSection.create_or_update!(
  unique_id: 'bid_documents',
  parent_form: 'case',
  visible: false,
  order_form_group: 121,
  order: 9,
  order_subform: 0,
  fields: bid_fields,
  editable: false,
  name_en: 'BID Records',
  description_en: 'BID Records',
  form_group_id: 'documents',
  display_help_text_view: true
)
