require 'rails_helper'

describe ManagedReports::Indicators::TotalGBVSexualViolence do
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
      { incident_date: Date.new(2020, 8, 12), gbv_sexual_violence_type: 'rape' }
    ).save!
    Incident.new_with_user(
      @group_user,
      { incident_date: Date.new(2020, 9, 8), gbv_sexual_violence_type: 'sexual_assault' }
    ).save!
    Incident.new_with_user(
      @agency_user,
      { incident_date: Date.new(2020, 10, 10), gbv_sexual_violence_type: 'forced_marriage' }
    ).save!
    Incident.new_with_user(
      @all_user,
      { incident_date: Date.new(2020, 10, 10), gbv_sexual_violence_type: 'non-gbv' }
    ).save!
    Incident.new_with_user(
      @all_user,
      { incident_date: Date.new(2020, 10, 10) }
    ).save!
  end

  it 'returns the total number of incidents with a gbv_sexual_violence_type' do
    total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build.data

    expect(total_incidents).to eq(3)
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@self_user).data

      expect(total_incidents).to eq(1)
    end

    it 'returns group records for a group scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@group_user).data

      expect(total_incidents).to eq(2)
    end

    it 'returns agency records for an agency scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@agency_user).data

      expect(total_incidents).to eq(2)
    end

    it 'returns all records for an all scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@all_user).data

      expect(total_incidents).to eq(3)
    end
  end
end
