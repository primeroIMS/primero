# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe YmlConfigExporter do
    before do
      clean_data(FormSection, Lookup, PrimeroModule) && primero_module

      # This is to be used to clean up test config files created during these tests
      @config_directories = []
    end

    let(:form) do
      FormSection.create_or_update!(
        unique_id: 'basic_identity_test',
        name_i18n: {
          en: 'Basic Identity'
        },
        description_i18n: {
          en: 'Basic identity information about a separated or unaccompanied child.'
        },
        parent_form: 'case',
        fields_attributes: [
          {
            name: 'name',
            type: 'text_field',
            display_name_i18n: { en: 'Name' }
          },
          {
            name: 'recommendation',
            type: 'select_box',
            display_name_i18n: { en: 'Recommendation' },
            option_strings_text_i18n: [
              {
                id: 'local_integration',
                display_text: { en: 'Local integration' }
              },
              {
                id: 'close_case',
                display_text: { en: 'Close the case' }
              }
            ]
          }
        ]
      )
    end

    let(:primero_module) do
      PrimeroModule.create!(
        unique_id: 'primeromodule-cp',
        name: 'CP',
        associated_record_types: %w[case tracing_request incident],
        form_sections: [form]
      )
    end

    let(:lookup1) do
      Lookup.create_or_update!(
        unique_id: 'lookup-location-type',
        name_i18n: { en: 'Location Type' },
        lookup_values_i18n: [
          {
            id: 'country',
            display_text: {
              en: 'Country'
            }
          },
          {
            id: 'region',
            display_text: {
              en: 'Region'
            }
          }
        ]
      )
    end

    let(:lookup2) do
      Lookup.create_or_update!(
        unique_id: 'lookup-location-type2',
        name_i18n: { en: 'Location Type' },
        lookup_values_i18n: [
          {
            id: 'district',
            display_text: { en: 'District' }
          },
          {
            id: 'city',
            display_text: { en: 'City' }
          }
        ]
      )
    end

    describe '#localized_form_hash' do
      it "generates a hash for exporting a form's translatable strings to YML" do
        exporter = YmlConfigExporter.new
        # This is to be used to clean up test config files created during these tests
        @config_directories << exporter.export_directory

        localized_form_hash = exporter.localized_form_hash(form.configuration_hash, 'en')
        expect(localized_form_hash.size).to eq(1)
        expect(localized_form_hash['en']).to be
        expect(localized_form_hash['en']['basic_identity_test']).to be
        expect(localized_form_hash['en']['basic_identity_test']['name']).to eq(form.name_en)
        expect(localized_form_hash['en']['basic_identity_test']['description']).to eq(form.description_en)
        expect(localized_form_hash['en']['basic_identity_test']['fields'].size).to eq(2)
        expect(localized_form_hash['en']['basic_identity_test']['fields']['name']['display_name']).to eq('Name')
        expect(localized_form_hash['en']['basic_identity_test']['fields']['recommendation']['display_name']).to eq(
          'Recommendation'
        )
        recommendation_options = localized_form_hash['en']['basic_identity_test']['fields']['recommendation']['option_strings_text']
        expect(recommendation_options['local_integration']).to eq('Local integration')
        expect(recommendation_options['close_case']).to eq('Close the case')
      end
    end

    describe '#localized_lookups_hash' do
      it 'generates a hash for exporting the available lookups to YAML for translation' do
        exporter = YmlConfigExporter.new
        # This is to be used to clean up test .xlsx files created during these tests
        @config_directories << exporter.export_directory

        lookups_config_hash = [lookup1, lookup2].map(&:configuration_hash)
        localized_lookups_hash = exporter.localized_lookups_hash(lookups_config_hash, 'en')
        expect(localized_lookups_hash.size).to eq(1)
        expect(localized_lookups_hash['en']).to be
        expect(localized_lookups_hash['en']['lookup-location-type']).to be
        expect(localized_lookups_hash['en']['lookup-location-type']['name']).to eq(lookup1.name_en)
        lookup_values = localized_lookups_hash['en']['lookup-location-type']['lookup_values']
        expect(lookup_values['country']).to eq('Country')
        expect(lookup_values['region']).to eq('Region')
      end
    end

    after do
      clean_data(FormSection, Lookup, PrimeroModule)

      # Remove test config files
      @config_directories.each { |config_dir| FileUtils.rm_rf(config_dir) }
    end
  end
end
