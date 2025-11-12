# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe UsageReport do
  let(:primero_program) do
    PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero', name: 'Primero', description: 'Default Primero Program'
    )
  end

  let(:primero_module_cp) do
    PrimeroModule.create!(
      unique_id: PrimeroModule::CP,
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program:,
      form_sections: []
    )
  end

  let(:agency) do
    Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
  end

  let(:role_manager) do
    Role.create!(
      name: 'Role Manager', unique_id: 'role_manager', is_manager: true, modules: [primero_module_cp],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
  end

  let(:role_worker) do
    Role.create!(
      name: 'Role Worker', unique_id: 'role_worker', is_manager: false, modules: [primero_module_cp],
      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])]
    )
  end

  let(:role_usage_report) do
    Role.create!(
      name: 'Usage Report Role', unique_id: 'usage_report_role', is_manager: false, modules: [primero_module_cp],
      permissions: [
        Permission.new(
          managed_report_scope: Permission::ALL,
          resource: Permission::MANAGED_REPORT,
          actions: [Permission::DISTRIBUTION_USERS_ROLE_REPORT]
        )
      ]
    )
  end

  let(:user_group_a) { build(:user_group, unique_id: 'user_group_a') }

  let(:user_group_b) { build(:user_group, unique_id: 'user_group_b') }

  let(:usage_report_user) do
    User.create!(
      full_name: 'Usage Report User', user_name: 'usage_report_user', password: 'b12345678',
      password_confirmation: 'b12345678', email: 'usage_report_user@localhost.com',
      agency_id: agency.id, role: role_usage_report
    )
  end

  let(:user_a) do
    User.create!(
      full_name: 'User A', user_name: 'user_a', password: 'b12345678', password_confirmation: 'b12345678',
      email: 'user_a@localhost.com', agency_id: agency.id, role: role_manager, user_groups: [user_group_a, user_group_b]
    )
  end

  let(:user_b) do
    User.create!(
      full_name: 'User B', user_name: 'user_b', password: 'b12345678', password_confirmation: 'b12345678',
      email: 'user_b@localhost.com', agency_id: agency.id, role: role_worker, user_groups: [user_group_a]
    )
  end

  let(:user_c) do
    User.create!(
      full_name: 'User C', user_name: 'user_c', password: 'b12345678', password_confirmation: 'b12345678',
      email: 'user_c@localhost.com', agency_id: agency.id, role: role_worker, disabled: true,
      user_groups: [user_group_b]
    )
  end

  before do
    clean_data(User, Agency, Role, UserGroup, PrimeroModule, PrimeroProgram)
    usage_report_user
    user_a
    user_b
    user_c
  end

  describe 'build_users_by_role' do
    it 'returns the enabled users by role' do
      users_by_role = UsageReport.new.build_users_by_role(usage_report_user, { disabled: false })
      expect(users_by_role).to eq(
        {
          'user_group_a' => { 'role_worker' => 1, 'role_manager' => 1, 'total' => 2 },
          'user_group_b' => { 'role_manager' => 1, 'total' => 1 },
          'overall' => { 'role_worker' => 1, 'role_manager' => 2, 'total' => 3 }
        }
      )
    end

    it 'returns the disabled users by role' do
      users_by_role = UsageReport.new.build_users_by_role(usage_report_user, { disabled: true })
      expect(users_by_role).to eq(
        {
          'user_group_b' => { 'role_worker' => 1, 'total' => 1 },
          'overall' => { 'role_worker' => 1, 'total' => 1 }
        }
      )
    end
  end
end
