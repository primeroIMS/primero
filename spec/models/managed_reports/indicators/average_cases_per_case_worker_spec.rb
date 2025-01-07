# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::AverageCasesPerCaseWorker do
  let(:role1) do
    Role.create!(
      name: 'Role 1',
      unique_id: 'role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          actions: [
            Permission::PROCESS_QUALITY_AVERAGE_CASES
          ]
        )
      ]
    )
  end

  let(:agency1) { Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1') }

  let(:group1) { UserGroup.create(unique_id: 'group-1', name: 'Group 1') }

  let(:user1) do
    User.create!(
      full_name: 'User 1',
      user_name: 'user_1',
      email: 'user1@localhost.com',
      agency_id: agency1.id,
      user_groups: [group1],
      role: role1
    )
  end

  let(:user2) do
    User.create!(
      full_name: 'User 2',
      user_name: 'user_2',
      email: 'user2@localhost.com',
      agency_id: agency1.id,
      user_groups: [group1],
      role: role1
    )
  end

  let(:child1) do
    child1 = Child.new_with_user(
      user1,
      { sex: 'male', next_steps: ['a_continue_protection_assessment'], registration_date: '2021-10-05' }
    )
    child1.save!
    child1
  end

  let(:child2) do
    child2 = Child.new_with_user(
      user1,
      { sex: 'male', next_steps: ['a_continue_protection_assessment'], registration_date: '2021-10-08' }
    )
    child2.save!
    child2
  end

  let(:child3) do
    child3 = Child.new_with_user(
      user1,
      { sex: 'male', next_steps: ['a_continue_protection_assessment'], registration_date: '2021-11-07' }
    )
    child3.save!
    child3
  end

  let(:child4) do
    child4 = Child.new_with_user(
      user2,
      { sex: 'female', next_steps: ['a_continue_protection_assessment'], registration_date: '2021-10-08' }
    )
    child4.save!
    child4
  end

  before do
    clean_data(Lookup, UserGroup, User, Agency, Role, Child)
    child1
    child2
    child3
    child4
  end

  it 'returns data for average_cases_per_case_worker indicator' do
    report_data = ManagedReports::Indicators::AverageCasesPerCaseWorker.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'average_cases_per_case_worker', female: 0.5, male: 1.5, total: 2 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::AverageCasesPerCaseWorker.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-01-01',
              to: '2021-12-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: [
                { id: 'average_cases_per_case_worker', female: 0.5, male: 1.5, total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::AverageCasesPerCaseWorker.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-11-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: [{ id: 'average_cases_per_case_worker', female: 0.5, male: 1, total: 1.5 }]
            },
            {
              group_id: '2021-11',
              data: [{ id: 'average_cases_per_case_worker', male: 0.5, total: 0.5 }]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::AverageCasesPerCaseWorker.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-10-16'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-09-26 - 2021-10-02',
              data: []
            },
            {
              group_id: '2021-10-03 - 2021-10-09',
              data: [{ id: 'average_cases_per_case_worker', female: 0.5, male: 1, total: 1.5 }]
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: []
            }
          ]
        )
      end
    end
  end
end
