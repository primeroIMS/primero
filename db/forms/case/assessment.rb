assessment_fields = [
  Field.new({
    name: 'assessment_requested_by',
    display_name_all: 'Assessment requested by',
    type: 'text_field'
  }),
  Field.new({
    name: 'assessment_requested_on',
    display_name_all: 'Assessment requested on',
    help_text_all: 'This field is used for the Workflow status.',
    type: 'date_field',
    editable: false
  })
]

FormSection.create_or_update_form_section({
  unique_id: 'assessment',
  parent_form: 'case',
  visible: => false,
  order_form_group: 50,
  order: 10,
  order_subform: 0,
  form_group_name: 'Assessment',
  fields: assessment_fields,
  editable: false,
  name_all: 'Assessment',
  description_all: 'Assessment form',
})
