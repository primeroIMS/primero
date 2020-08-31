# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe RubyConfigExporter do
    describe '#config_to_ruby_string' do
      before(:each) { clean_data(Lookup) }
      let(:lookup) do
        Lookup.new(
          unique_id: 'lookup-ethnicity',
          name_en: 'Ethnicity',
          'name_ar-LB': 'Ethnicity ar-LB',
          lookup_values_en: [
            { id: 'ethnicity1', display_text: 'Ethnicity1' },
            { id: 'ethnicity2', display_text: 'Ethnicity2' }
          ]
        )
      end

      it 'generates a valid Ruby string' do
        ruby_string = RubyConfigExporter.new.config_to_ruby_string('Lookup', lookup.configuration_hash)
        # rubocop:disable Security/Eval
        eval(ruby_string)
        # rubocop:enable Security/Eval
        expect(Lookup.count).to eq(1)
        new_lookup = Lookup.first
        expect(new_lookup.name_i18n['en']).to eq(lookup.name_i18n['en'])
        expect(new_lookup.name_i18n['ar-LB']).to eq(lookup.name_i18n['ar-LB'])
        expect(new_lookup.lookup_values).to eq(lookup.lookup_values)
      end
    end
  end
end
