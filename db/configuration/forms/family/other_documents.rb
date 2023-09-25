# frozen_string_literal: true

document_fields = [
  Field.new(name: 'documents',
            type: 'document_upload_box',
            display_name_en: 'Document',
            help_text_en: 'Only PDF, TXT, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, PNG files permitted')
]

FormSection.create_or_update!(
  unique_id: 'family_documents',
  parent_form: 'family',
  visible: true,
  order_form_group: 141,
  order: 11,
  order_subform: 0,
  fields: document_fields,
  editable: false,
  name_en: 'Documents',
  description_en: 'Documents',
  form_group_id: 'family_documents',
  display_help_text_view: true
)
