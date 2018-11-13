assessment_fields = [
  Field.new({
    name: 'assessment_requested_by',
    display_name_en: 'Assessment requested by',
    type: 'text_field'
  }),
  Field.new({
    name: 'assessment_requested_on',
    display_name_en: 'Assessment requested on',
    help_text_en: 'This field is used for the Workflow status.',
    type: 'date_field',
    editable: false
  }),
  Field.new({
    type: 'date_field',
    display_name_en: 'Date Case Plan Due',
    name: 'case_plan_due_date',
    required: false,
    editable: false
  })
]

FormSection.create_or_update_form_section({
  unique_id: 'assessment',
  parent_form: 'case',
  visible: true,
  order_form_group: 50,
  order: 10,
  order_subform: 0,
  form_group_id: 'assessment',
  fields: assessment_fields,
  editable: false,
  name_en: 'Assessment',
  description_en: 'Assessment form',
})
