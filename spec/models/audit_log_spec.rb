# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe AuditLog do
  before(:each) { clean_data(AuditLog, User, Role, Agency, Child) }

  describe '.display_id' do
    let(:role) do
      Role.create!(
        name: 'Test Role 1',
        unique_id: 'test-role-1',
        permissions: [
          Permission.new(
            resource: Permission::AUDIT_LOG,
            actions: [Permission::READ]
          )
        ]
      )
    end
    let(:agency) do
      Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    end
    let(:user) do
      User.create!(
        id: 1,
        full_name: 'Test User 2',
        user_name: 'test_user_2',
        password: 'b12345678',
        password_confirmation: 'b12345678',
        email: 'test_user_2@localhost.com',
        role:,
        agency_id: agency.id
      )
    end
    let(:audit_log) do
      AuditLog.create!(record_type: user.class, record_id: user.id, user_id: 1, action: 'login', resource_url: '')
    end

    let(:audit_log_managed_report) do
      AuditLog.create!(
        record_type: ManagedReport,
        record_id: 'violations_report',
        user_id: 1,
        action: 'view',
        resource_url: ''
      )
    end

    it 'return display_id when record is present' do
      expect(audit_log.display_id).to eq(user.id)
    end

    it 'return empty when record_type is ManagedReport' do
      expect(audit_log_managed_report.display_id).to be_empty
    end
  end

  describe '.enrich_audit_logs' do
    let!(:user_group) { UserGroup.create!(name: 'Primero CP') }
    let!(:child) do
      Child.create!(
        data: { case_id_display: 'abc123', name: 'Test1', age: 5, sex: 'male' }
      )
    end

    let!(:incident) do
      Incident.create!(
        data: { short_id: '123xyz', name: 'Test1', age: 5, sex: 'male' }
      )
    end

    let(:usergroup_log) do
      AuditLog.new(record_type: 'UserGroup', record_id: user_group.id)
    end

    let(:child_log) do
      AuditLog.new(record_type: 'Child', record_id: child.id)
    end

    let(:incident_log) do
      AuditLog.new(record_type: 'Incident', record_id: incident.id)
    end

    let(:audit_logs) { [usergroup_log, child_log, incident_log] }

    it 'returns enriched data for supported models' do
      result = AuditLog.enrich_audit_logs(audit_logs)

      expect(result.map(&:record_type)).to match_array(%w[UserGroup Child Incident])
      expect(result.map(&:display_name)).to match_array(['Primero CP', 'abc123', '123xyz'])
    end
  end

  describe '.statistic_message' do
    before(:each) do
      clean_data(AuditLog)
    end
    let(:audit_log) do
      AuditLog.create!(
        record_type: Child,
        record_id: '12345',
        user_id: 1,
        action: 'view',
        resource_url: '',
        metadata: {
          "role_id": 1,
          "agency_id": 1,
          "remote_ip": '127.0.0.1',
          "user_name": 'random_user'
        }
      )
    end

    it 'return a metadata values' do
      expect(audit_log.metadata['role_id']).to eq(1)
      expect(audit_log.metadata['agency_id']).to eq(1)
      expect(audit_log.metadata['remote_ip']).to eq('127.0.0.1')
      expect(audit_log.metadata['user_name']).to eq('random_user')
    end
  end
end
