# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::TotalGBVSexualViolence do
  before do
    clean_data(Incident, UserGroup, User, Agency, Role)

    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::SELF,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::GROUP,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::AGENCY,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
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
      { incident_date: Date.new(2021, 8, 12), gbv_sexual_violence_type: 'rape' }
    ).save!
    Incident.new_with_user(
      @group_user,
      { incident_date: Date.new(2021, 9, 8), gbv_sexual_violence_type: 'sexual_assault' }
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

    expect(total_incidents).to eq([{ 'id' => 'gbv_sexual_violence_type', 'total' => 3 }])
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@self_user).data

      expect(total_incidents).to eq([{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }])
    end

    it 'returns group records for a group scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@group_user).data

      expect(total_incidents).to eq([{ 'id' => 'gbv_sexual_violence_type', 'total' => 2 }])
    end

    it 'returns agency records for an agency scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@agency_user).data

      expect(total_incidents).to eq([{ 'id' => 'gbv_sexual_violence_type', 'total' => 2 }])
    end

    it 'returns all records for an all scope' do
      total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build(@all_user).data

      expect(total_incidents).to eq([{ 'id' => 'gbv_sexual_violence_type', 'total' => 3 }])
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::TotalGBVSexualViolence.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-09-01',
              to: '2021-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 2020, data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }] },
            { group_id: 2021, data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 2 }] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::TotalGBVSexualViolence.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-09-01',
              to: '2021-09-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-09', data: [] },
            { group_id: '2020-10', data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }] },
            { group_id: '2020-11', data: [] }, { group_id: '2020-12', data: [] },
            { group_id: '2021-01', data: [] }, { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] }, { group_id: '2021-04', data: [] },
            { group_id: '2021-05', data: [] }, { group_id: '2021-06', data: [] },
            { group_id: '2021-07', data: [] },
            { group_id: '2021-08', data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }] },
            { group_id: '2021-09', data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::TotalGBVSexualViolence.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-09-01',
              to: '2021-09-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [] },
            { group_id: '2020-Q4', data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 1 }] },
            { group_id: '2021-Q1', data: [] }, { group_id: '2021-Q2', data: [] },
            { group_id: '2021-Q3', data: [{ 'id' => 'gbv_sexual_violence_type', 'total' => 2 }] }
          ]
        )
      end
    end
  end
end
