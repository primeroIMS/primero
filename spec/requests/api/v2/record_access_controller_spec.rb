# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::RecordHistoriesController, type: :request do
  before :each do
    clean_data(User, Role, Agency, Incident, Child, AuditLog)
  end

  let!(:agency_a) do
    Agency.create!(
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
  end

  let!(:role) do
    Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )
  end

  let!(:user_a) do
    User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: agency_a.id,
      role:
    )
  end

  let!(:user_login) do
    User.create!(
      full_name: 'User login',
      user_name: 'user_login',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'user_login@localhost.com',
      agency_id: agency_a.id,
      role:
    )
  end

  let!(:child1) do
    Child.create!(
      data: {
        status: 'open', age: 2, sex: 'female',
        owned_by: user_a.user_name
      }
    )
  end

  let!(:incident) do
    Incident.create!(
      data: {
        incident_date: '2019-02-01', description: 'Tester',
        owned_by: user_a.user_name
      }
    )
  end

  let!(:audit_log1) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: user_a.id,
      action: 'update',
      resource_url: '',
      timestamp: 2.days.ago
    )
  end

  let!(:audit_log2) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: user_a.id,
      action: 'show',
      resource_url: '',
      timestamp: 3.days.ago
    )
  end

  let!(:audit_log3) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: user_a.id,
      action: 'show',
      resource_url: '',
      timestamp: 15.days.ago
    )
  end

  let!(:audit_log4) do
    AuditLog.create!(
      record_type: 'Incident',
      record_id: incident.id,
      user_id: user_a.id,
      action: 'update',
      resource_url: '',
      timestamp: 2.days.ago
    )
  end

  let!(:audit_log5) do
    AuditLog.create!(
      record_type: 'Incident',
      record_id: incident.id,
      user_id: user_a.id,
      action: 'update',
      resource_url: '',
      timestamp: 2.days.ago
    )
  end

  let!(:audit_log6) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: user_login.id,
      action: 'show',
      resource_url: '',
      timestamp: 1.days.ago
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/:record_type/:record_id/' do
    it 'list access_log from an incident' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::ACCESS_LOG])
        ]
      )

      get "/api/v2/incidents/#{Incident.first.id}/access_log"

      expect(json['data'].map { |data| data['id'] }).to match_array([audit_log4.id, audit_log5.id])
    end

    it 'list access_log from a child' do
      login_for_test(
        user_name: 'user_login',
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::ACCESS_LOG])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/access_log"

      expect(json['data'].map { |data| data['id'] }).to match_array(
        [audit_log1.id, audit_log2.id, audit_log3.id, audit_log6.id]
      )
    end

    describe 'when filter is present' do
      it 'list access_log from a child filtered by access_users' do
        login_for_test(
          user_name: 'user_login',
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::ACCESS_LOG])
          ]
        )

        get "/api/v2/cases/#{Child.first.id}/access_log?filters[access_users][0]=#{user_login.id}"

        expect(json['data'].map { |data| data['id'] }).to match_array(
          [audit_log6.id]
        )
      end
      it 'list access_log from a child filtered by timestamp' do
        login_for_test(
          user_name: 'user_login',
          permissions: [
            Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::ACCESS_LOG])
          ]
        )

        get "/api/v2/cases/#{Child.first.id}/access_log?" \
            "filters[timestamp][from]=#{2.days.ago.in_time_zone.beginning_of_day}&" \
            "filters[timestamp][to]=#{Time.zone.now}"

        expect(json['data'].map { |data| data['id'] }).to match_array(
          [audit_log1.id, audit_log6.id]
        )
      end
    end

    it 'returns 403 if user only have read permission' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/access_log"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{Child.first.id}/access_log")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns 403 if user only have audit_log permission' do
      login_for_test
      params = { data: { name: 'Test', age: 12, sex: 'female' } }
      post '/api/v2/cases', params:, as: :json

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::CHANGE_LOG])
        ]
      )

      get "/api/v2/cases/#{Child.first.id}/access_log"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{Child.first.id}/access_log")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  after :each do
    clean_data(User, Role, Agency, Child, Incident, AuditLog)
  end
end
