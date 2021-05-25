# frozen_string_literal: true

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
      Field.new(
        name: 'family_details',
        type: Field::SUBFORM,
        subform: FormSection.new(
          fields: [
            Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
            Field.new(name: 'relation_type', type: Field::SELECT_BOX)
          ]
        )
      )
    ]
  end

  let(:service) { RecordJsonValidatorService.new(fields: fields) }

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
end
