# frozen_string_literal: true

require 'rails_helper'

describe FieldValueService do
  context 'when field is a select field' do
    let(:select_field) do
      Field.new(
        'name' => 'my_select_field',
        'type' => 'select_box',
        'display_name_all' => 'My Select Field',
        'option_strings_text_en' => [
          { id: 'option_one', display_text: 'Option One' }.with_indifferent_access,
          { id: 'option_two', display_text: 'Option Two' }.with_indifferent_access,
          { id: 'option_three', display_text: 'Option Three' }.with_indifferent_access
        ],
        'option_strings_text_fr' => [
          { id: 'option_one', display_text: 'French One' }.with_indifferent_access,
          { id: 'option_two', display_text: 'French Two' }.with_indifferent_access,
          { id: 'option_three', display_text: 'French Three' }.with_indifferent_access
        ],
        'option_strings_text_es' => [
          { id: 'option_one', display_text: 'Spanish One' }.with_indifferent_access,
          { id: 'option_two', display_text: 'Spanish Two' }.with_indifferent_access,
          { id: 'option_three', display_text: 'Spanish Three' }.with_indifferent_access
        ],
        'option_strings_text_ar' => [
          { id: 'option_one', display_text: 'Arabic One' }.with_indifferent_access,
          { id: 'option_two', display_text: 'Arabic Two' }.with_indifferent_access,
          { id: 'option_three', display_text: 'Arabic Three' }.with_indifferent_access
        ]
      )
    end

    context 'and locale is English' do
      it 'returns the translated display text' do
        expect(FieldValueService.value(select_field, 'option_two')).to eq('Option Two')
      end
    end
    context 'and locale is French' do
      before :each do
        I18n.locale = :fr
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(select_field, 'option_two')).to eq('French Two')
      end
    end
    context 'and locale is Spanish' do
      before :each do
        I18n.locale = :es
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(select_field, 'option_two')).to eq('Spanish Two')
      end
    end
    context 'and locale is Arabic' do
      before :each do
        I18n.locale = :ar
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(select_field, 'option_two')).to eq('Arabic Two')
      end
    end
  end

  context 'when field is a lookup select field' do
    before(:all) do
      clean_data(Lookup)
      I18n.locale = :en
      @lookup = Lookup.create!(
        unique_id: 'lookup-ethnicity',
        name: 'Ethnicity',
        lookup_values_en: [
          { id: 'ethnicity_one', display_text: 'Ethnicity One' },
          { id: 'ethnicity_two', display_text: 'Ethnicity Two' },
          { id: 'ethnicity_three', display_text: 'Ethnicity Three' },
          { id: 'ethnicity_four', display_text: 'Ethnicity Four' },
          { id: 'ethnicity_five', display_text: 'Ethnicity Five' }
        ],
        lookup_values_fr: [
          { id: 'ethnicity_one', display_text: 'French Ethnicity One' },
          { id: 'ethnicity_two', display_text: 'French Ethnicity Two' },
          { id: 'ethnicity_three', display_text: 'French Ethnicity Three' },
          { id: 'ethnicity_four', display_text: 'French Ethnicity Four' },
          { id: 'ethnicity_five', display_text: 'French Ethnicity Five' }
        ],
        lookup_values_es: [
          { id: 'ethnicity_one', display_text: 'Spanish Ethnicity One' },
          { id: 'ethnicity_two', display_text: 'Spanish Ethnicity Two' },
          { id: 'ethnicity_three', display_text: 'Spanish Ethnicity Three' },
          { id: 'ethnicity_four', display_text: 'Spanish Ethnicity Four' },
          { id: 'ethnicity_five', display_text: 'Spanish Ethnicity Five' }
        ],
        lookup_values_ar: [
          { id: 'ethnicity_one', display_text: 'Arabic Ethnicity One' },
          { id: 'ethnicity_two', display_text: 'Arabic Ethnicity Two' },
          { id: 'ethnicity_three', display_text: 'Arabic Ethnicity Three' },
          { id: 'ethnicity_four', display_text: 'Arabic Ethnicity Four' },
          { id: 'ethnicity_five', display_text: 'Arabic Ethnicity Five' }
        ]
      )
    end

    let(:lookup_field) do
      Field.new(
        'name' => 'my_lookup_field',
        'type' => 'select_box',
        'display_name_all' => 'My Lookup Field',
        'option_strings_source' => 'lookup lookup-ethnicity'
      )
    end

    context 'and locale is English' do
      it 'returns the translated display text' do
        expect(FieldValueService.value(lookup_field, 'ethnicity_four')).to eq('Ethnicity Four')
      end
    end
    context 'and locale is French' do
      before :each do
        I18n.locale = :fr
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(lookup_field, 'ethnicity_four')).to eq('French Ethnicity Four')
      end
    end
    context 'and locale is Spanish' do
      before :each do
        I18n.locale = :es
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(lookup_field, 'ethnicity_four')).to eq('Spanish Ethnicity Four')
      end
    end
    context 'and locale is Arabic' do
      before :each do
        I18n.locale = :ar
      end
      it 'returns the translated display text' do
        expect(FieldValueService.value(lookup_field, 'ethnicity_four')).to eq('Arabic Ethnicity Four')
      end
    end
  end

  context 'when field is a yes/no field' do
    before :all do
      clean_data(Lookup)
      I18n.locale = :en
      @lookup = Lookup.create!(
        unique_id: 'lookup-yes-no',
        name: 'Yes or No',
        lookup_values_en: [
          { id: 'true', display_text: 'Yes' }.with_indifferent_access,
          { id: 'false', display_text: 'No' }.with_indifferent_access
        ],
        lookup_values_fr: [
          { id: 'true', display_text: 'French Yes' }.with_indifferent_access,
          { id: 'false', display_text: 'French No' }.with_indifferent_access
        ],
        lookup_values_es: [
          { id: 'true', display_text: 'Spanish Yes' }.with_indifferent_access,
          { id: 'false', display_text: 'Spanish No' }.with_indifferent_access
        ],
        lookup_values_ar: [
          { id: 'true', display_text: 'Arabic Yes' }.with_indifferent_access,
          { id: 'false', display_text: 'Arabic No' }.with_indifferent_access
        ]
      )
    end

    let(:lookup_field) do
      Field.new(
        'name' => 'my_lookup_field',
        'type' => 'select_box',
        'display_name_all' => 'My Yes No Field',
        'option_strings_source' => 'lookup lookup-yes-no'
      )
    end

    context 'and value is true' do
      let(:field_value) { true }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Yes')
        end
      end
      context 'and locale is French' do
        before :each do
          I18n.locale = :fr
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('French Yes')
        end
      end
      context 'and locale is Spanish' do
        before :each do
          I18n.locale = :es
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Spanish Yes')
        end
      end
      context 'and locale is Arabic' do
        before :each do
          I18n.locale = :ar
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Arabic Yes')
        end
      end
    end

    context 'and value is false' do
      let(:field_value) { false }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('No')
        end
      end
      context 'and locale is French' do
        before :each do
          I18n.locale = :fr
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('French No')
        end
      end
      context 'and locale is Spanish' do
        before :each do
          I18n.locale = :es
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Spanish No')
        end
      end
      context 'and locale is Arabic' do
        before :each do
          I18n.locale = :ar
        end
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Arabic No')
        end
      end
    end

    context 'and value is nil' do
      let(:field_value) { nil }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to be_nil
        end
      end
    end
  end

  context 'when field is a tickbox field' do
    before :all do
      I18n.locale = :en
    end

    let(:lookup_field) do
      Field.new(
        'name' => 'my_lookup_field',
        'type' => Field::TICK_BOX,
        'display_name_all' => 'My Tickbox Field'
      )
    end

    context 'and value is true' do
      let(:field_value) { true }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('Yes')
        end
      end
    end
    context 'and value is false' do
      let(:field_value) { false }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to eq('No')
        end
      end
    end
    context 'and value is nil' do
      let(:field_value) { nil }

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(FieldValueService.value(lookup_field, field_value)).to be_nil
        end
      end
    end
  end

  context 'when field is a agency field' do
    before :all do
      clean_data(Agency)
      I18n.locale = :en
      Agency.create!(name: 'Agency One', agency_code: 'agency1')
    end

    let(:agency_field) do
      Field.new(
        'name' => 'my_agency_field',
        'type' => Field::SELECT_BOX,
        'display_name_all' => 'My Agency Field',
        'option_strings_source' => 'Agency'
      )
    end
    it 'returns the translated agency name' do
      expect(FieldValueService.value(agency_field, 'agency1')).to eq('Agency One')
    end
  end

  context 'when field is a location field' do
    before :all do
      clean_data(Location)
      I18n.locale = :en
      Location.create!(location_code: 'CT01', type: 'country', admin_level: '0',
        placename_i18n: { en: 'Country01_en', es: 'Country01_es' })
    end

    let(:location_field) do
      Field.new(
        'name' => 'my_location_field',
        'type' => Field::SELECT_BOX,
        'display_name_all' => 'My Location Field',
        'option_strings_source' => 'Location',
      )
    end
    it 'returns the translated location name' do
      expect(FieldValueService.value(location_field, 'CT01', location_service: LocationService.instance)).to eq('Country01_en')
    end
  end
end
