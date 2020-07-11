# frozen_string_literal: true

require 'rails_helper'

describe Trace, search: true do
  before :each do
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
      name_first: 'Usama',
      name_middle: 'Yazan',
      name_last: 'Al-Rashid',
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
        }
      ]
    )
  end

  let(:case2) do
    Child.create!(
      name_first: 'Anna',
      name_middle: 'Cartmel',
      name_last: 'Ventura',
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
          relation_ethicity: ['other'],
          relation_nationality: ['usa']
        }
      ]
    )
  end

  describe '.match_criteria' do
    let(:match_criteria) { trace.match_criteria }

    it 'fetches all matching criteria from the trace' do
      trace_match_criteria = %w[
        relation name name_nickname age date_of_birth sex religion nationality language ethnicity
      ]
      expect(match_criteria.keys).to include(*trace_match_criteria)
    end

    it 'fetches all matching criteria from the tracing request' do
      expect(match_criteria.keys).to include('relation_name')
    end

    it 'joins multivalues into a single string' do
      expect(match_criteria['language']).to eq('arabic kurdish')
    end
  end

  describe '.find_matching_cases' do
    before :each do
      tracing_request && trace && case1 && case2 && Sunspot.commit
    end

    it 'finds all matching cases for this trace' do
      matches = trace.find_matching_cases
      expect(matches.size).to eq(1)
      expect(matches[0].trace).to eq(trace)
      expect(matches[0].child.id).to eq(case1.id)
      # TODO: Likelihood?
    end
  end

  after :each do
    clean_data(Child, TracingRequest, Trace)
  end
end
