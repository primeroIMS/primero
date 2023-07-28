# frozen_string_literal: true

closure_fields = [
  Field.new(name: 'status',
            type: 'select_box',
            selected_value: Record::STATUS_OPEN,
            display_name_en: 'Record Status',
            option_strings_source: 'lookup lookup-case-status',
            editable: false,
            disabled: true),
  Field.new(name: 'date_closure',
            type: 'date_field',
            display_name_en: 'Date of Closure'),
  Field.new(name: 'closure_reason',
            type: 'select_box',
            display_name_en: 'Primary reason for family closure',
            option_strings_text_en: [
              { id: 'overall_goals_met', display_text: 'Overall goals for the family have been met' },
              { id: 'moving_different_location', display_text: 'Familiy is moving to a different location' },
              {
                id: 'cannot_be_contacted',
                display_text: 'Family cannot be contacted (wait at least 3 months before closing the case)'
              },
              { id: 'no_further_action', display_text: 'No further action possible/required' },
              { id: 'case_opened_error', display_text: 'Case opened in error' },
              { id: 'other', display_text: 'Other' }
            ].map(&:with_indifferent_access)),
  Field.new(name: 'closure_reason_other',
            type: 'text_field',
            display_name_en: 'If other, please specify'),
  Field.new(name: 'closure_details',
            type: 'textarea',
            display_name_en: 'Provide further details on reason for family closure')
]

FormSection.create_or_update!(
  unique_id: 'family_closure_form',
  parent_form: 'family',
  visible: true,
  order_form_group: 110,
  order: 21,
  order_subform: 0,
  form_group_id: 'closure',
  editable: true,
  fields: closure_fields,
  name_en: 'Closure',
  description_en: 'Closure'
)
