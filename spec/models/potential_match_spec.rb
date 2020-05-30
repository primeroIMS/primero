# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'

describe PotentialMatch do
  before do
    clean_data(Child, TracingRequest)

    @tracing_request = TracingRequest.new(
      data: {
        created_by: 'some_user', relation_name: 'some_relation_name',
        owned_by: 'worker_user',
        inquiry_date: Date.new(2017, 3, 1)
      }
    )
    @case = Child.new(
      data: {
        created_by: 'some_user', age: 14, name: 'some_child_name',
        sex: 'female', owned_by: 'worker_user',
        registration_date: Date.new(2017, 2, 1)
      }
    )

    @potential_match = PotentialMatch.new(
      child: @case,
      tracing_request: @tracing_request,
      tr_subform_id: 'abc123',
      average_rating: 4.321
    )
  end

  describe 'comparison' do
    describe '.compare_values' do
      before do
        @potential_match = PotentialMatch.new
      end

      context 'when the values are present and equal' do
        it 'returns a match' do
          expect(@potential_match.compare_values('male', 'male')).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns a match with multi-selected values' do
          expect(@potential_match.compare_values(%w[eth1 eth2], %w[eth2 eth1])).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns a match with only one multi-selected value' do
          expect(@potential_match.compare_values('eth3', ['eth3'])).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns match with non-string values' do
          expect(@potential_match.compare_values(20, 20)).to eq(PotentialMatch::VALUE_MATCH)
        end
      end

      context 'when at least one value is present and the values are not equal' do
        it 'returns a mismatch' do
          expect(@potential_match.compare_values('female', 'male')).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns a mismatch with un-identical multi-selected values' do
          expect(@potential_match.compare_values(%w[female child], %w[male adult])).to eq(
            PotentialMatch::VALUE_MISMATCH
          )
        end

        it 'returns a mismatch with multi-selected values' do
          expect(@potential_match.compare_values(%w[eth1 eth2], %w[eth1 eht2 eth3])).to eq(
            PotentialMatch::VALUE_MISMATCH
          )
        end

        it 'returns mismatch with either value is empty or null' do
          expect(@potential_match.compare_values('south', '')).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns mismatch with non-string values' do
          expect(@potential_match.compare_values(20, 10)).to eq(PotentialMatch::VALUE_MISMATCH)
        end
      end

      context 'when values are not present' do
        it 'returns false with null values' do
          expect(@potential_match.compare_values(nil, nil)).to be_falsy
        end

        it 'returns false with empty values' do
          expect(@potential_match.compare_values('', '')).to be_falsy
        end
      end
    end

    describe '.case_fields_for_comparison' do
      before do
        clean_data(Field, FormSection)
        @form_section = create(
          :form_section,
          fields: [
            build(
              :field,
              name: 'sex', display_name: 'Sex', type: Field::SELECT_BOX,
              option_strings_source: 'lookup lookup-gender', matchable: true
            ),
            build(:field, name: 'age', display_name: 'Age', type: Field::NUMERIC_FIELD, matchable: true),
            build(:field, name: 'name', display_name: 'Service Due Dates', type: Field::TEXT_FIELD, matchable: true),
            build(:field, name: 'comments', type: Field::TEXT_AREA, display_name: 'Comments', matchable: true),
            build(
              :field,
              name: 'sex_of_caregiver', display_name: 'Sex', type: Field::SELECT_BOX,
              option_strings_source: 'lookup lookup-gender', matchable: false
            )
          ]
        )
      end

      it 'returns non-text matchable fields' do
        field_names = PotentialMatch.case_fields_for_comparison.map(&:name)
        expect(field_names).to contain_exactly('sex', 'age')
      end
    end

    describe '.compare_case_to_trace' do
      before :each do
        clean_data(Field, FormSection)
        subform_fields = [
          Field.new(
            name: 'sex', type: Field::SELECT_BOX, matchable: true, display_name: 'Sex',
            option_strings_source: 'lookup lookup-gender'
          ),
          Field.new(
            name: 'age',
            type: Field::NUMERIC_FIELD,
            matchable: true,
            display_name: 'Age'
          )
        ]
        @subform_section = FormSection.new(
          is_nested: true,
          unique_id: 'subform_section_1',
          parent_form: 'case',
          fields: subform_fields,
          name: 'Nested Subform Section 1'
        )
        @subform_section.save!

        fields = [
          Field.new(
            name: 'name',
            type: Field::TEXT_FIELD,
            display_name: 'Name',
            matchable: true
          ),
          Field.new(
            name: 'sex',
            type: Field::SELECT_BOX,
            matchable: true,
            display_name: 'Sex',
            option_strings_source: 'lookup lookup-gender'
          ),
          Field.new(
            name: 'age',
            type: Field::NUMERIC_FIELD,
            matchable: true,
            display_name_all: 'Age'
          ),
          Field.new(
            name: 'subform_section_1',
            type: 'subform',
            subform_section_id: @subform_section.id,
            display_name: 'Subform Section 1'
          )
        ]
        @form_section = FormSection.new(
          unique_id: 'form_section_test_1',
          parent_form: 'case',
          name: 'Form Section Test 1',
          fields: fields
        )
        @form_section.save!

        @child = Child.new(data: { name: 'temp', sex: 'male', age: 12, subform_section_1: [{ sex: 'male', age: 12 }] })
        @tracing_request = TracingRequest.new(
          data: {
            tracing_request_subform_section: [{ unique_id: '1', age: 12, sex: 'female' }]
          }
        )
        @potential_match = PotentialMatch.new(child: @child, tracing_request: @tracing_request, tr_subform_id: '1')
      end

      after :each do
        clean_data(Field, FormSection)
      end

      it 'returns comparison hash for case' do
        case_comparison = @potential_match.compare_case_to_trace[:case].first
        expect(case_comparison[:form_name]).to eq(@form_section.name)
        sex_comparison = case_comparison[:case_values].select { |c| c[:case_field].name == 'sex' }.first
        age_comparison = case_comparison[:case_values].select { |c| c[:case_field].name == 'age' }.first
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'returns comparison hash for case_subform' do
        case_comparison = @potential_match.compare_case_to_trace[:case_subform].first
        expect(case_comparison[:form_name]).to eq(@subform_section.name)
        sex_comparison = case_comparison[:case_values].select { |c| c[:case_field].name == 'sex' }.first
        age_comparison = case_comparison[:case_values].select { |c| c[:case_field].name == 'age' }.first
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end
    end

    describe '.compare_names' do
      before do
        @child = build(:child, age: 12, sex: 'male', name: 'Test User', name_other: 'Someone', name_nickname: 'Nicky')
        @tracing_request = TracingRequest.new(
          data: {
            tracing_request_subform_section: [
              { unique_id: '1', age: 12, sex: 'female', name: 'Tester', name_nickname: 'Nicks' }\
            ]
          }
        )
        @potential_match = PotentialMatch.new(child: @child, tracing_request: @tracing_request, tr_subform_id: '1')
      end

      it 'returns comparable name fields for case and trace' do
        comparable_names = @potential_match.compare_names
        expect(comparable_names.length).to eq 3
        expect(PotentialMatch.comparable_name_fields).to include(comparable_names.first[:field])
        expect(PotentialMatch.comparable_name_fields).to include(comparable_names.last[:field])
        expect(comparable_names.first[:child_name]).to eq 'Test User'
        expect(comparable_names.first[:trace_name]).to eq 'Tester'
        expect(comparable_names[1][:trace_name]).to eq '-'
      end
    end

    describe '.case_to_trace_values' do
      before do
        @sex = Field.new(name: 'sex')
        @age = Field.new(name: 'age')
        @child = Child.new(data: { age: 12, sex: 'male' })
        @trace = { unique_id: '1', age: 12, sex: 'female' }
        @tracing_request = TracingRequest.new(
          data: { tracing_request_subform_section: [@trace] }
        )
        @potential_match = PotentialMatch.new(child: @child, tracing_request: @tracing_request, tr_subform_id: '1')
      end

      it 'returns comparable hash of fields for case and trace' do
        sex_comparison = @potential_match.case_to_trace_values(@sex, @child.data)
        age_comparison = @potential_match.case_to_trace_values(@age, @child.data)
        expect(age_comparison[:case_value]).to eq(@child.age)
        expect(age_comparison[:trace_value]).to eq(@trace[:age])
        expect(sex_comparison[:case_value]).to eq(@child.sex)
        expect(sex_comparison[:trace_value]).to eq(@trace[:sex])
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end
    end
  end

  xdescribe 'set_visible' do
    context 'when type is case' do
      before do
        @type = 'case'
      end

      context 'when all is passed in for associated_users' do
        it 'sets visible to true' do
          @potential_match.set_visible(['all'], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@case.owned_by], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(%w[some_other_user yet_another_user], @type)
          expect(@potential_match.visible).to be_falsey
        end
      end
    end

    context 'when type is tracing_request' do
      before do
        @type = 'tracing_request'
      end

      context 'when all is passed in for associated_users' do
        it 'sets visible to true' do
          @potential_match.set_visible(['all'], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@tracing_request.owned_by], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(%w[some_other_user yet_another_user], @type)
          expect(@potential_match.visible).to be_falsey
        end
      end
    end
  end

  describe 'group_match_records' do
    before do
      @potential_match_0_1 = PotentialMatch.new(
        tracing_request: @tracing_request, child: @case,
        average_rating: 2.321, tr_subform_id: 'abc123'
      )
      @potential_match_0_2 = PotentialMatch.new(
        tracing_request: @tracing_request, child: @case,
        average_rating: 1.321, tr_subform_id: 'def456'
      )
      @tracing_request_1 = TracingRequest.create(
        data: {
          created_by: 'some_user', relation_name: 'some_relation_name',
          owned_by: 'worker_user', inquiry_date: '01-Mar-2017'
        }
      )
      @case_1 = Child.create(
        data: {
          created_by: 'some_user', age: 14, name: 'some_child_name',
          sex: 'female', owned_by: 'worker_user', registration_date: Date.new(2017, 2, 1)
        }
      )
      @potential_match_1_0 = PotentialMatch.new(
        tracing_request: @tracing_request_1, child: @case_1,
        average_rating: 9.321, tr_subform_id: 'def456'
      )
      @potential_match_1_1 = PotentialMatch.new(
        tracing_request: @tracing_request_1, child: @case_1,
        average_rating: 0.321, tr_subform_id: 'def456'
      )
      @potential_match_1_2 = PotentialMatch.new(
        tracing_request: @tracing_request_1, child: @case_1,
        average_rating: 0.333, tr_subform_id: 'def456'
      )
      @potential_match_1_3 = PotentialMatch.new(
        tracing_request: @tracing_request_1, child: @case_1,
        average_rating: 3.321, tr_subform_id: 'ghi789'
      )
      @potential_match_1_4 = PotentialMatch.new(
        tracing_request: @tracing_request_1, child: @case_1,
        average_rating: 0.321, tr_subform_id: 'ghi789'
      )
      @potential_matches = [
        @potential_match, @potential_match_1_0, @potential_match_0_2, @potential_match_0_1,
        @potential_match_1_3, @potential_match_1_1, @potential_match_1_2, @potential_match_1_4
      ]
    end

    context 'when type is case' do
      before do
        @type = 'case'
      end

      it 'returns a list grouped by child ids and sorted by average rating' do
        expected = [
          [
            @case_1.id,
            [
              @potential_match_1_0, @potential_match_1_3,
              @potential_match_1_1, @potential_match_1_2, @potential_match_1_4
            ]
          ],
          [
            @case.id,
            [@potential_match, @potential_match_0_2, @potential_match_0_1]
          ]
        ]
        expect(PotentialMatch.group_match_records(@potential_matches, @type)).to eq(expected)
      end
    end

    context 'when type is tracing_request' do
      before do
        @type = 'tracing_request'
      end

      it 'returns a list grouped by tracing request ids and sorted by average rating' do
        expected = [
          [
            [@tracing_request_1.id, 'def456'],
            [@potential_match_1_0, @potential_match_1_1, @potential_match_1_2]
          ],
          [
            [@tracing_request.id, 'abc123'],
            [@potential_match, @potential_match_0_1]
          ],
          [
            [@tracing_request_1.id, 'ghi789'],
            [@potential_match_1_3, @potential_match_1_4]
          ],
          [
            [@tracing_request.id, 'def456'],
            [@potential_match_0_2]
          ]
        ]
        expect(PotentialMatch.group_match_records(@potential_matches, @type)).to eq(expected)
      end
    end
  end

  describe 'likelihood' do
    before do
      @potential_match = PotentialMatch.new(average_rating: 0.9)
    end

    it 'marks a potential match as "likely" if it is more than 0.7 away from the average' do
      @potential_match.set_likelihood(@potential_match.average_rating, 0.15)
      expect(@potential_match.likelihood).to eq(Matchable::LIKELY)
    end

    it 'marks a potential match as "possible" if it is less than 0.7 away from the average' do
      @potential_match.set_likelihood(@potential_match.average_rating, 0.7)
      expect(@potential_match.likelihood).to eq(Matchable::POSSIBLE)
    end
  end
end
