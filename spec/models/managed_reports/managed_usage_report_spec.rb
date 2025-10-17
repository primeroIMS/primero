# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::ManagedUsageReport do
  before :each do
    clean_data(User, Agency, Role, FormSection, PrimeroModule, PrimeroProgram, UserGroup)

    role_a = create(:role, unique_id: 'role-a', permissions: [Permission.new(resource: Permission::USER, actions: [Permission::READ])])
    role_b = create(:role, unique_id: 'role-b', permissions: [Permission.new(resource: Permission::USER, actions: [Permission::READ])])
    group_a = create(:user_group, unique_id: 'user-group-a', name: 'UserGroup A')
    group_b = create(:user_group, unique_id: 'user-group-b', name: 'UserGroup B')

    create(:user, role_id: role_a.id, user_group_ids: [group_a.id, group_b.id])
    create(:user, role_id: role_a.id, user_group_ids: [group_b.id])
    create(:user, role_id: role_a.id, user_group_ids: [group_b.id])
    create(:user, role_id: role_b.id, user_group_ids: [group_a.id])
  end
  it 'builds the data for the report' do
    managed_usage_report = ManagedReports::ManagedUsageReport.new.tap { |report| report.build_report(nil) }

    expect(
      managed_usage_report.data['distribution_users_role'][:data][:distribution_users_role]
    ).to match_array(
      [
        { 'id' => 'user-group-a', 'role-a' => 1, 'role-b' => 1, 'total' => 2 },
        { 'id' => 'user-group-b', 'role-a' => 3, 'total' => 3 },
        { 'id' => 'overall', 'role-a' => 4, 'role-b' => 1, 'total' => 5 }
      ]
    )
  end
end
