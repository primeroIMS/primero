# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::IncidentWorkflowBySexAndAge do
  before do
    clean_data(Incident, Child, UserGroup, User, Agency, Role)

    SystemSettings.stub(:primary_age_ranges).and_return([0..5, 6..11, 12..17, 18..AgeRange::MAX])

    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::SELF,
          actions: [Permission::WORKFLOW_REPORT]
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
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_b],
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_a],
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

    incident1 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident2 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident3 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident4 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident5 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident6 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })
    incident7 = Incident.create!(data: { incident_date: Date.new(2023, 5, 10) })

    @case1 = Child.new_with_user(
      @self_user, { registration_date: Date.new(2022, 3, 10), sex: 'female', age: 5, workflow: 'open' }
    )
    @case1.incidents = [incident1]
    @case1.save!
    @case2 = Child.new_with_user(
      @group_user, { registration_date: Date.new(2023, 4, 18), sex: 'male', age: 10, workflow: 'closed' }
    )
    @case2.incidents = [incident2]
    @case2.save!
    @case3 = Child.new_with_user(
      @agency_user, { registration_date: Date.new(2022, 3, 8), sex: 'male', age: 18, workflow: 'open' }
    )
    @case3.incidents = [incident3]
    @case3.save!
    @case4 = Child.new_with_user(
      @all_user, {  registration_date: Date.new(2023, 4, 25), sex: 'female', age: 2, workflow: 'closed' }
    )
    @case4.incidents = [incident4, incident5, incident6]
    @case4.save!
    @case5 = Child.new_with_user(
      @self_user, { registration_date: Date.new(2022, 3, 10), sex: 'female', workflow: 'open' }
    )
    @case5.incidents = [incident7]
    @case5.save!
  end

  it 'returns data for incident_workflow_by_sex_and_age indicator' do
    report_data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'female', '0 - 5': 4, incomplete_data: 1, total: 5 },
        { id: 'male', '6 - 11': 1, '18+': 1, total: 2 },
        { id: 'total', '0 - 5': 4, '6 - 11': 1, '18+': 1, incomplete_data: 1, total: 7 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns records for a self scope' do
      report_data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(
        @self_user,
        { 'workflow' => SearchFilters::Value.new(field_name: 'workflow', value: 'open') }
      ).data

      expect(report_data).to match_array(
        [
          { id: 'female', '0 - 5': 1, incomplete_data: 1, total: 2 },
          { id: 'total', '0 - 5': 1, incomplete_data: 1, total: 2 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      report_data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(@group_user, {}).data

      expect(report_data).to match_array(
        [
          { id: 'female', '0 - 5': 4, incomplete_data: 1, total: 5 },
          { id: 'male', '6 - 11': 1, total: 1 },
          { id: 'total', '0 - 5': 4, '6 - 11': 1, incomplete_data: 1, total: 6 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      report_data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(@agency_user, {}).data

      expect(report_data).to match_array(
        [
          { id: 'female', '0 - 5': 1, incomplete_data: 1, total: 2 },
          { id: 'male', '18+': 1, total: 1 },
          { id: 'total', '0 - 5': 1, '18+': 1, incomplete_data: 1, total: 3 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      report_data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(@all_user, {}).data

      expect(report_data).to match_array(
        [
          { id: 'female', '0 - 5': 4, incomplete_data: 1, total: 5 },
          { id: 'male', '6 - 11': 1, '18+': 1, total: 2 },
          { id: 'total', '0 - 5': 4, '6 - 11': 1, '18+': 1, incomplete_data: 1, total: 7 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2022-03-07',
              to: '2022-03-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2022,
              data: [
                { id: 'female', '0 - 5': 1, incomplete_data: 1, total: 2 },
                { id: 'male', '18+': 1, total: 1 },
                { id: 'total', '0 - 5': 1, '18+': 1, incomplete_data: 1, total: 3 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2022-02-15',
              to: '2022-03-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2022-02', data: [] },
            {
              group_id: '2022-03',
              data: [
                { id: 'female', '0 - 5': 1, incomplete_data: 1, total: 2 },
                { id: 'male', '18+': 1, total: 1 },
                { id: 'total', '0 - 5': 1, '18+': 1, incomplete_data: 1, total: 3 }
              ]
            }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2022-02-15',
              to: '2022-03-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2022-Q1',
              data: [
                { id: 'female', '0 - 5': 1, incomplete_data: 1, total: 2 },
                { id: 'male', '18+': 1, total: 1 },
                { id: 'total', '0 - 5': 1, '18+': 1, incomplete_data: 1, total: 3 }
              ]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::IncidentWorkflowBySexAndAge.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2023-04-17',
              to: '2023-04-27'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2023-04-16 - 2023-04-22',
              data: [
                { id: 'male', '6 - 11': 1, total: 1 },
                { id: 'total', '6 - 11': 1, total: 1 }
              ]
            },
            {
              group_id: '2023-04-23 - 2023-04-29',
              data: [
                { id: 'female', '0 - 5': 3, total: 3 },
                { id: 'total', '0 - 5': 3, total: 3 }
              ]
            }
          ]
        )
      end
    end
  end
end
