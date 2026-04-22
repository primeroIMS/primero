# frozen_string_literal: true

require 'rails_helper'

describe ConfigurationRecord do
  context 'Generic functionality: Lookup' do
    before(:each) { clean_data(Lookup) }
    after(:each) { clean_data(Lookup) }

    let(:lookup) do
      Lookup.create!(
        unique_id: 'lookup-ethnicity',
        name_en: 'Ethnicity',
        lookup_values_en: [
          { id: 'ethnicity1', display_text: 'Ethnicity1' },
          { id: 'ethnicity2', display_text: 'Ethnicity2' }
        ]
      )
    end

    let(:lookup_configuration_hash) do
      {
        'unique_id' => 'lookup-ethnicity',
        'name_i18n' => { 'en' => 'Ethnicity' },
        'lookup_values_i18n' => [
          { 'id' => 'ethnicity1', 'display_text' => { 'en' => 'Ethnicity1' } },
          { 'id' => 'ethnicity2', 'display_text' => { 'en' => 'Ethnicity2' } }
        ],
        'locked' => false
      }
    end

    describe '#configuration_hash' do
      it 'returns the configuration hash' do
        expect(lookup.configuration_hash).to eq(lookup_configuration_hash)
      end
    end

    describe '.create_or_update!' do
      before { lookup }

      it 'creates a new lookup from a configuration hash' do
        lookup_configuration_hash2 = lookup_configuration_hash.clone
        lookup_configuration_hash2['unique_id'] = 'lookup-ethnicity2'

        new_lookup = Lookup.create_or_update!(lookup_configuration_hash2)
        expect(new_lookup.configuration_hash).to eq(lookup_configuration_hash2)
        expect(new_lookup.id).not_to eq(lookup.id)
      end

      it 'updates an existing lookup from a configuration hash' do
        lookup_configuration_hash2 = lookup_configuration_hash.clone
        lookup_configuration_hash2['name_i18n']['en'] = 'Ethnicity*'

        lookup2 = Lookup.create_or_update!(lookup_configuration_hash2)
        expect(lookup2.id).to eq(lookup.id)
        expect(lookup2.name('en')).to eq('Ethnicity*')
      end
    end
  end
end
