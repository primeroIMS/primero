# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::SurvivorsSex do
  let(:self_role) do
    Role.create!(
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
  end

  let(:group_role) do
    Role.create!(
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
  end

  let(:agency_role) do
    Role.create!(
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
  end

  let(:all_role) do
    Role.create!(
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
  end

  let(:agency_a) { Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1') }
  let(:agency_b) { Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2') }
  let(:group_a) { UserGroup.create(unique_id: 'group-a', name: 'Group A') }
  let(:group_b) { UserGroup.create(unique_id: 'group-b', name: 'Group B') }

  let(:self_user) do
    User.create!(
      full_name: 'Self User',
      user_name: 'self_user',
      email: 'self_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a],
      role: self_role
    )
  end

  let(:group_user) do
    User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: group_role
    )
  end

  let(:agency_user) do
    User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: agency_role
    )
  end

  let(:all_user) do
    User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      role: all_role
    )
  end

  before do
    clean_data(Incident, UserGroup, User, Agency, Role)

    Incident.new_with_user(
      self_user, { sex: 'male', incident_date: Date.new(2020, 8, 12), consent_reporting: 'true' }
    ).save!
    Incident.new_with_user(
      group_user, { sex: 'female', incident_date: Date.new(2020, 9, 12), consent_reporting: 'true' }
    ).save!
    Incident.new_with_user(
      agency_user, { sex: 'male', incident_date: Date.new(2021, 1, 12), consent_reporting: 'true' }
    ).save!
    Incident.new_with_user(
      all_user, { sex: 'female', incident_date: Date.new(2021, 2, 12), consent_reporting: 'true' }
    ).save!
    Incident.new_with_user(
      all_user, { sex: 'female', incident_date: Date.new(2021, 3, 12), consent_reporting: 'true' }
    ).save!
  end

  it 'returns data for the survivors sex indicator' do
    survivor_sex_data = ManagedReports::Indicators::SurvivorsSex.build(nil, {}).data

    expect(survivor_sex_data).to match_array(
      [
        { 'id' => 'male', 'total' => 2 },
        { 'id' => 'female', 'total' => 3 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      survivor_sex_data = ManagedReports::Indicators::SurvivorsSex.build(self_user, {}).data

      expect(survivor_sex_data).to match_array([{ 'id' => 'male', 'total' => 1 }])
    end

    it 'returns group records for a group scope' do
      survivor_sex_data = ManagedReports::Indicators::SurvivorsSex.build(group_user, {}).data

      expect(survivor_sex_data).to match_array(
        [
          { 'id' => 'male', 'total' => 1 },
          { 'id' => 'female', 'total' => 3 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      survivor_sex_data = ManagedReports::Indicators::SurvivorsSex.build(agency_user, {}).data

      expect(survivor_sex_data).to match_array(
        [
          { 'id' => 'male', 'total' => 1 },
          { 'id' => 'female', 'total' => 1 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      survivor_sex_data = ManagedReports::Indicators::SurvivorsSex.build(all_user, {}).data

      expect(survivor_sex_data).to match_array(
        [
          { 'id' => 'male', 'total' => 2 },
          { 'id' => 'female', 'total' => 3 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::SurvivorsSex.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 2020, data: [{ 'id' => 'female', 'total' => 1 }, { 'id' => 'male', 'total' => 1 }] },
            { group_id: 2021, data: [{ 'id' => 'female', 'total' => 2 }, { 'id' => 'male', 'total' => 1 }] },
            { group_id: 2022, data: [] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::SurvivorsSex.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2021-03-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [{ 'id' => 'male', 'total' => 1 }] },
            { group_id: '2020-09', data: [{ 'id' => 'female', 'total' => 1 }] },
            { group_id: '2020-10', data: [] }, { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] }, { group_id: '2021-01', data: [{ 'id' => 'male', 'total' => 1 }] },
            { group_id: '2021-02', data: [{ 'id' => 'female', 'total' => 1 }] },
            { group_id: '2021-03', data: [{ 'id' => 'female', 'total' => 1 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::SurvivorsSex.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2021-03-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [{ 'id' => 'female', 'total' => 1 }, { 'id' => 'male', 'total' => 1 }] },
            { group_id: '2020-Q4', data: [] },
            { group_id: '2021-Q1', data: [{ 'id' => 'female', 'total' => 2 }, { 'id' => 'male', 'total' => 1 }] }
          ]
        )
      end
    end
  end
end
