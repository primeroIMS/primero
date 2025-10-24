# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe AccessLoggable do
  before do
    clean_data(AuditLog, Child, UserGroup, User, Role, FormSection, Field, PrimeroModule, PrimeroProgram, Agency)
  end

  let!(:primero_module) { create :primero_module }

  let(:role_cp) do
    create(:role, is_manager: true, primero_modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:role_mgr) do
    create(:role, is_manager: false, primero_modules: [primero_module], group_permission: Permission::SELF)
  end

  let(:case_worker) do
    create(:user, user_name: 'user', role: role_cp, full_name: 'Test User 1', email: 'owner@primero.dev')
  end

  let(:case_worker2) do
    create(:user, user_name: 'user2', role: role_cp, full_name: 'Test User 2', email: 'user2@primero.dev')
  end

  let!(:mgr) do
    create(:user, user_name: 'mgr', role: role_mgr, full_name: 'Test mgr', email: 'mgr@primero.dev')
  end

  let!(:child1) do
    Child.create!(
      data: {
        status: 'open', age: 2, sex: 'female', module_id: primero_module.unique_id,
        owned_by: case_worker.user_name
      }
    )
  end

  let!(:audit_log1) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: case_worker2.id,
      action: 'update',
      resource_url: '',
      timestamp: 2.days.ago
    )
  end

  let!(:audit_log2) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: case_worker2.id,
      action: 'show',
      resource_url: '',
      timestamp: 3.days.ago
    )
  end

  let!(:audit_log3) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: case_worker2.id,
      action: 'show',
      resource_url: '',
      timestamp: 15.days.ago
    )
  end

  let!(:audit_log4) do
    AuditLog.create!(
      record_type: 'Child',
      record_id: child1.id,
      user_id: mgr.id,
      action: 'show',
      resource_url: '',
      timestamp: 2.days.ago
    )
  end

  describe '#access_log_filtered' do
    it 'returns logs per date range' do
      date_range = 5.days.ago..1.days.ago
      logs = child1.access_log_filtered(date_range:)
      expect(logs).to contain_exactly(audit_log1, audit_log2, audit_log4)
    end
    it 'returns logs per user' do
      date_range = 5.days.ago..1.days.ago
      logs = child1.access_log_filtered(date_range:, access_users: mgr.id)
      expect(logs).to contain_exactly(audit_log4)
    end

    it 'returns no logs if outside of date range' do
      date_range = 30.days.ago..1.days.ago
      logs = child1.access_log_filtered(date_range:, actions: %w[update])
      expect(logs).to contain_exactly(audit_log1)
    end
  end
end
