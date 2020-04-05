# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::TracingRequestsController, type: :request do
  before :each do
    @tracing_request1 = TracingRequest.create!(data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1' })
    @tracing_request2 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 2' })
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/tracing_requests', search: true do
    it 'lists tracing_requests and accompanying metadata' do
      login_for_test
      get '/api/v2/tracing_requests'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map { |c| c['relation_name'] }).to include(
        @tracing_request1.relation_name,
        @tracing_request2.relation_name
      )
      expect(json['metadata']['total']).to eq(2)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    it 'returns flag_count for the short form ' do
      @tracing_request1.add_flag('This is a flag IN', Date.today, 'faketest')

      login_for_test(permissions: permission_flag_record)
      get '/api/v2/tracing_requests?fields=short'

      expect(response).to have_http_status(200)
      expect(
        json['data'].map { |record| record['flag_count'] if record['id'] == @tracing_request1.id }.compact
      ).to eq([1])
    end
  end

  describe 'GET /api/v2/tracing_requests/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/tracing_requests/#{@tracing_request1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@tracing_request1.id)
    end
  end

  describe 'POST /api/v2/tracing_requests' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = { data: { inquiry_date: '2019-04-01', relation_name: 'Test' } }
      post '/api/v2/tracing_requests', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['inquiry_date']).to eq(params[:data][:inquiry_date])
      expect(json['data']['relation_name']).to eq(params[:data][:relation_name])
      expect(TracingRequest.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'PATCH /api/v2/tracing_requests/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { inquiry_date: '2019-04-01', relation_name: 'Tester' } }
      patch "/api/v2/tracing_requests/#{@tracing_request1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@tracing_request1.id)

      tracing_request1 = TracingRequest.find_by(id: @tracing_request1.id)
      expect(tracing_request1.data['inquiry_date'].iso8601).to eq(params[:data][:inquiry_date])
      expect(tracing_request1.data['relation_name']).to eq(params[:data][:relation_name])
    end
  end

  describe 'DELETE /api/v2/tracing_requests/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::ENABLE_DISABLE_RECORD])
        ]
      )
      delete "/api/v2/tracing_requests/#{@tracing_request1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@tracing_request1.id)

      tracing_request1 = TracingRequest.find_by(id: @tracing_request1.id)
      expect(tracing_request1.record_state).to be false
    end
  end
end
