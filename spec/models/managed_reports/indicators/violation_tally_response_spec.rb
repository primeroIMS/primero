# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::ViolationTallyResponse do
  before do
    clean_data(Incident, Violation, UserGroup, User, Agency, Role)

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

    incident1 = Incident.new_with_user(
      @self_user,
      {
        incident_date: Date.new(2020, 8, 8),
        status: 'open',
        module_id: PrimeroModule::MRM,
        killing: [
          {
            unique_id: 'bb2b18ac-724a-11f0-82a6-7c10c98b54af',
            violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 3, 'total' => 6 },
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2020, 11, 5)
          }
        ],
        responses: [
          {
            unique_id: 'c2dc497c-724a-11f0-8473-7c10c98b54af',
            intervention_follow_up_type: 'pending',
            violations_ids: ['bb2b18ac-724a-11f0-82a6-7c10c98b54af']
          }
        ]
      }.with_indifferent_access
    )
    incident1.save!
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 5, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 3, 28), status: 'open' })
    incident4.save!

    violation2 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys' => 1, 'girls' => 1, 'unknown' => 1, 'total' => 3 } },
      incident_id: incident2.id
    )
    violation3 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 1, 'unknown' => 2, 'total' => 5 } },
      incident_id: incident3.id
    )
    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 } },
      incident_id: incident4.id
    )

    violation2.responses = [Response.create!(data: { "intervention_task_force_type": [
                                               'advocacy_with_perpetrator_armed_force_armed_group'
                                             ] })]
    violation3.responses = [Response.create!(data: { "intervention_follow_up_type": 'pending' })]
  end

  it 'returns data for violation tally indicator' do
    violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
    ).data

    expect(violation_tally_data).to match_array(
      [
        { id: 'boys', total: 2 },
        { id: 'unknown', total: 4 },
        { id: 'girls', total: 3 },
        { id: 'total', total: 9 }
      ]
    )
  end

  describe 'has_late_verified_violations filter' do
    it 'returns the data only for those incidents where the value is true' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
        @user,
        {
          'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing'),
          'has_late_verified_violations' => SearchFilters::BooleanValue.new(
            field_name: 'has_late_verified_violations', value: true
          )
        }
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 1 },
          { id: 'unknown', total: 3 },
          { id: 'girls', total: 2 },
          { id: 'total', total: 6 }
        ]
      )
    end
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
        @self_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 1 },
          { id: 'unknown', total: 3 },
          { id: 'girls', total: 2 },
          { id: 'total', total: 6 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
        @group_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 1 },
          { id: 'unknown', total: 1 },
          { id: 'girls', total: 1 },
          { id: 'total', total: 3 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
        @agency_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 1 },
          { id: 'unknown', total: 1 },
          { id: 'girls', total: 1 },
          { id: 'total', total: 3 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyResponse.build(
        @all_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 2 },
          { id: 'unknown', total: 4 },
          { id: 'girls', total: 3 },
          { id: 'total', total: 9 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::ViolationTallyResponse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-10-10')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 2 },
                { id: 'total', total: 6 },
                { id: 'unknown', total: 3 }
              ]
            },
            {
              group_id: 2021,
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 1 },
                { id: 'total', total: 3 },
                { id: 'unknown', total: 1 }
              ]
            },
            { group_id: 2022, data: [] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::ViolationTallyResponse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-03-30')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-08',
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 2 },
                { id: 'total', total: 6 },
                { id: 'unknown', total: 3 }
              ]
            },
            { group_id: '2020-09', data: [] }, { group_id: '2020-10', data: [] }, { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] }, { group_id: '2021-01', data: [] }, { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] }, { group_id: '2021-04', data: [] },
            {
              group_id: '2021-05',
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 1 },
                { id: 'total', total: 3 },
                { id: 'unknown', total: 1 }
              ]
            },
            { group_id: '2021-06', data: [] }, { group_id: '2021-07', data: [] }, { group_id: '2021-08', data: [] },
            { group_id: '2021-09', data: [] }, { group_id: '2021-10', data: [] }, { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] }, { group_id: '2022-01', data: [] }, { group_id: '2022-02', data: [] },
            { group_id: '2022-03', data: [] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::ViolationTallyResponse.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-03-30')
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing')
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-Q3',
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 2 },
                { id: 'total', total: 6 },
                { id: 'unknown', total: 3 }
              ]
            },
            { group_id: '2020-Q4', data: [] }, { group_id: '2021-Q1', data: [] },
            {
              group_id: '2021-Q2',
              data: [
                { id: 'boys', total: 1 },
                { id: 'girls', total: 1 },
                { id: 'total', total: 3 },
                { id: 'unknown', total: 1 }
              ]
            },
            { group_id: '2021-Q3', data: [] }, { group_id: '2021-Q4', data: [] },
            {
              group_id: '2022-Q1',
              data: []
            }
          ]
        )
      end
    end
  end
end
