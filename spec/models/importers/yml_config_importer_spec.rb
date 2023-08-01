# frozen_string_literal: true

require 'rails_helper'

module Importers
  describe YmlConfigImporter do
    before do
      clean_data(Field, FormSection)

      services_subform = [
        Field.new(name: 'service_response_type',
                  type: 'select_box',
                  required: true,
                  display_name_en: 'Type of Response',
                  option_strings_source: 'lookup lookup-service-response-type'),
        Field.new(name: 'service_type',
                  type: 'select_box',
                  required: true,
                  display_name_en: 'Type of Remediation Activity',
                  option_strings_source: 'lookup lookup-service-type'),
        Field.new(name: 'service_type_other',
                  type: 'text_field',
                  display_name_en: 'If other, please specify'),
        Field.new(name: 'service_response_task',
                  type: 'select_box',
                  visible: false,
                  multi_select: true,
                  display_name_en: 'If referred to child protection structure, what services are needed?',
                  display_conditions_subform: { 'eq' => { 'service_response_type' => 'referred_to_authorities' } },
                  option_strings_source: 'lookup lookup-service-tasks'),
        Field.new(name: 'service_response_day_time',
                  type: 'date_field',
                  selected_value: 'now',
                  display_name_en: 'Created on',
                  date_include_time: true),
        Field.new(name: 'service_response_timeframe',
                  type: 'select_box',
                  visible: false,
                  display_name_en: 'Implementation Timeframe',
                  option_strings_text_en: [
                    { id: '1_hour', display_text: 'One hour' },
                    { id: '3_hours', display_text: 'Three hours' },
                    { id: '1_day', display_text: 'One day' },
                    { id: '3_days', display_text: 'Three days' }
                  ].map(&:with_indifferent_access),
                  help_text_en: 'Enter the Implementation Timeframe for the service; the timeframe is used in the dashboard to indicate if services are overdue.'),
        Field.new(name: 'service_referral',
                  type: 'select_box',
                  visible: false,
                  display_name_en: 'Did you refer the client for this service?',
                  option_strings_source: 'lookup lookup-service-referred'),
        Field.new(name: 'service_appointment_date',
                  type: 'date_field',
                  display_name_en: 'Activity Due Date'),
        Field.new(name: 'service_appointment_time',
                  type: 'text_field',
                  visible: false,
                  display_name_en: 'Appointment Time'),
        Field.new(name: 'service_implementing_agency',
                  type: 'select_box',
                  required: true,
                  display_name_en: 'Implementing Agency',
                  option_strings_source: 'Agency'),
        Field.new(name: 'service_delivery_location',
                  type: 'select_box',
                  display_name_en: 'Activity Location',
                  option_strings_source: 'ReportingLocation'),
        Field.new(name: 'service_external_referral',
                  type: 'tick_box',
                  tick_box_label_en: 'Yes',
                  display_name_en: 'Is this a referral to someone without access to the Primero system?'),
        Field.new(name: 'service_implementer_is_record_owner',
                  type: 'radio_button',
                  display_name_en: 'Is the record owner performing this remediation activity?',
                  option_strings_source: 'lookup lookup-yes-no',
                  display_conditions_subform: { eq: { 'service_external_referral' => false } }),
        Field.new(name: 'service_implementing_agency_individual',
                  type: 'select_box',
                  display_name_en: 'Who will perform this remediation activity?',
                  display_conditions_subform: { and: [{ eq: { 'service_external_referral' => false } },
                                                      { not: { eq: { 'service_implementer_is_record_owner' => 'true' } } }] },
                  option_strings_source: 'User'),
        Field.new(name: 'service_status_referred',
                  type: 'tick_box',
                  visible: false,
                  tick_box_label_en: 'Yes',
                  display_name_en: 'Referred?',
                  disabled: true),
        Field.new(name: 'service_external_referral_header',
                  type: 'separator',
                  display_name_en: 'External referral details',
                  help_text_en: 'The below fields will be added to the External Referral PDF file.',
                  display_conditions_subform: { 'eq' => { 'service_external_referral' => true } }),
        Field.new(name: 'service_implementing_agency_external',
                  type: 'text_field',
                  display_name_en: 'Agency',
                  display_conditions_subform: { 'eq' => { 'service_external_referral' => true } }),
        Field.new(name: 'service_location',
                  type: 'text_field',
                  display_name_en: 'Location',
                  display_conditions_subform: { 'eq' => { 'service_external_referral' => true } }),
        Field.new(name: 'service_provider',
                  type: 'text_field',
                  display_name_en: 'Recipient',
                  display_conditions_subform: { 'eq' => { 'service_external_referral' => true } }),
        Field.new(name: 'service_referral_notes',
                  type: 'textarea',
                  display_name_en: 'Comments',
                  help_text_en: 'ie. Contact details'),
        Field.new(name: 'service_activity_implementation',
                  type: 'separator',
                  display_name_en: 'Activity Implementation'),
        Field.new(name: 'service_implemented',
                  type: 'select_box',
                  display_name_en: 'Activity Implemented?',
                  option_strings_source: 'lookup lookup-service-implemented',
                  selected_value: 'not_implemented',
                  disabled: true,
                  help_text_en: 'This field is updated once the "Activity Implemented On" field is edited.'),
        Field.new(name: 'service_implemented_day_time',
                  type: 'date_field',
                  display_name_en: 'Activity Implemented On',
                  date_include_time: true,
                  help_text_en: 'This field sets "Activity Implemented"',
                  date_validation: 'not_future_date'),
        Field.new(name: 'note_on_referral_from_provider',
                  type: 'textarea',
                  display_name_en: 'Notes on the referral from recipient',
                  help_text_en: 'This field is automatically updated by Primero when a referral recipient marks the Remediation Activity as "Done."')
      ]

      @services_section = FormSection.create_or_update!(
        visible: false,
        is_nested: true,
        order_form_group: 110,
        order: 30,
        order_subform: 1,
        unique_id: 'services_section',
        parent_form: 'case',
        editable: true,
        fields: services_subform,
        initial_subforms: 0,
        name_en: 'Remediation Activities',
        description_en: 'Remediation Activities Subform',
        collapsed_field_names: %w[service_type
                                  service_implemented
                                  service_appointment_date
                                  service_implementing_agency_individual],
        subform_prevent_item_removal: true
      )

      @collapsed_field_names = @services_section.collapsed_fields.pluck(:name)
      @collapsed_field_ids = @services_section.collapsed_fields.pluck(:id)
      @collapsed_field_count = @services_section.collapsed_fields.count

      services_fields = [
        Field.new(name: 'action_plan_separator',
                  type: 'separator',
                  display_name_en: 'Action Plan'),
        Field.new(name: 'case_plan_approval_type',
                  type: 'select_box',
                  display_name_en: 'Approval Type',
                  editable: false,
                  disabled: true,
                  visible: false,
                  option_strings_source: 'lookup lookup-approval-type'),
        Field.new(name: 'case_plan_approved',
                  type: 'tick_box',
                  tick_box_label_en: 'Yes',
                  editable: false,
                  disabled: true,
                  display_name_en: 'Approved by Manager'),
        Field.new(name: 'case_plan_approved_date',
                  type: 'date_field',
                  editable: false,
                  disabled: true,
                  display_name_en: 'Date'),
        Field.new(name: 'case_plan_approved_comments',
                  type: 'textarea',
                  editable: false,
                  disabled: true,
                  display_name_en: 'Manager Comments'),
        Field.new(name: 'approval_status_case_plan',
                  type: 'select_box',
                  display_name_en: 'Approval Status',
                  editable: false,
                  disabled: true,
                  option_strings_source: 'lookup lookup-approval-status'),
        Field.new(name: 'services_section',
                  type: 'subform',
                  editable: true,
                  subform_section: @services_section,
                  display_name_en: 'Remediation Activities',
                  subform_sort_by: 'service_appointment_date')
      ]

      @services_form = FormSection.create_or_update!(
        unique_id: 'services',
        parent_form: 'case',
        visible: true,
        order_form_group: 110,
        order: 10,
        order_subform: 0,
        form_group_id: 'services_follow_up',
        fields: services_fields,
        editable: false,
        name_en: 'Services / Remediation Activities',
        description_en: 'Services form'
      )
    end

    context 'when imput file exists' do
      context 'and form is a main form' do
        before do
          file_name = spec_resource_path('services.yml').to_s
          importer = Importers::YmlConfigImporter.new(file_name:)
          importer.import
        end

        it 'imports translations' do
          display_name_translations = [{ 'en' => 'Action Plan', 'fr' => "Plan d'action" },
                                       { 'en' => 'Approval Type' },
                                       { 'en' => 'Approved by Manager', 'fr' => 'Apprové par le gestionnaire' },
                                       { 'en' => 'Date', 'fr' => 'Date' },
                                       { 'en' => 'Manager Comments', 'fr' => 'Commentaires de gestionnaire' },
                                       { 'en' => 'Approval Status', 'fr' => "Statut d'approbation" },
                                       { 'en' => 'Remediation Activities', 'fr' => 'Activités de remédiation' }]

          translated_form = FormSection.find_by(unique_id: 'services')
          expect(translated_form.name_i18n.keys).to match_array(%w[en fr])
          expect(translated_form.name(:fr)).to eq('Services/Activités de remédiation')
          expect(translated_form.fields.pluck(:display_name_i18n)).to match_array(display_name_translations)
        end
      end

      context 'and form is a subform' do
        before do
          file_name = spec_resource_path('services_section.yml').to_s
          importer = Importers::YmlConfigImporter.new(file_name:)
          importer.import
        end

        it 'imports translations' do
          display_name_translations = [{ 'en' => 'Type of Response', 'fr' => 'Type de réponse' },
                                       { 'en' => 'Type of Remediation Activity',
                                         'fr' => "Type d'activité de remédiation" },
                                       { 'en' => 'If other, please specify', 'fr' => 'Si autre, veuillez préciser' },
                                       { 'en' => 'If referred to child protection structure, what services are needed?' },
                                       { 'en' => 'Created on', 'fr' => 'Créé le' },
                                       { 'en' => 'Implementation Timeframe' },
                                       { 'en' => 'Did you refer the client for this service?' },
                                       { 'en' => 'Activity Due Date', 'fr' => "Date d'échéance" },
                                       { 'en' => 'Appointment Time' },
                                       { 'en' => 'Implementing Agency', 'fr' => "Agence d'exécution" },
                                       { 'en' => 'Activity Location', 'fr' => "Lieu d'activité" },
                                       { 'en' => 'Is this a referral to someone without access to the Primero system?',
                                         'fr' => "S'agit-il d'un renvoi à quelqu'un qui n'a pas accès au système Primero ?" },
                                       { 'en' => 'Is the record owner performing this remediation activity?' },
                                       { 'en' => 'Who will perform this remediation activity?',
                                         'fr' => 'Qui effectuera cette activité de remédiation ?' },
                                       { 'en' => 'Referred?' },
                                       { 'en' => 'External referral details', 'fr' => 'Détails de renvoi externe' },
                                       { 'en' => 'Agency', 'fr' => 'Agence' },
                                       { 'en' => 'Location', 'fr' => 'Emplacement' },
                                       { 'en' => 'Recipient', 'fr' => 'Destinataire' },
                                       { 'en' => 'Comments', 'fr' => 'Commentaires' },
                                       { 'en' => 'Activity Implementation', 'fr' => "Implémentation d'activité" },
                                       { 'en' => 'Activity Implemented?', 'fr' => 'Activité implémentée?' },
                                       { 'en' => 'Activity Implemented On', 'fr' => 'Activité implémentée le' },
                                       { 'en' => 'Notes on the referral from recipient',
                                         'fr' => 'Notes sur le renvoi venant du destinataire' }]

          translated_form = FormSection.find_by(unique_id: 'services_section')
          expect(translated_form.name_i18n.keys).to match_array(%w[en fr])
          expect(translated_form.name(:fr)).to eq('Activités de remédiation')
          expect(translated_form.fields.pluck(:display_name_i18n)).to match_array(display_name_translations)
        end

        it 'does not change collapsed_fields' do
          collapsed_fields = @services_section.collapsed_fields
          expect(collapsed_fields.count).to eq(@collapsed_field_count)
          expect(collapsed_fields.pluck(:id)).to match_array(@collapsed_field_ids)
          expect(collapsed_fields.pluck(:name)).to match_array(@collapsed_field_names)
        end
      end

      context 'and file is empty' do
        before do
          @file_name = spec_resource_path('services_empty.yml').to_s
        end

        it 'returns an error' do
          importer = Importers::YmlConfigImporter.new(file_name: @file_name)
          importer.import
          expect(importer.errors.size).to eq(1)
          expect(importer.errors.first).to eq("Import Not Processed: error reading #{@file_name}")
        end
      end
    end

    context 'when file name is blank' do
      before do
        @file_path = spec_resource_path('does_not_exist.yml').to_s
      end

      it 'returns an error' do
        importer = Importers::YmlConfigImporter.new(file_name: @file_name)
        importer.import
        expect(importer.errors.size).to eq(1)
        expect(importer.errors.first).to eq('Import Not Processed: No file_name passed in')
      end
    end

    after do
      clean_data(Field, FormSection)
    end
  end
end
