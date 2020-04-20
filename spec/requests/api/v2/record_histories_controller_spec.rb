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
      login_for_test
      params = { data: { inquiry_date: '2019-04-01', relation_name: 'Test' } }
      post '/api/v2/tracing_requests', params: params

      sleep(1)

      login_for_test
      params = { data: { inquiry_date: '2019-02-01', relation_name: 'Tester' } }
      patch "/api/v2/tracing_requests/#{TracingRequest.first.id}", params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ, Permission::AUDIT_LOG])
        ]
      )

      record_history_a = {
        record_id: TracingRequest.first.id,
        record_type: 'TracingRequest',
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
        record_type: 'TracingRequest',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest', action: 'create', record_changes: []
      }

      get "/api/v2/tracing_requests/#{TracingRequest.first.id}/record_history"

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'list record_history from an incident' do
      login_for_test
      params = { data: { incident_date: '2019-04-01', description: 'Test' } }
      post '/api/v2/incidents', params: params

      sleep(1)

      login_for_test
      params = { data: { incident_date: '2019-02-01', description: 'Tester' } }
      patch "/api/v2/incidents/#{Incident.first.id}", params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::AUDIT_LOG])
        ]
      )

      get "/api/v2/incidents/#{Incident.first.id}/record_history"

      record_history_a = {
        record_id: Incident.first.id,
        record_type: 'Incident',
        datetime: RecordHistory.last.datetime.iso8601,
        user_name: 'faketest',
        action: 'update',
        record_changes: [
          { description: { from: 'Test', to: 'Tester' } },
          { incident_date: { from: '2019-04-01', to: '2019-02-01' } }
        ]
      }

      record_history_b = {
        record_id: Incident.first.id,
        record_type: 'Incident',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest',
        action: 'create', record_changes: []
      }

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'list record_history from a child' do
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params: params

      sleep(1)

      login_for_test
      params = { data: { name: 'Tester', age: 10, sex: 'male' } }
      patch "/api/v2/cases/#{Child.first.id}", params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::AUDIT_LOG])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/record_history"

      record_history_a = {
        record_id: Child.first.id,
        record_type: 'Child',
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
        record_type: 'Child',
        datetime: RecordHistory.first.datetime.iso8601,
        user_name: 'faketest',
        action: 'create',
        record_changes: []
      }

      expect(json['data'][0]).to eq(record_history_a.deep_stringify_keys)
      expect(json['data'][1]).to eq(record_history_b.deep_stringify_keys)
    end

    it 'returns 403 if user only have read permission' do
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params: params

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
      post '/api/v2/cases', params: params

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::AUDIT_LOG])
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
