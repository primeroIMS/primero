# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::TracesController, type: :request do
  before(:each) { clean_data(Trace, TracingRequest, PrimeroModule, Child) }
  after(:each) { clean_data(Trace, TracingRequest) }

  let(:tracing_request) { TracingRequest.create!(inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1') }
  let(:trace) { Trace.create!(tracing_request: tracing_request, name: 'Test', age: 5) }

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/traces/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/traces/#{trace.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(trace.id)
      expect(json['data']['tracing_request_id']).to eq(tracing_request.id)
      expect(json['data']['matched_case_comparison']).to be nil
    end

    it 'fetches the comparison data if the trace has a matched case with code 200' do
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

      login_for_test
      get "/api/v2/traces/#{trace.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(trace.id)
      expect(json['data']['tracing_request_id']).to eq(tracing_request.id)
      expect(json['data']['matched_case_comparison']).not_to be nil
    end
  end

  describe 'PATCH /api/v2/traces/:id' do
    let(:case1) { Child.create!(name: 'Test', age: 5, sex: 'male') }

    it 'associates a case and a matched trace' do
      login_for_test
      params = { data: { matched_case_id: case1.id } }
      patch "/api/v2/traces/#{trace.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['matched_case_id']).to eq(case1.id)
      expect(case1.matched_traces.count.positive?).to be_truthy
      expect(case1.matched_traces[0].id).to eq(trace.id)
    end
  end
end
