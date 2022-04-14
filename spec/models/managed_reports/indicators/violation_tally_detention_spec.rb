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

    expect(violation_tally_data).to eq(
      { 'boys' => 6, 'girls' => 7, 'total' => 21, 'unknown' => 8 }
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @self_user
      ).data

      expect(violation_tally_data).to eq(
        { 'boys' => 1, 'girls' => 2, 'unknown' => 3, 'total' => 6 }
      )
    end

    it 'returns group records for a group scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @group_user
      ).data

      expect(violation_tally_data).to eq(
        { 'boys' => 5, 'girls' => 5, 'unknown' => 5, 'total' => 15 }
      )
    end

    it 'returns agency records for an agency scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @agency_user
      ).data

      expect(violation_tally_data).to eq(
        { 'boys' => 3, 'girls' => 2, 'unknown' => 3, 'total' => 8 }
      )
    end

    it 'returns all records for an all scope' do
      violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
        @all_user
      ).data

      expect(violation_tally_data).to eq(
        { 'boys' => 6, 'girls' => 7, 'total' => 21, 'unknown' => 8 }
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
            { group_id: 2020, data: { 'unknown' => 3, 'boys' => 1, 'girls' => 2, 'total' => 6 } },
            { group_id: 2021, data: { 'unknown' => 1, 'total' => 3, 'girls' => 1, 'boys' => 1 } },
            { group_id: 2022, data: { 'total' => 12, 'unknown' => 4, 'girls' => 4, 'boys' => 4 } }
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
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'recruitment')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 'august-2020', data: { 'boys' => 1, 'unknown' => 3, 'total' => 6, 'girls' => 2 } },
            { group_id: 'may-2021', data: { 'total' => 3, 'boys' => 1, 'unknown' => 1, 'girls' => 1 } },
            { group_id: 'february-2022', data: { 'girls' => 1, 'total' => 5, 'unknown' => 2, 'boys' => 2 } },
            { group_id: 'march-2022', data: { 'boys' => 2, 'unknown' => 2, 'girls' => 3, 'total' => 7 } }
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
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'recruitment')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 'q3-2020', data: { 'girls' => 2, 'total' => 6, 'boys' => 1, 'unknown' => 3 } },
            { group_id: 'q2-2021', data: { 'boys' => 1, 'girls' => 1, 'total' => 3, 'unknown' => 1 } },
            { group_id: 'q1-2022', data: { 'unknown' => 4, 'girls' => 4, 'boys' => 4, 'total' => 12 } }
          ]
        )
      end
    end
  end
end
