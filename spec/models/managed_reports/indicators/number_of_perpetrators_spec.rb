# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::NumberOfPerpetrators do
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

    Incident.new_with_user(@self_user, alleged_perpetrator:
      [
        { unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea10' },
        { unique_id: '11cfd918-3c69-4baa-b1cc-6c9a1cd9ea11' }
      ]).save!
    Incident.new_with_user(
      @group_user,
      alleged_perpetrator: [{ unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' }]
    ).save!
    Incident.new_with_user(
      @agency_user,
      alleged_perpetrator: [{ unique_id: '10cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' }]
    ).save!
    Incident.new_with_user(
      @all_user,
      alleged_perpetrator: [
        { unique_id: '11cfd918-3c69-4baa-b1cc-6c9a1cd9ea31' },
        { unique_id: '12cfd918-3c69-4baa-b1cc-6c9a1cd9ea15' },
        { unique_id: '13cfd918-3c69-4baa-b1cc-6c9a1cd9ea15' }
      ]
    ).save!
  end

  it 'returns the number of incidents grouped by number of perpetrators' do
    data = ManagedReports::Indicators::NumberOfPerpetrators.build.data

    expect(data).to match_array(
      [
        { 'id' => 'equal_to_1', 'total' => 2 },
        { 'id' => 'equal_to_2', 'total' => 1 },
        { 'id' => 'equal_to_3', 'total' => 1 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      data = ManagedReports::Indicators::NumberOfPerpetrators.build(@self_user).data

      expect(data).to match_array(
        [
          { 'id' => 'equal_to_2', 'total' => 1 },
        ]
      )
    end

    it 'returns group records for a group scope' do
      data = ManagedReports::Indicators::NumberOfPerpetrators.build(@group_user).data

      expect(data).to match_array(
        [
          { 'id' => 'equal_to_1', 'total' => 2 },
          { 'id' => 'equal_to_3', 'total' => 1 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      data = ManagedReports::Indicators::NumberOfPerpetrators.build(@agency_user).data

      expect(data).to match_array(
        [
          { 'id' => 'equal_to_1', 'total' => 2 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      data = ManagedReports::Indicators::NumberOfPerpetrators.build(@all_user).data

      expect(data).to match_array(
        [
          { 'id' => 'equal_to_1', 'total' => 2 },
          { 'id' => 'equal_to_2', 'total' => 1 },
          { 'id' => 'equal_to_3', 'total' => 1 }
        ]
      )
    end
  end
end
