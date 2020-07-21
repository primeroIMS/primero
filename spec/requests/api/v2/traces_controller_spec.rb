# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::TracesController, type: :request do
  before(:each) { clean_data(Trace, TracingRequest) }
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
    end
  end
end
