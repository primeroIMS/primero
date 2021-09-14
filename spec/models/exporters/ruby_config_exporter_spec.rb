# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe RubyConfigExporter do
    before :each do
      clean_data(FormSection, Lookup)
    end
    describe '#config_to_ruby_string' do
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

      it 'generates a nested form with collapsed fields' do
        form_section = FormSection.create_or_update!(
          unique_id: 'form_with_collapsed_fields',
          name_en: 'Form With Collapsed Fields',
          is_nested: true,
          fields: [
            Field.new(display_name_en: 'Collapsed Field 1', name: 'collapsed_field_1', type: 'text_field'),
            Field.new(display_name_en: 'Collapsed Field 2', name: 'collapsed_field_2', type: 'text_field')
          ],
          collapsed_field_names: %w[collapsed_field_1 collapsed_field_2]
        )

        ruby_string = RubyConfigExporter.new.config_to_ruby_string('FormSection', form_section.configuration_hash)
        form_section.destroy!
        # rubocop:disable Security/Eval
        eval(ruby_string)
        # rubocop:enable Security/Eval
        expect(FormSection.count).to eq(1)
        expect(FormSection.first.collapsed_fields.pluck(:name)).to eq(%w[collapsed_field_1 collapsed_field_2])
      end
    end
  end
end
