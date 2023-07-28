# frozen_string_literal: true

child_preferences_fields_subform = [
  Field.new('name' => 'wishes_name',
            'type' => 'text_field',
            'display_name_en' => 'Person(s) child wishes to locate'),
  Field.new('name' => 'wishes_preference_relocated',
            'type' => 'select_box',
            'display_name_en' => 'Preference of the child to be relocated with this person',
            'option_strings_text_en' => [
              { id: 'first_choice', display_text: 'First choice' },
              { id: 'second_choice', display_text: 'Second choice' },
              { id: 'third_choice', display_text: 'Third choice' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'wishes_relationship',
            'type' => 'select_box',
            'display_name_en' => "What is this person's relationship to the child?",
            'option_strings_source' => 'lookup lookup-family-relationship')
]

child_preferences_section = FormSection.create_or_update!(
  :visible => false,
  'is_nested' => true,
  :order_form_group => 130,
  :order => 10,
  :order_subform => 1,
  :unique_id => 'child_preferences_section',
  :parent_form => 'case',
  'editable' => true,
  :fields => child_preferences_fields_subform,
  :initial_subforms => 0,
  'name_en' => "Nested Child's Preferences",
  'description_en' => "Child's Preferences Subform",
  'collapsed_field_names' => %w[wishes_preference_relocated wishes_name]
)

child_wishes_fields = [
  Field.new('name' => 'wishes_child_family_tracing',
            'type' => 'radio_button',
            'display_name_en' => 'Does child want to trace family members?',
            'option_strings_source' => 'lookup lookup-yes-no'),
  ## Subform ##
  Field.new('name' => 'child_preferences_section',
            'type' => 'subform',
            'editable' => true,
            'subform_section' => child_preferences_section,
            'display_name_en' => "Child's Preferences")
]

FormSection.create_or_update!(
  :unique_id => 'child_wishes',
  :parent_form => 'case',
  'visible' => false,
  :order_form_group => 130,
  :order => 10,
  :order_subform => 0,
  :form_group_id => 'tracing',
  'editable' => true,
  :fields => child_wishes_fields,
  'name_en' => "Child's Wishes",
  'description_en' => "Child's Wishes"
)
