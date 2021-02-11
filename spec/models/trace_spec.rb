# frozen_string_literal: true

require 'rails_helper'

describe Trace, search: true do
  before :each do
    clean_data(PrimeroModule, TracingRequest, Trace, Child)
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

  describe 'matched_case_comparison' do
    before :each do
      @module_cp = PrimeroModule.new(name: 'CP')
      @module_cp.save(validate: false)
      @case = Child.create(data:
        {
          name: 'Ausama Al Rashid',
          owned_by: 'user1',
          module_id: @module_cp.unique_id
        })
      trace.matched_case = @case
      trace.save!
    end

    it 'returns the comparison data for the matched case' do
      expect(trace.matched_case_comparison).to eq({
        case_to_trace: [
          { case_value: "Ausama Al Rashid", field_name: "name", match: "match", trace_value: "Ausama Al Rashid"},
          { case_value: nil, field_name: "name_nickname", match: "mismatch", trace_value: "Asman beg"},
          { case_value: nil, field_name: "name_other", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "sex", match: "mismatch", trace_value: "male"},
          { case_value: nil, field_name: "age", match: "mismatch", trace_value: 13},
          { case_value: nil, field_name: "date_of_birth", match: "mismatch", trace_value: Date.new(2007, 1, 16) },
          { case_value: nil, field_name: "nationality", match: "mismatch", trace_value: ["syria"]},
          { case_value: nil, field_name: "ethnicity", match: "mismatch", trace_value: ["kurd"]},
          { case_value: nil, field_name: "religion", match: "mismatch", trace_value: ["sunni"]},
          { case_value: nil, field_name: "language", match: "mismatch", trace_value: ["arabic", "kurdish"]},
          { case_value: nil, field_name: "location_last", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "telephone_last", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "location_birth", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "location_current", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "address_current", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "date_of_separation", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "separation_cause", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "separation_cause_other", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "location_before_separation", match: "blank", trace_value: nil},
          { case_value: nil, field_name: "location_separation", match: "blank", trace_value: nil}
        ],
        family_to_inquirer: []
      })
    end
  end

  after :each do
    clean_data(PrimeroModule, TracingRequest, Trace, Child)
  end
end
