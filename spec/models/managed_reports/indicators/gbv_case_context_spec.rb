# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::GBVCaseContext do
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
          actions: [Permission::GBV_STATISTICS_REPORT]
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
          actions: [Permission::GBV_STATISTICS_REPORT]
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
          actions: [Permission::GBV_STATISTICS_REPORT]
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
          actions: [Permission::GBV_STATISTICS_REPORT]
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
      {
        incident_date: Date.new(2020, 8, 12),
        age: 5,
        gbv_sexual_violence_type: GenderBasedViolence::RAPE,
        consent_reporting: 'true',
        alleged_perpetrator: [
          { unique_id: '0001', perpetrator_relationship: GenderBasedViolence::INTIMATE_PARTNER_FORMER_PARTNER }
        ]
      }
    ).save!
    Incident.new_with_user(
      @group_user,
      {
        incident_date: Date.new(2021, 9, 8),
        age: 2,
        goods_money_exchanged: true,
        consent_reporting: 'true',
        gbv_sexual_violence_type: GenderBasedViolence::SEXUAL_ASSAULT
      }
    ).save!
    Incident.new_with_user(
      @agency_user,
      {
        incident_date: Date.new(2021, 9, 10),
        age: 8,
        consent_reporting: 'true',
        gbv_sexual_violence_type: GenderBasedViolence::FORCED_MARRIAGE
      }
    ).save!
    Incident.new_with_user(
      @all_user,
      {
        incident_date: Date.new(2020, 9, 12),
        age: 8,
        abduction_status_time_of_incident: 'status_1',
        consent_reporting: 'true',
        gbv_sexual_violence_type: GenderBasedViolence::RAPE
      }
    ).save!
    Incident.new_with_user(
      @all_user,
      {
        incident_date: Date.new(2022, 10, 8),
        age: 8,
        abduction_status_time_of_incident: 'status_1',
        gbv_sexual_violence_type: GenderBasedViolence::RAPE,
        consent_reporting: 'true',
        harmful_traditional_practice: 'practice_1'
      }
    ).save!
    Incident.new_with_user(
      @all_user,
      {
        incident_date: Date.new(2022, 10, 8),
        age: 8,
        abduction_status_time_of_incident: 'status_1',
        gbv_sexual_violence_type: GenderBasedViolence::RAPE,
        consent_reporting: 'true',
        harmful_traditional_practice: 'practice_1',
        gbv_reported_elsewhere: 'gbvims-org'
      }
    ).save!
  end

  it 'returns the number of incidents grouped by incident_timeofday' do
    data = ManagedReports::Indicators::GBVCaseContext.build.data

    expect(data).to match_array(
      [
        { 'id' => 'child_sexual_abuse', 'total' => 4 },
        { 'id' => 'early_marriage', 'total' => 1 },
        { 'id' => 'harmful_traditional_practice', 'total' => 1 },
        { 'id' => 'intimate_partner_violence', 'total' => 1 },
        { 'id' => 'possible_sexual_exploitation', 'total' => 1 },
        { 'id' => 'possible_sexual_slavery', 'total' => 2 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      data = ManagedReports::Indicators::GBVCaseContext.build(@self_user).data

      expect(data).to match_array(
        [
          { 'id' => 'child_sexual_abuse', 'total' => 1 },
          { 'id' => 'intimate_partner_violence', 'total' => 1 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      data = ManagedReports::Indicators::GBVCaseContext.build(@group_user).data

      expect(data).to match_array(
        [
          { 'id' => 'child_sexual_abuse', 'total' => 3 },
          { 'id' => 'early_marriage', 'total' => 1 },
          { 'id' => 'harmful_traditional_practice', 'total' => 1 },
          { 'id' => 'possible_sexual_exploitation', 'total' => 1 },
          { 'id' => 'possible_sexual_slavery', 'total' => 2 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      data = ManagedReports::Indicators::GBVCaseContext.build(@agency_user).data

      expect(data).to match_array(
        [
          { 'id' => 'child_sexual_abuse', 'total' => 1 },
          { 'id' => 'early_marriage', 'total' => 1 },
          { 'id' => 'possible_sexual_exploitation', 'total' => 1 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      data = ManagedReports::Indicators::GBVCaseContext.build(@all_user).data

      expect(data).to match_array(
        [
          { 'id' => 'child_sexual_abuse', 'total' => 4 },
          { 'id' => 'early_marriage', 'total' => 1 },
          { 'id' => 'harmful_traditional_practice', 'total' => 1 },
          { 'id' => 'intimate_partner_violence', 'total' => 1 },
          { 'id' => 'possible_sexual_exploitation', 'total' => 1 },
          { 'id' => 'possible_sexual_slavery', 'total' => 2 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::GBVCaseContext.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-10-10')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 2 },
                { 'id' => 'intimate_partner_violence', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            },
            {
              group_id: 2021,
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'early_marriage', 'total' => 1 },
                { 'id' => 'possible_sexual_exploitation', 'total' => 1 }
              ]
            },
            {
              group_id: 2022,
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'harmful_traditional_practice', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::GBVCaseContext.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-10-10')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-08',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'intimate_partner_violence', 'total' => 1 }
              ]
            },
            {
              group_id: '2020-09',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            },
            { group_id: '2020-10', data: [] }, { group_id: '2020-11', data: [] }, { group_id: '2020-12', data: [] },
            { group_id: '2021-01', data: [] }, { group_id: '2021-02', data: [] }, { group_id: '2021-03', data: [] },
            { group_id: '2021-04', data: [] }, { group_id: '2021-05', data: [] }, { group_id: '2021-06', data: [] },
            { group_id: '2021-07', data: [] }, { group_id: '2021-08', data: [] },
            {
              group_id: '2021-09',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'early_marriage', 'total' => 1 },
                { 'id' => 'possible_sexual_exploitation', 'total' => 1 }
              ]
            },
            { group_id: '2021-10', data: [] }, { group_id: '2021-11', data: [] }, { group_id: '2021-12', data: [] },
            { group_id: '2022-01', data: [] }, { group_id: '2022-02', data: [] }, { group_id: '2022-03', data: [] },
            { group_id: '2022-04', data: [] }, { group_id: '2022-05', data: [] }, { group_id: '2022-06', data: [] },
            { group_id: '2022-07', data: [] }, { group_id: '2022-08', data: [] }, { group_id: '2022-09', data: [] },
            {
              group_id: '2022-10',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'harmful_traditional_practice', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::GBVCaseContext.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.parse('2020-08-01'),
              to: Date.parse('2022-10-10')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2020-Q3',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 2 },
                { 'id' => 'intimate_partner_violence', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            },
            { group_id: '2020-Q4', data: [] }, { group_id: '2021-Q1', data: [] }, { group_id: '2021-Q2', data: [] },
            {
              group_id: '2021-Q3',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'early_marriage', 'total' => 1 },
                { 'id' => 'possible_sexual_exploitation', 'total' => 1 }
              ]
            },
            { group_id: '2021-Q4', data: [] }, { group_id: '2022-Q1', data: [] }, { group_id: '2022-Q2', data: [] },
            { group_id: '2022-Q3', data: [] },
            {
              group_id: '2022-Q4',
              data: [
                { 'id' => 'child_sexual_abuse', 'total' => 1 },
                { 'id' => 'harmful_traditional_practice', 'total' => 1 },
                { 'id' => 'possible_sexual_slavery', 'total' => 1 }
              ]
            }
          ]
        )
      end
    end
  end
end
