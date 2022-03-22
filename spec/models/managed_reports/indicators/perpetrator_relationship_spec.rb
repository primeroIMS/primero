# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorRelationship do
  before do
    clean_data(Incident, UserGroup, User, Agency, Role)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::VIOLATION_REPORT
        ]
      )
    ]
    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: permissions
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions: permissions
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions: permissions
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions: permissions
    )

    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
    agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2')

    group_a = UserGroup.create(unique_id: 'group-a', name: 'Group A')
    group_b = UserGroup.create(unique_id: 'group-b', name: 'Group B')

    @self_user = User.create!(
      full_name: 'Self User',
      user_name: 'self_user',
      email: 'self_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a],
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: agency_role
    )

    @all_user = User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      role: all_role
    )

    Incident.new_with_user(
      @self_user,
      alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship1', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship2', 'primary_perpetrator' => 'primary' }
      ]
    ).save!
    Incident.new_with_user(
      @group_user,
      alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship3', 'primary_perpetrator' => 'primary' }
      ]
    ).save!
    Incident.new_with_user(
      @agency_user,
      alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship2', 'primary_perpetrator' => 'primary' }
      ]
    ).save!
    Incident.new_with_user(
      @all_user,
      alleged_perpetrator:
      [
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' },
        { 'perpetrator_relationship' => 'relationship4', 'primary_perpetrator' => 'primary' }
      ]
    ).save!
  end

  it 'returns the number of incidents grouped by perpetrator_relationship' do
    data = ManagedReports::Indicators::PerpetratorRelationship.build.data

    expect(data).to match_array(
      [
        { 'id' => 'relationship1', 'total' => 1 },
        { 'id' => 'relationship2', 'total' => 2 },
        { 'id' => 'relationship3', 'total' => 1 },
        { 'id' => 'relationship4', 'total' => 3 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      data = ManagedReports::Indicators::PerpetratorRelationship.build(@self_user).data

      expect(data).to match_array(
        [
          { 'id' => 'relationship1', 'total' => 1 },
          { 'id' => 'relationship2', 'total' => 1 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      data = ManagedReports::Indicators::PerpetratorRelationship.build(@group_user).data

      expect(data).to match_array(
        [
          { 'id' => 'relationship2', 'total' => 1 },
          { 'id' => 'relationship3', 'total' => 1 },
          { 'id' => 'relationship4', 'total' => 3 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      data = ManagedReports::Indicators::PerpetratorRelationship.build(@agency_user).data

      expect(data).to match_array(
        [
          { 'id' => 'relationship2', 'total' => 1 },
          { 'id' => 'relationship3', 'total' => 1 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      data = ManagedReports::Indicators::PerpetratorRelationship.build(@all_user).data

      expect(data).to match_array(
        [
          { 'id' => 'relationship1', 'total' => 1 },
          { 'id' => 'relationship2', 'total' => 2 },
          { 'id' => 'relationship3', 'total' => 1 },
          { 'id' => 'relationship4', 'total' => 3 }
        ]
      )
    end
  end
end
