# frozen_string_literal: true

require 'rails_helper'

describe MatchingService, search: true do
  before(:each) { clean_data(Trace, TracingRequest, Child) }

  let(:tracing_request1) do
    TracingRequest.create!(
      relation_name: 'Yazen Al-Rashid',
      relation_age: 51,
      relation_date_of_birth: Date.new(1969, 1, 1),
      relation_sex: 'male'
    )
  end

  let(:trace1) do
    Trace.create!(
      tracing_request_id: tracing_request1.id,
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

  let(:tracing_request2) do
    TracingRequest.create!(
      relation_name: 'Benjamin Allen',
      relation_sex: 'male'
    )
  end

  let(:trace2) do
    Trace.create!(
      tracing_request_id: tracing_request2.id,
      relation: 'brother',
      name: 'Arabella Allen',
      name_nickname: 'Bella',
      age: 17,
      date_of_birth: Date.new(2003, 1, 16),
      sex: 'female',
      religion: ['christian'],
      nationality: ['uk'],
      language: %w[english french],
      ethnicity: ['english']
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
          relation_ethicity: ['arab'],
          relation_nationality: ['iraq']
        },
        {
          relation_name: 'Hadeel Al-Rashid',
          relation: 'mother',
          relation_age: 52,
          relation_date_of_birth: Date.new(1970, 1, 1),
          relation_ethicity: ['arab'],
          relation_nationality: ['iraq']
        }
      ]
    )
  end

  let(:case2) do
    Child.create!(
      name: 'Anna Cartmel Ventura',
      name_nickname: 'Annie',
      sex: 'female',
      age: 9,
      date_of_birth: Date.new(2010, 10, 19),
      nationality: ['usa'],
      location_current: 'XYZ789',
      ethnicity: ['other'],
      language: ['english'],
      consent_for_tracing: true,
      family_details_section: [
        {
          relation_name: 'Bill Ventura',
          relation: 'father',
          relation_age: 49,
          relation_date_of_birth: Date.new(1971, 2, 1),
          relation_ethnicity: ['other'],
          relation_nationality: ['usa']
        }
      ]
    )
  end

  let(:case3) do
    Child.create!(
      name: 'Geoffrey Wilkes',
      sex: 'male',
      age: 11,
      consent_for_tracing: false
    )
  end

  describe '.find_match_records' do
    before(:each) { case3 && Sunspot.commit }

    it 'runs a Solr query based on given criteria' do
      result = MatchingService.new.find_match_records({ name: 'Geoffrey', age: 11 }, Child, false)
      expect(result.size).to eq(1)
      expect(result[case3.id]).to be
    end

    it 'will not find results for case that have not provided consent' do
      result = MatchingService.new.find_match_records({ name: 'Geoffrey', age: 11 }, Child)
      expect(result.size).to eq(0)
    end
  end

  describe '.matches_for' do
    describe 'traces' do
      before :each do
        tracing_request1 && trace1 && case1 && case2 && Sunspot.commit
      end

      it 'finds all matching cases for this trace' do
        matches = MatchingService.matches_for(trace1)
        expect(matches.size).to eq(1)
        expect(matches[0].trace).to eq(trace1)
        expect(matches[0].child.id).to eq(case1.id)
      end
    end

    describe 'cases' do
      before :each do
        tracing_request1 && trace1 && case1 && tracing_request2 && trace2 && Sunspot.commit
      end

      it 'finds all matching cases for this trace' do
        matches = MatchingService.matches_for(case1)
        expect(matches.size).to eq(1)
        expect(matches[0].trace.id).to eq(trace1.id)
        expect(matches[0].child.id).to eq(case1.id)
      end
    end
  end

  describe '.normalize_search_results' do
    let(:match_results) { { 'a' => 2.5, 'b' => 0.025 } }
    let(:normalized_results) { MatchingService.new.normalize_search_results(match_results) }

    it 'discards results below a normalized threshold of 0.1' do
      expect(normalized_results.size).to eq(1)
      expect(normalized_results['a']).to be
    end

    it 'normalizes scores' do
      expect(normalized_results['a'][:score]).to eq(1.0)
    end

    it 'marks a result as likely if its the only one left after thresholding' do
      expect(normalized_results['a'][:likelihood]).to eq(MatchingService::LIKELY)
    end
  end

  after(:each) { clean_data(Trace, TracingRequest, Child) }
end
