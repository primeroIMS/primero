# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ViolationTallyDetention do
  before do
    clean_data(Incident, Violation, IndividualVictim, UserGroup, User, Agency, Role)

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

    incident1 = Incident.new_with_user(@self_user, { incident_date: Date.new(2020, 8, 8), status: 'open' })
    incident1.save!
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 5, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 3, 28), status: 'open' })
    incident4.save!

    violation1 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 3, 'total': 6 } },
      incident_id: incident1.id
    )
    violation1.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation2 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
      incident_id: incident2.id
    )
    violation2.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation3 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 1, 'unknown': 2, 'total': 5 } },
      incident_id: incident3.id
    )
    violation3.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation4 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident4.id
    )
    violation4.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation5 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident4.id
    )
    violation5.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'false' }),
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'unknown' })
    ]
  end

  it 'returns data for violation tally indicator' do
    violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
      nil
    ).data

    expect(violation_tally_data).to match_array(
      [
        { id: 'boys', total: 6 },
        { id: 'unknown', total: 8 },
        { id: 'girls', total: 7 },
        { id: 'total', total: 21 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @self_user
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
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @group_user
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 5 },
          { id: 'unknown', total: 5 },
          { id: 'girls', total: 5 },
          { id: 'total', total: 15 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @agency_user
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 3 },
          { id: 'unknown', total: 3 },
          { id: 'girls', total: 2 },
          { id: 'total', total: 8 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @all_user
      ).data

      expect(violation_tally_data).to match_array(
        [
          { id: 'boys', total: 6 },
          { id: 'unknown', total: 8 },
          { id: 'girls', total: 7 },
          { id: 'total', total: 21 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::ViolationTallyDetention.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'recruitment')
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
            {
              group_id: 2022,
              data: [
                { id: 'boys', total: 4 },
                { id: 'girls', total: 4 },
                { id: 'total', total: 12 },
                { id: 'unknown', total: 4 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::ViolationTallyDetention.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'recruitment')
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
            { group_id: '2021-12', data: [] }, { group_id: '2022-01', data: [] },
            {
              group_id: '2022-02',
              data: [
                { id: 'boys', total: 2 },
                { id: 'girls', total: 1 },
                { id: 'total', total: 5 },
                { id: 'unknown', total: 2 }
              ]
            },
            {
              group_id: '2022-03',
              data: [
                { id: 'boys', total: 2 },
                { id: 'girls', total: 3 },
                { id: 'total', total: 7 },
                { id: 'unknown', total: 2 }
              ]
            }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::ViolationTallyDetention.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'recruitment')
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
              data: [
                { id: 'boys', total: 4 },
                { id: 'girls', total: 4 },
                { id: 'total', total: 12 },
                { id: 'unknown', total: 4 }
              ]
            }
          ]
        )
      end
    end
  end
end
