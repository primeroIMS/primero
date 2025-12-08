# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe AuditLog do
  before(:each) do
    clean_data(AuditLog, User, UserGroup, Role, Agency, FormSection, PrimeroModule, PrimeroProgram, Child)
  end

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

  describe '.last_login' do
    let!(:role_standard) { create(:role, user_category: nil) }
    let!(:role_non_standard) { create(:role, user_category: Role::CATEGORY_MAINTENANCE) }

    let!(:user_with_standard_role)     { create(:user, role: role_standard) }
    let!(:user_with_non_standard_role) { create(:user, role: role_non_standard) }

    let(:other_action) { 'OTHER_ACTION' }

    let!(:old_login_standard) do
      AuditLog.create!(
        record_type: 'User',
        record_id: user_with_standard_role.id,
        user: user_with_standard_role,
        action: AuditLog::LOGIN,
        timestamp: 2.days.ago
      )
    end

    let!(:newer_login_standard) do
      AuditLog.create!(
        record_type: 'User',
        record_id: user_with_standard_role.id,
        user: user_with_standard_role,
        action: AuditLog::LOGIN,
        timestamp: 1.day.ago
      )
    end

    let!(:login_non_standard_role) do
      AuditLog.create!(
        record_type: 'User',
        record_id: user_with_non_standard_role.id,
        user: user_with_non_standard_role,
        action: AuditLog::LOGIN,
        timestamp: Time.current
      )
    end

    let!(:non_login_action) do
      AuditLog.create!(
        record_type: 'User',
        record_id: user_with_standard_role.id,
        user: user_with_standard_role,
        action: AuditLog::FAILED_LOGIN,
        timestamp: Time.current
      )
    end

    it 'returns the most recent login audit log for users with a nil user_category role' do
      result = described_class.last_login

      expect(result).to eq(newer_login_standard)
    end

    it 'ignores audit logs with actions other than LOGIN' do
      result = described_class.last_login

      expect(result).not_to eq(non_login_action)
    end

    it 'ignores login logs for users whose role has a non-nil user_category' do
      result = described_class.last_login

      expect(result).not_to eq(login_non_standard_role)
    end

    it 'returns nil when there are no matching login logs' do
      AuditLog.delete_all

      expect(described_class.last_login).to be_nil
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
          role_id: 1,
          agency_id: 1,
          remote_ip: '127.0.0.1',
          user_name: 'random_user'
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
