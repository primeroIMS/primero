# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::TotalTransfersByUserGroups do
  before do
    clean_data(Alert, Transition, Child, UserGroup, User, Agency, Role)

    child1 = Child.new_with_user(self_user, { sex: 'female', age: 2 })
    child1.save!
    child2 = Child.new_with_user(group_user, { sex: 'male', age: 10 })
    child2.save!
    child3 = Child.new_with_user(all_user, { sex: 'male', age: 4 })
    child3.save!

    Transfer.new(
      transitioned_to_user: group_user, transitioned_by_user: self_user, record: child1, consent_overridden: true,
      created_at: DateTime.new(2021, 8, 12, 10, 15, 13)
    ).save(validate: false)
    Transfer.new(
      transitioned_to_user: group_user, transitioned_by_user: agency_user, record: child2, consent_overridden: true,
      created_at: DateTime.new(2021, 9, 8, 21, 12, 10)
    ).save(validate: false)
    Transfer.new(
      transitioned_to_user: group_user, transitioned_by_user: all_user, record: child3, consent_overridden: true,
      created_at: DateTime.new(2020, 10, 10, 5, 10, 21)
    ).save(validate: false)
  end

  after do
    clean_data(Alert, Transition, Child, UserGroup, User, Agency, Role)
  end

  let(:self_role) do
    Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::SELF,
          actions: [Permission::REFERRALS_TRANSFERS_REPORT]
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
          actions: [Permission::REFERRALS_TRANSFERS_REPORT]
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
          actions: [Permission::REFERRALS_TRANSFERS_REPORT]
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
          actions: [Permission::REFERRALS_TRANSFERS_REPORT]
        )
      ]
    )
  end

  let(:agency_a) { Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1') }
  let(:agency_b) { Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2') }
  let(:group_a) { UserGroup.create(unique_id: 'group_a', name: 'Group A') }
  let(:group_b) { UserGroup.create(unique_id: 'group_b', name: 'Group B') }

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

  it 'returns the total number of transfers by user group' do
    total_transfers = ManagedReports::Indicators::TotalTransfersByUserGroups.build.data
    expect(total_transfers).to eq(
      [
        { id: 'group_a', group_b: 2, total: 2 },
        { id: 'group_b', group_b: 2, total: 2 },
        { id: 'total', group_b: 4, total: 4 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      total_transfers = ManagedReports::Indicators::TotalTransfersByUserGroups.build(self_user).data

      expect(total_transfers).to eq(
        [
          { id: 'group_a', group_b: 1, total: 1 },
          { id: 'total', group_b: 1, total: 1 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      total_transfers = ManagedReports::Indicators::TotalTransfersByUserGroups.build(group_user).data

      expect(total_transfers).to eq(
        [
          { id: 'group_a', group_b: 2, total: 2 },
          { id: 'group_b', group_b: 2, total: 2 },
          { id: 'total', group_b: 4, total: 4 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      total_transfers = ManagedReports::Indicators::TotalTransfersByUserGroups.build(agency_user).data

      expect(total_transfers).to eq(
        [
          { id: 'group_a', group_b: 2, total: 2 },
          { id: 'group_b', group_b: 2, total: 2 },
          { id: 'total', group_b: 4, total: 4 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      total_transfers = ManagedReports::Indicators::TotalTransfersByUserGroups.build(all_user).data

      expect(total_transfers).to eq(
        [
          { id: 'group_a', group_b: 2, total: 2 },
          { id: 'group_b', group_b: 2, total: 2 },
          { id: 'total', group_b: 4, total: 4 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::TotalTransfersByUserGroups.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'created_at' => SearchFilters::DateRange.new(
              field_name: 'created_at', from: Date.parse('2020-01-01'), to: Date.parse('2021-09-08')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data: [
                { id: 'group_a', group_b: 1, total: 1 },
                { id: 'group_b', group_b: 1, total: 1 },
                { id: 'total', group_b: 2, total: 2 }
              ]
            },
            {
              group_id: 2021,
              data: [
                { id: 'group_a', group_b: 1, total: 1 },
                { id: 'group_b', group_b: 1, total: 1 },
                { id: 'total', group_b: 2, total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::TotalTransfersByUserGroups.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'created_at' => SearchFilters::DateRange.new(
              field_name: 'created_at', from: Date.parse('2021-08-01'), to: Date.parse('2021-09-08')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-08',
              data: [
                { id: 'group_a', group_b: 1, total: 1 },
                { id: 'total', group_b: 1, total: 1 }
              ]
            },
            {
              group_id: '2021-09',
              data: [
                { id: 'group_b', group_b: 1, total: 1 },
                { id: 'total', group_b: 1, total: 1 }
              ]
            }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::TotalTransfersByUserGroups.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'created_at' => SearchFilters::DateRange.new(
              field_name: 'created_at', from: Date.parse('2021-08-01'), to: Date.parse('2021-09-08')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-Q3',
              data: [
                { id: 'group_a', group_b: 1, total: 1 },
                { id: 'group_b', group_b: 1, total: 1 },
                { id: 'total', group_b: 2, total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::TotalTransfersByUserGroups.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'created_at' => SearchFilters::DateRange.new(
              field_name: 'created_at', from: Date.parse('2021-08-08'), to: Date.parse('2021-08-12')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-08-08 - 2021-08-14',
              data: [{ id: 'group_a', group_b: 1, total: 1 }, { id: 'total', group_b: 1, total: 1 }]
            }
          ]
        )
      end
    end
  end
end
