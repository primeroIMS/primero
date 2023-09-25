# frozen_string_literal: true

protection_concern_detail_subform_fields = [
  Field.new('name' => 'protection_concern_type',
            'type' => 'select_box',
            'display_name_en' => 'Type of Protection Concern',
            'option_strings_source' => 'lookup lookup-protection-concerns'),
  Field.new('name' => 'date_concern_identified',
            'type' => 'select_box',
            'display_name_en' => 'Period when identified?',
            'option_strings_text_en' => [
              { id: 'follow_up_after_reunification', display_text: 'Follow up After Reunification' },
              { id: 'follow_up_in_care', display_text: 'Follow up In Care' },
              { id: 'registration', display_text: 'Registration' },
              { id: 'reunification', display_text: 'Reunification' },
              { id: 'verification', display_text: 'Verification' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'concern_details',
            'type' => 'textarea',
            'display_name_en' => 'Details of the concern')
]

protection_concern_detail_subform_section = FormSection.create_or_update!(
  'visible' => false,
  'is_nested' => true,
  :order_form_group => 70,
  :order => 30,
  :order_subform => 1,
  :unique_id => 'protection_concern_detail_subform_section',
  :parent_form => 'case',
  'editable' => true,
  :fields => protection_concern_detail_subform_fields,
  :initial_subforms => 0,
  'name_en' => 'Nested Protection Concerns Subform',
  'description_en' => 'Nested Protection Concerns Subform',
  'collapsed_field_names' => ['protection_concern_type']
)

protection_concern_detail_fields = [
  Field.new('name' => 'protection_concerns',
            'type' => 'select_box',
            'multi_select' => true,
            'display_name_en' => 'Protection Concerns',
            'option_strings_source' => 'lookup lookup-protection-concerns'),
  Field.new('name' => 'protection_concern_detail_subform_section',
            'type' => 'subform',
            'editable' => true,
            'subform_section' => protection_concern_detail_subform_section,
            'display_name_en' => 'Protection Concern Details')
]

FormSection.create_or_update!(
  :unique_id => 'protection_concern_details',
  :parent_form => 'case',
  'visible' => true,
  :order_form_group => 70,
  :order => 30,
  :order_subform => 0,
  :form_group_id => 'assessment',
  :fields => protection_concern_detail_fields,
  'editable' => true,
  'name_en' => 'Protection Concern Details',
  'description_en' => 'Protection Concern Details'
)
