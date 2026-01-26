# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RecordJsonValidatorService do
  let(:fields) do
    [
      Field.new(name: 'name', type: Field::TEXT_FIELD),
      Field.new(name: 'age', type: Field::NUMERIC_FIELD),
      Field.new(name: 'sex', type: Field::SELECT_BOX),
      Field.new(name: 'national_id_no', type: Field::TEXT_FIELD),
      Field.new(name: 'consent_for_services', type: Field::TICK_BOX),
      Field.new(name: 'current_address', type: Field::TEXT_AREA),
      Field.new(name: 'protection_concerns', type: Field::SELECT_BOX, multi_select: true),
      Field.new(name: 'registration_date', type: Field::DATE_FIELD),
      Field.new(name: 'created_on', type: Field::DATE_FIELD, date_include_time: true),
      Field.new(name: 'separator1', type: Field::SEPARATOR),
      Field.new(name: 'other_documents', type: Field::DOCUMENT_UPLOAD_BOX),
      Field.new(name: 'calculated', type: Field::CALCULATED),
      Field.new(
        name: 'family_details',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
            Field.new(name: 'relation_type', type: Field::SELECT_BOX)
          ]
        )
      ),
      Field.new(
        name: 'sources',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'source_id', type: Field::TEXT_FIELD),
            Field.new(name: 'violations_ids', type: Field::SELECT_BOX, multi_select: true)
          ]
        )
      )
    ]
  end

  let(:service) { RecordJsonValidatorService.new(fields:) }

  describe '.valid?' do
    describe 'TEXT_FIELD' do
      it 'accepts text' do
        expect(service.valid?('name' => 'David')).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('name' => nil)).to be_truthy
      end

      it 'rejects arrays' do
        expect(service.valid?('name' => ['David'])).to be_falsey
      end
    end

    describe 'TEXT_AREA' do
      it 'accepts text' do
        expect(service.valid?('current_address' => "5 David St.\nTown Town\n123445")).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('current_address' => nil)).to be_truthy
      end

      it 'rejects arrays' do
        expect(service.valid?('current_address' => ['David'])).to be_falsey
      end
    end

    describe 'DATE FIELD' do
      it 'accepts ISO date strings' do
        expect(service.valid?('registration_date' => '2021-05-15')).to be_truthy
      end

      it 'accepts ISO date time strings' do
        expect(service.valid?('created_on' => '2021-05-15T00:31:22+00:00')).to be_truthy
      end

      it 'accepts Date objects' do
        expect(service.valid?('registration_date' => Date.new(2021, 5, 15))).to be_truthy
      end

      it 'accepts Time objects' do
        expect(service.valid?('created_on' => Time.new(2021, 5, 15, 14, 38, 44))).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('registration_date' => nil)).to be_truthy
        expect(service.valid?('created_on' => nil)).to be_truthy
      end

      it 'rejects unformatted dates' do
        expect(service.valid?('registration_date' => 'May 15 2021')).to be_falsey
      end

      it 'rejects unformatted date times' do
        expect(service.valid?('created_on' => 'May 15 2021 00:31:22+00:00')).to be_falsey
      end
    end

    describe 'TICK_BOX' do
      it 'accepts booleans' do
        expect(service.valid?('consent_for_services' => true)).to be_truthy
        expect(service.valid?('consent_for_services' => false)).to be_truthy
      end

      # TODO: Not sure yet about this
      # it 'accepts nil values' do
      #   expect(service.valid?('consent_for_services' => nil)).to be_truthy
      # end

      it 'rejects non-boolean values' do
        expect(service.valid?('consent_for_services' => 'yes')).to be_falsey
      end
    end

    describe 'NUMERIC_FIELD' do
      it 'accepts numbers' do
        expect(service.valid?('age' => 10)).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('age' => nil)).to be_truthy
      end

      it 'rejects non-numerics values' do
        expect(service.valid?('age' => 'ten')).to be_falsey
      end

      it 'rejects very big numeric values' do
        expect(service.valid?('age' => 3_000_000_000)).to be_falsey
      end
    end

    describe 'SELECT_BOX' do
      describe 'single-select' do
        it 'accepts text' do
          expect(service.valid?('sex' => 'female')).to be_truthy
        end

        it 'accepts nil values' do
          expect(service.valid?('sex' => nil)).to be_truthy
        end

        it 'rejects arrays' do
          expect(service.valid?('sex' => ['female'])).to be_falsey
        end
      end

      describe 'multi-select' do
        it 'accepts arrays of strings' do
          expect(service.valid?('protection_concerns' => %w[unaccompanied separated])).to be_truthy
        end

        it 'accepts nil values' do
          expect(service.valid?('protection_concerns' => nil)).to be_truthy
        end

        it 'accepts empty arrays' do
          expect(service.valid?('protection_concerns' => [])).to be_truthy
        end

        it 'rejects arrays of numbers' do
          expect(service.valid?('protection_concerns' => [1, 2, 3])).to be_falsey
        end

        it 'rejects arrays of hashes' do
          expect(service.valid?('protection_concerns' => [{}, {}, {}])).to be_falsey
        end

        it 'rejects text' do
          expect(service.valid?('protection_concerns' => 'unaccompanied')).to be_falsey
        end
      end
    end

    describe 'SUBFORM' do
      let(:father) { { 'relation_name' => 'James', 'relation_type' => 'father' } }
      let(:mother) { { 'relation_name' => 'Maria', 'relation_type' => 'mother' } }
      let(:sister_malformatted) { { 'relation_name' => ['Saira'], 'relation_type' => 'sister' } }
      let(:sister_extra) { { 'relation_name' => 'Saira', 'relation_type' => 'sister', 'relation_age' => 15 } }
      let(:source) { { 'source_id' => '1234', 'violations_ids' => %w[abc123] } }

      it 'accepts arrays of subform hashes' do
        expect(service.valid?('family_details' => [mother, father])).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('family_details' => nil)).to be_truthy
      end

      it 'accepts empty arrays' do
        expect(service.valid?('family_details' => [])).to be_truthy
      end

      it 'rejects malformatted subform hashes' do
        expect(service.valid?('family_details' => [mother, sister_malformatted])).to be_falsey
      end

      it 'rejects subform hashes with extra properties' do
        expect(service.valid?('family_details' => [mother, sister_extra])).to be_falsey
      end

      it 'accepts arrays of subform hashes for violations' do
        expect(service.valid?('sources' => [source])).to be_truthy
      end
    end

    describe 'CALCULATED' do
      it 'accepts numbers' do
        expect(service.valid?('calculated' => 1)).to be_truthy
      end

      it 'accepts nil values' do
        expect(service.valid?('calculated' => nil)).to be_truthy
      end

      it 'accepts string values' do
        expect(service.valid?('calculated' => 'string')).to be_truthy
      end

      it 'accepts boolean values' do
        expect(service.valid?('calculated' => true)).to be_truthy
      end

      it 'accepts array values' do
        expect(service.valid?('calculated' => [])).to be_falsey
      end

      it 'rejects very big numeric values' do
        expect(service.valid?('calculated' => 3_000_000_000)).to be_falsey
      end
    end

    describe 'other field types' do
      it 'rejects SEPARATOR fields' do
        expect(service.valid?('separator1' => 'haxxxxx')).to be_falsey
        expect(service.valid?('separator1' => nil)).to be_falsey
      end

      it 'rejects DOCUMENT_UPLOAD_BOX fields' do
        expect(service.valid?('other_documents' => 'haxxxxx')).to be_falsey
        expect(service.valid?('other_documents' => nil)).to be_falsey
      end

      it 'rejects unspecified fields' do
        expect(service.valid?('foo' => 'haxxxxx')).to be_falsey
        expect(service.valid?('foo' => nil)).to be_falsey
      end
    end
  end

  describe 'field values' do
    before :each do
      clean_data(Field, FormSection, Lookup)
    end

    let!(:lookup_true_false) do
      create(
        :lookup,
        unique_id: 'lookup-true-false',
        name: 'True/False',
        lookup_values_en: [
          { id: 'true', display_text: 'True' },
          { id: 'false', display_text: 'False' }
        ]
      )
    end

    let!(:lookup_gender) do
      create(
        :lookup,
        unique_id: 'lookup-gender',
        name: 'Gender',
        lookup_values_en: [
          { id: 'female', display_text: 'Female' },
          { id: 'male', display_text: 'Male' }
        ]
      )
    end

    let(:form_section_child) do
      FormSection.create!(
        unique_id: 'child_form',
        name_en: 'Child Form',
        is_nested: true,
        fields: [
          Field.new(
            name: 'sex',
            display_name_en: 'Sex',
            type: Field::SELECT_BOX,
            option_strings_text_i18n: [
              { 'id' => 'other_female', 'display_text' => { 'en' => 'Female (Other)' } },
              { 'id' => 'other_male', 'display_text' => { 'en' => 'Male (Other)' } }
            ]
          ),
          Field.new(
            name: 'consent_given',
            display_name_en: 'Consent Given',
            type: Field::RADIO_BUTTON,
            option_strings_source: 'lookup lookup-true-false'
          )
        ]
      )
    end

    let!(:form_section_parent) do
      FormSection.create!(
        unique_id: 'parent_form',
        name_en: 'Parent Form',
        fields: [
          Field.new(
            name: 'sex',
            display_name_en: 'Sex',
            type: Field::SELECT_BOX,
            option_strings_source: 'lookup lookup-gender'
          ),
          Field.new(
            name: 'child_form', display_name_en: 'Child Form', type: Field::SUBFORM, subform: form_section_child
          )
        ]
      )
    end

    let(:validator_with_values) do
      fields = Field.where(name: %w[sex child_form consent_given])
      field_values = PermittedFieldValuesService.instance.permitted_field_values(fields)
      RecordJsonValidatorService.new(fields:, field_values:)
    end

    it 'validates values for fields with lookups' do
      expect(validator_with_values.valid?('sex' => 'male')).to eq(true)
    end

    it 'accepts booleans for true/false lookups in RadioButton' do
      expect(validator_with_values.valid?('child_form' => [{ 'consent_given' => true }])).to eq(true)
    end

    it 'accepts string for true/false lookups in RadioButton' do
      expect(validator_with_values.valid?('child_form' => [{ 'consent_given' => 'true' }])).to eq(true)
    end

    it 'correctly validates nested fields with the same name' do
      expect(validator_with_values.valid?('sex' => 'female', 'child_form' => [{ 'sex' => 'other_female' }])).to eq(true)
    end
  end
end
