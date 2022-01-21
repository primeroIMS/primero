# frozen_string_literal: true

require 'rails_helper'

describe AuditLog do
  before(:each) { clean_data(Agency, AuditLog, Role, User) }

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
        role: role,
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
end
