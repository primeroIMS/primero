# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::AlertsController, type: :request do
  include ActiveJob::TestHelper
  before :each do
    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::READ]
        )
      ]
    )
    agency = Agency.create!(name: 'Agency test 1', agency_code: 'agencytest1')
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: agency.id,
      role: role
    )
    @user_b = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12342078',
      password_confirmation: 'a12342078',
      email: 'test_user_2@localhost.com',
      agency_id: agency.id,
      role: role
    )
    @user_c = User.create!(
      full_name: 'Test User 3',
      user_name: 'test_user_3',
      password: 'a17845678',
      password_confirmation: 'a17845678',
      email: 'test_user_3@localhost.com',
      agency_id: agency.id,
      role: role
    )
    Child.create(
      name: 'bar',
      owned_by: @user_a.user_name,
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_a.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_a.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id)
      ]
    )
    @test_child = Child.create(
      name: 'foo',
      owned_by: @user_a.user_name,
      alerts: [
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_a.id),
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_a.id),
        Alert.create(type: 'new_form', alert_for: 'new_form', user_id: @user_b.id)
      ]
    )
    @test_incident = Incident.create!(
      data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1', owned_by: @user_a.user_name },
      alerts: [
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_a.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id),
        Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id)
      ]
    )
    @test_tracing_request = TracingRequest.create!(
      data: { inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1', owned_by: @user_b.user_name },
      alerts: [
        Alert.create(
          type: 'transfer_request',
          alert_for: 'transfer_request',
          user_id: @user_b.id,
          date: Date.new(2019, 3, 1)
        )
      ]
    )
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.select { |job| job.values.first == AuditLogJob }.first[:args].first }

  describe 'GET /api/v2/alerts' do
    it 'accept the request with the User a' do
      sign_in(@user_a)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(2)
      expect(json['data']['incident']).to eq(1)
      expect(json['data']['tracing_request']).to eq(0)
    end

    it 'accept the request with the User b' do
      sign_in(@user_b)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(0)
      expect(json['data']['incident']).to eq(0)
      expect(json['data']['tracing_request']).to eq(1)
    end

    it 'accept the request with the User c' do
      sign_in(@user_c)
      get '/api/v2/alerts'

      expect(response).to have_http_status(200)
      expect(json['data']['case']).to eq(0)
      expect(json['data']['incident']).to eq(0)
      expect(json['data']['tracing_request']).to eq(0)
    end
  end

  describe 'GET /api/v2/:record_type/:id/alerts' do
    it 'lists of all alerts from a child' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ]
          )
        ]
      )
      get "/api/v2/cases/#{@test_child.id}/alerts"

      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(3)

      expect(audit_params['action']).to eq('show_alerts')
    end

    it 'lists of all alerts from a incident' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::INCIDENT,
            actions: [Permission::READ]
          )
        ]
      )
      get "/api/v2/incidents/#{@test_incident.id}/alerts"
      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(3)

      expect(audit_params['action']).to eq('show_alerts')
    end

    it 'lists of all alerts from a tracing_request' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::TRACING_REQUEST,
            actions: [Permission::READ]
          )
        ]
      )
      get "/api/v2/tracing_requests/#{@test_tracing_request.id}/alerts"

      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(1)
      expect(json['data'][0]['date']).to eq('2019-03-01')

      expect(audit_params['action']).to eq('show_alerts')
    end

    it 'get a forbidden message if the user does not have read permission' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::TRACING_REQUEST,
            actions: []
          )
        ]
      )
      get "/api/v2/tracing_requests/#{@test_tracing_request.id}/alerts"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/tracing_requests/#{@test_tracing_request.id}/alerts")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a list with a non-existant record id' do
      login_for_test(permissions: [])
      get '/api/v2/tracing_requests/thisdoesntexist/alerts'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/tracing_requests/thisdoesntexist/alerts')
    end
  end

  after :each do
    clear_enqueued_jobs
    clean_data(User, Alert, Child, Incident, TracingRequest, Role, Agency)
  end
end
