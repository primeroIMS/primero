# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::RecordHistoriesController, type: :request do
  before :each do
    clean_data(Role, User, Agency, Child, TracingRequest, Incident, RecordHistory)

    agency_a = Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      services: %w[services_a services_b],
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: agency_a.id,
      role: role
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/:record_type/:record_id/record_history' do
    it 'list record_history from a tracing_requests' do
      TracingRequest.any_instance.stub(:associated_users).and_return([User.new(user_name: 'faketest')])
      login_for_test
      params = { data: { inquiry_date: '2019-04-01', relation_name: 'Test' } }
      post '/api/v2/tracing_requests', params: params

      sleep(1)

      login_for_test
      params = { data: { inquiry_date: '2019-02-01', relation_name: 'Tester' } }
      patch "/api/v2/tracing_requests/#{TracingRequest.first.id}", params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ, Permission::CHANGE_LOG])
        ]
      )

      record_history_a = {
        record_id: TracingRequest.first.id,
        record_type: 'tracing_requests',
        datetime: RecordHistory.last.datetime.iso8601,
        user_name: 'faketest',
        action: 'update',
        record_changes: [
          { inquiry_date: { to: '2019-02-01', from: '2019-04-01' } },
          { relation_name: { to: 'Tester', from: 'Test' } }
        ]
      }

      record_history_b = {
        record_id: TracingRequest.first.id,
        record_type: 'tracing_requests',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest', action: 'create',
        record_changes: [
          { 'status' => { 'from' => nil, 'to' => 'open' } },
          { 'owned_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'short_id' => { 'from' => nil, 'to' => TracingRequest.first.short_id } },
          { 'posted_at' => { 'from' => nil, 'to' => TracingRequest.first.posted_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_at' => { 'from' => nil, 'to' => TracingRequest.first.created_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'inquiry_date' => { 'from' => nil, 'to' => '2019-04-01' } },
          { 'record_state' => { 'from' => nil, 'to' => true } },
          { 'relation_name' => { 'from' => nil, 'to' => 'Test' } },
          { 'owned_by_groups' => { 'from' => nil, 'to' => [] } },
          { 'unique_identifier' => { 'from' => nil, 'to' => TracingRequest.first.unique_identifier } },
          { 'tracing_request_id' => { 'from' => nil, 'to' => TracingRequest.first.tracing_request_id } },
          { 'associated_user_names' => { 'from' => nil, 'to' => ['faketest'] } },
          { 'associated_user_groups' => { 'from' => nil, 'to' => [] } },
          { 'associated_user_agencies' => { 'from' => nil, 'to' => [] } }
        ]
      }

      get "/api/v2/tracing_requests/#{TracingRequest.first.id}/record_history"

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'list record_history from an incident' do
      Incident.any_instance.stub(:associated_users).and_return([User.new(user_name: 'faketest')])
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Test' } }
      post '/api/v2/incidents', params: params

      sleep(1)

      login_for_test
      params = { data: { incident_date: '2019-02-01', description: 'Tester' } }
      patch "/api/v2/incidents/#{Incident.first.id}", params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::CHANGE_LOG])
        ]
      )

      get "/api/v2/incidents/#{Incident.first.id}/record_history"

      record_history_a = {
        record_id: Incident.first.id,
        record_type: 'incidents',
        datetime: RecordHistory.last.datetime.iso8601,
        user_name: 'faketest',
        action: 'update',
        record_changes: [
          { unique_id: { from: nil, to: Incident.first.id } },
          { description: { from: 'Test', to: 'Tester' } },
          { incident_date: { from: '2019-04-01', to: '2019-02-01' } }
        ]
      }

      record_history_b = {
        record_id: Incident.first.id,
        record_type: 'incidents',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest',
        action: 'create',
        record_changes: [
          { 'status' => { 'from' => nil, 'to' => 'open' } },
          { 'owned_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'short_id' => { 'from' => nil, 'to' => Incident.first.short_id } },
          { 'posted_at' => { 'from' => nil, 'to' => Incident.first.posted_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_at' => { 'from' => nil, 'to' => Incident.first.created_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'description' => { 'from' => nil, 'to' => 'Test' } },
          { 'incident_id' => { 'from' => nil, 'to' => Incident.first.incident_id } },
          { 'record_state' => { 'from' => nil, 'to' => true } },
          { 'incident_code' => { 'from' => nil, 'to' => Incident.first.incident_code } },
          { 'incident_date' => { 'from' => nil, 'to' => '2019-04-01' } },
          { 'owned_by_groups' => { 'from' => nil, 'to' => [] } },
          { 'unique_identifier' => { 'from' => nil, 'to' => Incident.first.incident_id } },
          { 'date_of_first_report' => { 'from' => nil, 'to' => Incident.first.date_of_first_report.iso8601 } },
          { 'associated_user_names' => { 'from' => nil, 'to' => ['faketest'] } },
          { 'associated_user_groups' => { 'from' => nil, 'to' => [] } },
          { 'associated_user_agencies' => { 'from' => nil, 'to' => [] } }
        ]
      }

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'list record_history from a child' do
      Child.any_instance.stub(:associated_users).and_return([User.new(user_name: 'faketest')])
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params: params, as: :json

      sleep(1)

      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'male' } }
      patch "/api/v2/cases/#{Child.first.id}", params: params, as: :json

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::CHANGE_LOG])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/record_history"

      record_history_a = {
        record_id: Child.first.id,
        record_type: 'cases',
        datetime: RecordHistory.last.datetime.iso8601,
        user_name: 'faketest',
        action: 'update',
        record_changes: [
          { age: { to: 10, from: 12 } },
          { sex: { to: 'male', from: 'female' } },
          { name: { to: 'Tester', from: 'Test' } }
        ]
      }

      record_history_b = {
        record_id: Child.first.id,
        record_type: 'cases',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest',
        action: 'create',
        record_changes: [
          { 'age' => { 'from' => nil, 'to' => 12 } },
          { 'sex' => { 'from' => nil, 'to' => 'female' } },
          { 'name' => { 'from' => nil, 'to' => 'Test' } },
          { 'status' => { 'from' => nil, 'to' => 'open' } },
          { 'case_id' => { 'from' => nil, 'to' => Child.first.case_id } },
          { 'owned_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'short_id' => { 'from' => nil, 'to' => Child.first.short_id } },
          { 'workflow' => { 'from' => nil, 'to' => 'new' } },
          { 'posted_at' => { 'from' => nil, 'to' => Child.first.posted_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_at' => { 'from' => nil, 'to' => Child.first.created_at.strftime('%Y-%m-%dT%H:%M:%S.%LZ') } },
          { 'created_by' => { 'from' => nil, 'to' => 'faketest' } },
          { 'record_state' => { 'from' => nil, 'to' => true } },
          { 'notes_section' => { 'from' => nil, 'to' => [] } },
          { 'reopened_logs' => { 'from' => nil, 'to' => [] } },
          { 'case_id_display' => { 'from' => nil, 'to' => Child.first.case_id_display } },
          { 'owned_by_groups' => { 'from' => nil, 'to' => [] } },
          { 'registration_date' => { 'from' => nil, 'to' => Child.first.registration_date.iso8601 } },
          { 'unique_identifier' => { 'from' => nil, 'to' => Child.first.unique_identifier } },
          { 'protection_concerns' => { 'from' => nil, 'to' => [] } },
          { 'associated_user_names' => { 'from' => nil, 'to' => ['faketest'] } },
          { 'associated_user_groups' => { 'from' => nil, 'to' => [] } },
          { 'associated_user_agencies' => { 'from' => nil, 'to' => [] } }
        ]
      }

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'returns 403 if user only have read permission' do
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params: params, as: :json

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/record_history"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{Child.first.id}/record_history")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns 403 if user only have audit_log permission' do
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params: params, as: :json

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::CHANGE_LOG])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/record_history"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{Child.first.id}/record_history")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  after :each do
    clean_data(Role, User, Agency, Child, TracingRequest, Incident, RecordHistory)
  end
end
