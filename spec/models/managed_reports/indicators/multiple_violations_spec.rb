# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::MultipleViolations do
  before do
    clean_data(Incident, Violation, Perpetrator, IndividualVictim, UserGroup, User, Agency, Role)

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

    incident1 = Incident.new_with_user(@self_user, { incident_date: Date.new(2020, 8, 8), status: 'open' })
    incident1.save!
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 8, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 3, 28), status: 'open' })
    incident4.save!

    violation1 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident1.id)
    violation1.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'male', individual_age: 9,
                                       individual_multiple_violations: 'true' })
    ]

    violation2 = Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack' }, incident_id: incident2.id)
    violation2.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'female', individual_age: 2 })
    ]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident3.id)
    violation3.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'unknown', individual_age: 4 })
    ]

    violation4 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident4.id)
    violation4.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'male', individual_age: 12 }),
      IndividualVictim.create!(data: { individual_sex: 'unknown', individual_age: 3,
                                       individual_multiple_violations: 'true' })
    ]
  end

  it 'return data for verified information indicator' do
    data = ManagedReports::Indicators::MultipleViolations.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: '2021-04-01',
          to: '2022-06-10'
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          'data' => {
            'unique_id' => nil,
            'violations' => ['killing'],
            'individual_age' => '3',
            'individual_sex' => 'unknown'
          }
        }
      ]
    )
  end
end
