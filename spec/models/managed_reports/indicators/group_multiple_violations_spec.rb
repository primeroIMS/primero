# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::GroupMultipleViolations do
  before do
    clean_data(Incident, Violation, Perpetrator, GroupVictim, UserGroup, User, Agency, Role)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::GHN_REPORT
        ]
      )
    ]
    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions:
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions:
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions:
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions:
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

    @incident1 = Incident.new_with_user(
      @self_user, { incident_date: Date.new(2020, 8, 8), date_of_first_report: Date.new(2020, 8, 8), status: 'open' }
    )
    @incident1.save!
    incident2 = Incident.new_with_user(
      @group_user, { incident_date: Date.new(2021, 8, 8), date_of_first_report: Date.new(2021, 8, 8), status: 'open' }
    )
    incident2.save!
    incident3 = Incident.new_with_user(
      @agency_user,
      { incident_date: Date.new(2022, 2, 18), date_of_first_report: Date.new(2022, 2, 18), status: 'open' }
    )
    incident3.save!
    @incident4 = Incident.new_with_user(
      @all_user, { incident_date: Date.new(2022, 3, 28), date_of_first_report: Date.new(2022, 3, 28), status: 'open' }
    )
    @incident4.save!

    violation1 = Violation.create!(
      data: {
        type: 'killing', attack_type: 'arson', ctfmr_verified_date: Date.new(2021, 8, 8), ctfmr_verified: 'verified'
      },
      incident_id: @incident1.id
    )
    violation1.group_victims = [
      GroupVictim.create!(data: { group_gender: 'mixed', group_age_band: %w[0_5 6_10], group_multiple_violations: true })
    ]

    violation2 = Violation.create!(
      data: {
        type: 'killing',
        attack_type: 'aerial_attack',
        ctfmr_verified: 'verified',
        ctfmr_verified_date: Date.new(2021, 8, 8)
      },
      incident_id: incident2.id
    )
    violation2.group_victims = [
      GroupVictim.create!(data: { group_gender: 'female', group_age_band: %w[6_10 11_13] })
    ]

    violation3 = Violation.create!(
      data: {
        type: 'maiming',
        attack_type: 'aerial_attack',
        ctfmr_verified: 'verified',
        ctfmr_verified_date: Date.new(2020, 8, 8)
      },
      incident_id: incident3.id
    )
    violation3.group_victims = [
      GroupVictim.create!(data: { group_gender: 'male', group_age_band: %w[0_5 11_13] })
    ]

    violation4 = Violation.create!(
      data: {
        type: 'killing', attack_type: 'arson', ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 3, 28)
      },
      incident_id: @incident4.id
    )
    violation4.group_victims = [
      GroupVictim.create!(data: { group_gender: 'male', group_age_band: %w[11_13 14_18] }),
      GroupVictim.create!(
        data: { group_gender: 'unknown', group_age_band: %w[unknown], group_multiple_violations: true }
      )
    ]
  end

  it 'return data for violations marked as verified' do
    data = ManagedReports::Indicators::GroupMultipleViolations.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2021-04-01'),
          to: Date.parse('2022-06-10')
        ),
        'type' => SearchFilters::Value.new(
          field_name: 'type',
          value: 'ghn_report'
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          'data' => {
            'unique_id' => nil,
            'violations' => ['killing'],
            'group_age_band' => %w[0_5 6_10],
            'group_gender' => 'mixed',
            'incident_id' => @incident1.id,
            'incident_short_id' => @incident1.short_id
          }
        },
        {
          'data' => {
            'unique_id' => nil,
            'violations' => ['killing'],
            'group_age_band' => %w[unknown],
            'group_gender' => 'unknown',
            'incident_id' => @incident4.id,
            'incident_short_id' => @incident4.short_id
          }
        }
      ]
    )
  end
end
