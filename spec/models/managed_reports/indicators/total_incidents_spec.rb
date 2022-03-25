require 'rails_helper'

describe ManagedReports::Indicators::TotalIncidents do
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
      incident_date: Date.new(2020, 8, 12), date_of_first_report: Date.new(2020, 8, 10)
    ).save!
    Incident.new_with_user(
      @group_user,
      incident_date: Date.new(2020, 9, 8), date_of_first_report: Date.new(2020, 9, 8)
    ).save!
    Incident.new_with_user(
      @agency_user,
      incident_date: Date.new(2020, 10, 10), date_of_first_report: Date.new(2020, 10, 5)
    ).save!
    Incident.new_with_user(
      @all_user,
      incident_date: Date.new(2020, 10, 10), date_of_first_report: Date.new(2020, 10, 8)
    ).save!
  end

  it 'returns the total number of incidents' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build.data

    expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 4 }])
  end

  it 'returns the total number of incidents for the incident_date range' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build(
      nil,
      {
        'incident_date' => SearchFilters::DateRange.new(
          field_name: 'incident_date',
          from: '2020-08-01',
          to: '2020-09-30'
        )
      }
    ).data

    expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 2 }])
  end

  it 'returns the total number of incidents for the date_of_first_report range' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build(
      nil,
      {
        'date_of_first_report' => SearchFilters::DateRange.new(
          field_name: 'date_of_first_report',
          from: '2020-09-01',
          to: '2020-10-10'
        )
      }
    ).data

    expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 3 }])
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      total_incidents = ManagedReports::Indicators::TotalIncidents.build(@self_user).data

      expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 1 }])
    end

    it 'returns group records for a group scope' do
      total_incidents = ManagedReports::Indicators::TotalIncidents.build(@group_user).data

      expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 3 }])
    end

    it 'returns agency records for an agency scope' do
      total_incidents = ManagedReports::Indicators::TotalIncidents.build(@agency_user).data

      expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 2 }])
    end

    it 'returns all records for an all scope' do
      total_incidents = ManagedReports::Indicators::TotalIncidents.build(@all_user).data

      expect(total_incidents).to eq([{ 'id' => 'incidents', 'total' => 4 }])
    end
  end
end
