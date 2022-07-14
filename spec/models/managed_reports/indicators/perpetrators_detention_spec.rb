# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorsDetention do
  before do
    clean_data(Incident, Violation, Perpetrator, IndividualVictim, UserGroup, User, Agency, Role)

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
    incident2 = Incident.new_with_user(@group_user, { incident_date: Date.new(2021, 8, 8), status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, { incident_date: Date.new(2022, 2, 18), status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, { incident_date: Date.new(2022, 3, 28), status: 'open' })
    incident4.save!

    violation1 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident1.id)
    violation1.individual_victims = [
      IndividualVictim.create!(data: {
                                 individual_sex: 'male', victim_deprived_liberty_security_reasons: 'yes',
                                 entity_responsible_deprivation_liberty: 'armed_force'
                               }),
      IndividualVictim.create!(data: { individual_sex: 'unknown', victim_deprived_liberty_security_reasons: 'yes',
                                       entity_responsible_deprivation_liberty: 'armed_force' }),
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'yes',
                                       entity_responsible_deprivation_liberty: 'armed_group' })
    ]

    violation2 = Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack' }, incident_id: incident2.id)
    violation2.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'male', victim_deprived_liberty_security_reasons: 'yes',
                                       entity_responsible_deprivation_liberty: 'other_party_to_the_conflict' })
    ]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident3.id)
    violation3.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'female', victim_deprived_liberty_security_reasons: 'yes',
                                       entity_responsible_deprivation_liberty: 'crossfire' }),
      IndividualVictim.create!(data: { individual_sex: 'female', victim_deprived_liberty_security_reasons: 'yes',
                                       entity_responsible_deprivation_liberty: 'unknown' })
    ]

    violation4 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident4.id)
    violation4.individual_victims = [
      IndividualVictim.create!(data: { individual_sex: 'female', victim_deprived_liberty_security_reasons: 'no',
                                       entity_responsible_deprivation_liberty: 'armed_group' }),
      IndividualVictim.create!(data: { individual_sex: 'unknown', victim_deprived_liberty_security_reasons: 'unknown',
                                       entity_responsible_deprivation_liberty: 'armed_group' })
    ]

    individual_victims = IndividualVictim.create!(data: { individual_sex: 'unknown',
                                                          victim_deprived_liberty_security_reasons: 'unknown',
                                                          entity_responsible_deprivation_liberty: 'unknown' })
    individual_victims.violations = [violation2, violation4]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(
      nil
    ).data

    expect(perpetrators_data).to match_array(
      [
        { id: 'armed_force', unknown: 1, total: 2, male: 1 },
        { id: 'crossfire', female: 1, total: 1 },
        { id: 'other_party_to_the_conflict', male: 1, total: 1 },
        { id: 'unknown', female: 1, total: 1 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@self_user).data

      expect(perpetrators_data).to match_array([
                                                 { id: 'armed_force', unknown: 1, total: 2, male: 1 }

                                               ])
    end

    it 'returns group records for a group scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@group_user).data

      expect(perpetrators_data).to match_array(
        [
          { id: 'crossfire', female: 1, total: 1 },
          { id: 'other_party_to_the_conflict', male: 1, total: 1 },
          { id: 'unknown', female: 1, total: 1 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@agency_user).data

      expect(perpetrators_data).to match_array(
        [
          { id: 'crossfire', female: 1, total: 1 },
          { id: 'other_party_to_the_conflict', male: 1, total: 1 },
          { id: 'unknown', female: 1, total: 1 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@all_user).data

      expect(perpetrators_data).to match_array(
        [
          { id: 'armed_force', male: 1, unknown: 1, total: 2 },
          { id: 'crossfire', female: 1, total: 1 },
          { id: 'other_party_to_the_conflict', male: 1, total: 1 },
          { id: 'unknown', female: 1, total: 1 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PerpetratorsDetention.build(
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
            { group_id: 2020, data: [{ id: 'armed_force', male: 1, unknown: 1, total: 2 }] },
            { group_id: 2021, data: [{ id: 'other_party_to_the_conflict', male: 1, total: 1 }] },
            { group_id: 2022, data: [{ id: 'crossfire', female: 1, total: 1 }, { id: 'unknown', female: 1, total: 1 }] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PerpetratorsDetention.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-02-28'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [{ id: 'armed_force', male: 1, unknown: 1, total: 2 }] },
            { group_id: '2020-09', data: [] },
            { group_id: '2020-10', data: [] },
            { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] },
            { group_id: '2021-01', data: [] },
            { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] },
            { group_id: '2021-04', data: [] },
            { group_id: '2021-05', data: [] },
            { group_id: '2021-06', data: [] },
            { group_id: '2021-07', data: [] },
            { group_id: '2021-08', data: [{ id: 'other_party_to_the_conflict', male: 1, total: 1 }] },
            { group_id: '2021-09', data: [] },
            { group_id: '2021-10', data: [] },
            { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] },
            { group_id: '2022-01', data: [] },
            { group_id: '2022-02', data: [
              { id: 'crossfire', female: 1, total: 1 }, { id: 'unknown', female: 1, total: 1 }
            ] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::PerpetratorsDetention.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [{ id: 'armed_force', male: 1, unknown: 1, total: 2 }] },
            { group_id: '2020-Q4', data: [] },
            { group_id: '2021-Q1', data: [] },
            { group_id: '2021-Q2', data: [] },
            { group_id: '2021-Q3', data: [{ id: 'other_party_to_the_conflict', male: 1, total: 1 }] },
            { group_id: '2021-Q4', data: [] },
            { group_id: '2022-Q1', data: [
              { id: 'crossfire', female: 1, total: 1 }, { female: 1, id: 'unknown', total: 1 }
            ] }
          ]
        )
      end
    end
  end
end
