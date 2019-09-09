require 'rails_helper'

describe Api::V2::FlagsController, type: :request do
  include ActiveJob::TestHelper

  before :each do
    Flag.destroy_all
    Child.destroy_all
    TracingRequest.destroy_all
    Incident.destroy_all

    @case1 = Child.create!(data: { name: "Test1", age: 5, sex: 'male' })
    @case2 = Child.create!(data: { name: "Test2", age: 7, sex: 'female' })
    @tracing_request1 = TracingRequest.create!(data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1' })
    @tracing_request2 = TracingRequest.create!(data: { inquiry_date: Date.new(2018, 3, 1), relation_name: 'Test 2' })
    @incident1 = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' })
    @incident2 = Incident.create!(data: { incident_date: Date.new(2018, 3, 1), description: 'Test 2' })

    @case1.add_flag('This is a flag', Date.today, 'faketest')
    @tracing_request1.add_flag('This is a flag TR', Date.today, 'faketest')
    @incident1.add_flag('This is a flag IN', Date.today, 'faketest')

  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/:recordType/:recordId/flags' do
    it 'list flags of a case' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('cases')
      expect(json['data'][0]['message']).to eq( 'This is a flag')
      expect(json['data'][0]['removed']).to be_falsey
    end

    it 'list flags of a tracing request' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/tracing_requests/#{@tracing_request1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @tracing_request1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('tracing_requests')
      expect(json['data'][0]['message']).to eq( 'This is a flag TR')
      expect(json['data'][0]['removed']).to be_falsey
    end

    it 'list flags of an incident' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/incidents/#{@incident1.id}/flags"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @incident1.id.to_s)
      expect(json['data'][0]['record_type']).to eq('incidents')
      expect(json['data'][0]['message']).to eq( 'This is a flag IN')
      expect(json['data'][0]['removed']).to be_falsey
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/:recordType/:recordId/flags' do
    it 'creates a new flag to a case' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][1]['record_id']).to eq( @case1.id.to_s)
      expect(json['data'][1]['record_type']).to eq('cases')
      expect(json['data'][1]['message']).to eq( 'This is another flag')
      expect(json['data'][1]['removed']).to be_falsey
    end

    it 'creates a new flag to a tracing_request' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/tracing_requests/#{@tracing_request1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][1]['record_id']).to eq( @tracing_request1.id.to_s)
      expect(json['data'][1]['record_type']).to eq('tracing_requests')
      expect(json['data'][1]['message']).to eq( 'This is another flag TR')
      expect(json['data'][1]['removed']).to be_falsey
    end

    it 'creates a new flag to an incident' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag IN' } }
      post "/api/v2/incidents/#{@incident1.id}/flags", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][1]['record_id']).to eq( @incident1.id.to_s)
      expect(json['data'][1]['record_type']).to eq('incidents')
      expect(json['data'][1]['message']).to eq( 'This is another flag IN')
      expect(json['data'][1]['removed']).to be_falsey
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'enqueues an audit log job that records the flag attempt' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/#{@case1.id}/flags", params: params

      expect(AuditLogJob).to have_been_enqueued
        .with(record_type: 'Child',
          record_id: @case1.id,
          action: 'create',
          user_id: fake_user_id, #This is technically wrong, but an artifact of the way we do tests
          resource_url: request.url,
          metadata: {user_name: fake_user_name})
    end
  end

  describe 'PATCH /api/v2/:recordType/:recordId/flags/:id' do
    it 'unflag a case' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      @case1.reload
      expect(@case1.flags.first.removed).to be_truthy
      expect(@case1.flags.first.unflag_message).to eq('This is unflag message')
      expect(@case1.flags.first.unflagged_date).to eq(Date.today)
      expect(@case1.flags.first.unflagged_by).to eq('faketest')
    end

    it 'unflag a tracing_request' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message TR' } }
      patch "/api/v2/tracing_requests/#{@tracing_request1.id}/flags/#{@tracing_request1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      @tracing_request1.reload
      expect(@tracing_request1.flags.first.removed).to be_truthy
      expect(@tracing_request1.flags.first.unflag_message).to eq('This is unflag message TR')
      expect(@tracing_request1.flags.first.unflagged_date).to eq(Date.today)
      expect(@tracing_request1.flags.first.unflagged_by).to eq('faketest')
    end

    it 'unflag an incident' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message IN' } }
      patch "/api/v2/incidents/#{@incident1.id}/flags/#{@incident1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      @incident1.reload
      expect(@incident1.flags.first.removed).to be_truthy
      expect(@incident1.flags.first.unflag_message).to eq('This is unflag message IN')
      expect(@incident1.flags.first.unflagged_date).to eq(Date.today)
      expect(@incident1.flags.first.unflagged_by).to eq('faketest')
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/:recordType/flags' do
    it 'flagging cases in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@case1.flag_count).to eq(1)
      expect(@case2.flag_count).to eq(0)

      params = { data: { ids: [@case1.id, @case2.id], record_type: 'case', date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/flags", params: params

      expect(response).to have_http_status(204)
      @case1.reload
      @case2.reload
      expect(@case1.flag_count).to eq(2)
      expect(@case2.flag_count).to eq(1)
    end

    it 'flagging tracing_request in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@tracing_request1.flag_count).to eq(1)
      expect(@tracing_request2.flag_count).to eq(0)

      params = { data: { ids: [@tracing_request1.id, @tracing_request2.id], record_type: 'tracing_request', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/tracing_requests/flags", params: params

      expect(response).to have_http_status(204)
      @tracing_request1.reload
      @tracing_request2.reload
      expect(@tracing_request1.flag_count).to eq(2)
      expect(@tracing_request2.flag_count).to eq(1)
    end

    it 'flagging incindet in bulk' do
      login_for_test(permissions: permission_flag_record)
      expect(@incident1.flag_count).to eq(1)
      expect(@incident2.flag_count).to eq(0)

      params = { data: { ids: [@incident1.id, @incident2.id], record_type: 'incident', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/incidents/flags", params: params

      expect(response).to have_http_status(204)
      @incident1.reload
      @incident2.reload
      expect(@incident1.flag_count).to eq(2)
      expect(@incident2.flag_count).to eq(1)
    end

    it "get a forbidden message if the user doesn't have flag permission" do
      login_for_test
      params = { data: { ids: [@case1.id, @case2.id], record_type: 'case', date: Date.today.to_s, message: 'This is another flag' } }
      post "/api/v2/cases/flags", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/flags")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it "get a 404 error if one of the ids on the requests isn't exists" do
      login_for_test(permissions: permission_flag_record)

      params = { data: { ids: [@incident1.id, '12345'], record_type: 'incident', date: Date.today.to_s, message: 'This is another flag TR' } }
      post "/api/v2/incidents/flags", params: params

      expect(response).to have_http_status(404)
      expect(json['errors'][0]['message']).to eq('Not Found')
    end
  end

  describe 'verification the ids' do
    it 'verifying the id of the cases' do
      login_for_test(permissions: permission_flag_record)
      get "/api/v2/cases/#{@case1.id}/flags"

      expect(request.path.split('/')[4]).to eq( @case1.id.to_s)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['record_id']).to eq( @case1.id.to_s)
    end

    it 'verifying the id of the flags' do
      login_for_test(permissions: permission_flag_record)
      params = { data: { unflag_message: 'This is unflag message' } }
      patch "/api/v2/cases/#{@case1.id}/flags/#{@case1.flags.first.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      @case1.reload
      expect(json['data']['id']).to eq(@case1.flags.first.id)
    end
  end

  after :each do
    clear_performed_jobs
    clear_enqueued_jobs
  end

end
