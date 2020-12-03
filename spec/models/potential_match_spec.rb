# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'

describe PotentialMatch do
  before do
    clean_data(Child, TracingRequest, Trace)
  end

  let(:tracing_request) do
    TracingRequest.create!(
      relation_name: 'Yazen Al-Rashid',
      relation_age: 51,
      relation_date_of_birth: Date.new(1969, 1, 1),
      relation_sex: 'male'
    )
  end

  let(:trace) do
    Trace.create!(
      tracing_request_id: tracing_request.id,
      relation: 'father',
      name: 'Ausama Al Rashid',
      name_nickname: 'Asman beg',
      age: 13,
      date_of_birth: Date.new(2007, 1, 16),
      sex: 'male',
      religion: ['sunni'],
      nationality: ['syria'],
      language: %w[arabic kurdish],
      ethnicity: ['kurd']
    )
  end

  let(:case1) do
    Child.create!(
      name: 'Usama Yazan Al-Rashid',
      name_nickname: 'Usman Beg',
      sex: 'male',
      age: 13,
      date_of_birth: Date.new(2006, 10, 19),
      nationality: ['syria'],
      location_current: 'ABC123',
      ethnicity: ['kurd'],
      language: ['arabic'],
      consent_for_tracing: true,
      family_details_section: [
        {
          relation_name: 'Yazan Al-Rashid',
          relation: 'father',
          relation_age: 51,
          relation_date_of_birth: Date.new(1969, 1, 1),
          relation_ethnicity: ['arab'],
          relation_nationality: ['iraq']
        },
        {
          relation_name: 'Hadeel Al-Rashid',
          relation: 'mother',
          relation_age: 52,
          relation_date_of_birth: Date.new(1970, 1, 1),
          relation_ethnicity: ['arab'],
          relation_nationality: ['iraq']
        }
      ]
    )
  end

  let(:potential_match) do
    PotentialMatch.new(
      child: case1,
      trace: trace
    )
  end

  describe '.compare_values' do
    context 'when the values are present and equal' do
      it 'returns a match' do
        expect(potential_match.compare_values('male', 'male')).to eq(PotentialMatch::VALUE_MATCH)
      end

      it 'returns a match with multi-selected values' do
        expect(potential_match.compare_values(%w[eth1 eth2], %w[eth2 eth1])).to eq(PotentialMatch::VALUE_MATCH)
      end

      it 'returns a match with only one multi-selected value' do
        expect(potential_match.compare_values('eth3', ['eth3'])).to eq(PotentialMatch::VALUE_MATCH)
      end

      it 'returns match with non-string values' do
        expect(potential_match.compare_values(20, 20)).to eq(PotentialMatch::VALUE_MATCH)
      end
    end

    context 'when at least one value is present and the values are not equal' do
      it 'returns a mismatch' do
        expect(potential_match.compare_values('female', 'male')).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'returns a mismatch with un-identical multi-selected values' do
        expect(potential_match.compare_values(%w[female child], %w[male adult])).to eq(
          PotentialMatch::VALUE_MISMATCH
        )
      end

      it 'returns a mismatch with multi-selected values' do
        expect(potential_match.compare_values(%w[eth1 eth2], %w[eth1 eht2 eth3])).to eq(
          PotentialMatch::VALUE_MISMATCH
        )
      end

      it 'returns mismatch with either value is empty or null' do
        expect(potential_match.compare_values('south', '')).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'returns mismatch with non-string values' do
        expect(potential_match.compare_values(20, 10)).to eq(PotentialMatch::VALUE_MISMATCH)
      end
    end

    context 'when values are not present' do
      it 'returns false with null values' do
        expect(potential_match.compare_values(nil, nil)).to eq(PotentialMatch::VALUE_BLANK)
      end

      it 'returns false with empty values' do
        expect(potential_match.compare_values('', '')).to eq(PotentialMatch::VALUE_BLANK)
      end
    end
  end

  describe '.comparison' do
    let(:comparison) { potential_match.comparison }

    describe 'case to trace' do
      let(:case_to_trace) { comparison[:case_to_trace] }
      let(:sex_comparison) { case_to_trace.find { |c| c[:field_name] == 'sex' } }
      let(:ethnicity_comparison) { case_to_trace.find { |c| c[:field_name] == 'ethnicity' } }
      let(:location_comparison) { case_to_trace.find { |c| c[:field_name] == 'location_current' } }
      let(:separation_cause_comparison) { case_to_trace.find { |c| c[:field_name] == 'separation_cause' } }

      it 'shows matching values' do
        expect(sex_comparison[:match]).to eq(PotentialMatch::VALUE_MATCH)
        expect(ethnicity_comparison[:match]).to eq(PotentialMatch::VALUE_MATCH)
      end

      it 'shows mismatching values' do
        expect(location_comparison[:match]).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'shows blank values' do
        expect(separation_cause_comparison[:match]).to eq(PotentialMatch::VALUE_BLANK)
      end
    end

    describe 'family to inquirer' do
      let(:family_to_inquirer) { comparison[:family_to_inquirer] }
      let(:father_comparison) do
        family_to_inquirer.find { |c| c.find { |f| f[:field_name] == 'relation' && f[:case_value] == 'father' } }
      end
      let(:father_comparison_ethnicity) { father_comparison.find { |c| c[:field_name] == 'relation_ethnicity' } }
      let(:father_comparison_language) { father_comparison.find { |c| c[:field_name] == 'relation_language' } }
      let(:father_comparison_location) { father_comparison.find { |c| c[:field_name] == 'relation_location_current' } }

      it 'corresponds to every family member' do
        expect(family_to_inquirer.size).to eq(case1.family_details_section.size)
      end

      it 'shows matching values for each member' do
        expect(father_comparison_language[:match]).to eq(PotentialMatch::VALUE_MATCH)
      end

      it 'shows mismatching values' do
        expect(father_comparison_ethnicity[:match]).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'shows blank values' do
        expect(father_comparison_location[:match]).to eq(PotentialMatch::VALUE_BLANK)
      end
    end
  end
end
