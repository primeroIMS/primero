# frozen_string_literal: true

require 'rails_helper'

describe Trace, search: true do
  before :each do
    clean_data(TracingRequest, Trace)
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

  after :each do
    clean_data(TracingRequest, Trace)
  end
end
