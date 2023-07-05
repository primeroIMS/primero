# frozen_string_literal: true

consent_fields = [
  Field.new(name: 'family_legitimate_basis',
            type: 'select_box',
            display_name_en: 'Reasons for collecting and retaining information on this Family',
            multi_select: true,
            mobile_visible: true,
            option_strings_source: 'lookup lookup-legitimate-basis',
            guiding_questions_en: [
              '(1) The consent of the data subject, or the child’s representative where appropriate ("consent").',
              '(2) To prepare for or perform a contract with the data subject, '\
              'including a contract of employment ("contract").',
              '(3) To protect the life, physical or mental integrity of the data subject or another person '\
              '("vital interests").',
              '(4) To protect or advance the interests of people UNICEF serves, and particularly those interests '\
              'UNICEF is mandated to protect or advance ("beneficiary interests").',
              '(5) Compliance with a public legal obligation to which UNICEF is subject ("legal obligation").',
              '(6) Other legitimate interests of UNICEF consistent with its mandate, including the establishment, '\
              'exercise or defense of legal claims or for UNICEF accountability ("other legitimate interests").'
            ].join("\n")),
  Field.new('name' => 'family_interview_subject',
            'type' => 'select_box',
            'display_name_en' => 'Consent Obtained From',
            'option_strings_text_en' => [
              { id: 'head_of_household', display_text: 'Head of Household' },
              { id: 'parent', display_text: 'Parent' },
              { id: 'caregiver', display_text: 'Caregiver' },
              { id: 'other', display_text: 'Other' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'family_consent_source_other',
            'type' => 'text_field',
            'display_name_en' => 'Provide the name of the individual who provided the consent'),
  Field.new('name' => 'family_consent_change_reason',
            'type' => 'textarea',
            'display_name_en' => 'Reason for updating consent',
            'help_text_en' => 'You only need to complete this field if you are changing an entry you made previously.'),
  Field.new('name' => 'family_consent_notes',
            'type' => 'text_field',
            'display_name_en' => 'Notes'),
  Field.new('name' => 'family_consent_for_services',
            'type' => 'tick_box',
            'tick_box_label_en' => 'Yes',
            'display_name_en' => 'Consent has been given for the family to participate in the case management process',
            'help_text' => 'If consent has not been provided, do not select'),
  Field.new('name' => 'family_consent_reporting',
            'type' => 'radio_button',
            'display_name_en' => 'Consent is given share non-identifiable information for reporting',
            'option_strings_source' => 'lookup lookup-yes-no'),
  Field.new('name' => 'family_consent_for_data_collection',
            'type' => 'radio_button',
            'display_name_en' => 'Consent has been given to the caseworker assigned to the case to collect and store '\
                                 'personal information about the case (e.g., name, photo, family details).',
            'option_strings_source' => 'lookup lookup-yes-no'),
  Field.new('name' => 'family_disclosure_other_orgs',
            'type' => 'tick_box',
            'tick_box_label_en' => 'Yes',
            'display_name_en' => 'The individual providing consent agrees to share information about this case with ' \
                                 'other service providers according to the details described below.',
            'help_text_en' => 'This includes sharing information with other organizations providing services, '\
                              'this does not include sharing information with UNHCR.'),
  Field.new('name' => 'family_information_shared_services',
            'type' => 'select_box',
            'display_name_en' => 'Information can be shared for the following services',
            'option_strings_text_en' => [
              { id: 'alternative_care', display_text: 'Alternative care' },
              { id: 'cash_assistance', display_text: 'Cash assistance' },
              { id: 'education_formal', display_text: 'Education (formal)' },
              { id: 'family_tracing_and_reunification', display_text: 'Family tracing and reunification' },
              { id: 'food', display_text: 'Food' },
              { id: 'gbv_survivor_support', display_text: 'GBV survivor support' },
              { id: 'legal_support', display_text: 'Legal support' },
              { id: 'livelihoods', display_text: 'Livelihoods' },
              { id: 'medical', display_text: 'Medical' },
              { id: 'mental_health', display_text: 'Mental health' },
              { id: 'non_food_items', display_text: 'Non-food items' },
              { id: 'non_formal_education', display_text: 'Non-formal education' },
              { id: 'nutrition', display_text: 'Nutrition' },
              { id: 'psychosocial_support', display_text: 'Psychosocial support' },
              {
                id: 'services_for_children_with_disabilities',
                display_text: 'Services for children with disabilities'
              },
              { id: 'shelter', display_text: 'Shelter' },
              { id: 'sexual_and_reproductive_health', display_text: 'Sexual and Reproductive Health' },
              { id: 'rescue', display_text: 'Rescue' },
              { id: 'wash', display_text: 'WASH' },
              { id: 'case_transfer', display_text: 'Case Transfer' },
              { id: 'other_please_specify', display_text: 'Other' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'family_information_shared_services_other',
            'type' => 'text_field',
            'display_name_en' => 'If Other, please specify'),
  Field.new('name' => 'family_unhcr_export_opt_in',
            'type' => 'tick_box',
            'tick_box_label_en' => 'Yes',
            'display_name_en' => 'The individual providing consent agrees to share information about this case with '\
                                 'UNHCR for the purposes of refugee protection case management.'),
  Field.new('name' => 'family_consent_share_separator',
            'type' => 'separator',
            'display_name_en' => 'Consent Details for Sharing Information',
            'visible' => false),
  Field.new('name' => 'family_consent_info_sharing',
            'type' => 'select_box',
            'display_name_en' => 'Consent has been given to share the information collected with',
            'multi_select' => true,
            'visible' => false,
            'option_strings_text_en' => [
              { id: 'family', display_text: 'Family' },
              { id: 'authorities', display_text: 'Authorities' },
              { id: 'unhcr', display_text: 'UNHCR' },
              { id: 'other_organizations', display_text: 'Other Organizations' },
              { id: 'others', display_text: 'Others, please specify' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'family_consent_info_sharing_others',
            'type' => 'text_field',
            'display_name_en' => 'If information can be shared with others, please specify who',
            'visible' => false),
  Field.new('name' => 'family_withhold_details',
            'type' => 'textarea',
            'display_name_en' => 'Withhold specific information from'),
  Field.new('name' => 'family_disclosure_deny_details',
            'type' => 'text_field',
            'display_name_en' => 'What specific information should be withheld'),
  Field.new('name' => 'family_withholding_info_reason',
            'type' => 'select_box',
            'display_name_en' => 'Reason for withholding information',
            'multi_select' => true,
            'option_strings_text_en' => [
              {
                id: 'fear_of_harm_themselves_or_others',
                display_text: 'Fear of harm to themselves or others'
              },
              {
                id: 'want_to_communicate_information_themselves',
                display_text: 'Want to communicate information themselves'
              },
              { id: 'unhcr', display_text: 'UNHCR' },
              { id: 'other', display_text: 'Other' }
            ].map(&:with_indifferent_access)),
  Field.new('name' => 'family_withholding_info_other_reason',
            'type' => 'text_field',
            'display_name_en' => 'If other reason for withholding information, please specify')
]

FormSection.create_or_update!(
  unique_id: 'family_consent',
  parent_form: 'family',
  visible: true,
  order_form_group: 40,
  order: 10,
  order_subform: 0,
  form_group_id: 'family_consent',
  editable: true,
  fields: consent_fields,
  name_en: 'Family Consent',
  description_en: 'Family Consent',
  mobile_form: true
)
