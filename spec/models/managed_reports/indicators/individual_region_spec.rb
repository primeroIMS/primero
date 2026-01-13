# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::IndividualRegion do
  let(:managed_report_user) do
    fake_user(
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::ALL,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
    )
  end

  before do
    clean_data(SystemSettings, Incident, Violation, Location, IndividualVictim)

    managed_report_user.stub(:incident_reporting_location_admin_level).and_return(1)

    incident1 = Incident.create!(
      data: {
        incident_date: Date.new(2021, 5, 23),
        status: 'open',
        reporting_location_hierarchy: 'GUI.GUI001.GUI00101',
        date_of_first_report: Date.new(2021, 5, 13)
      }
    )

    incident2 = Incident.create!(
      data: {
        incident_date: Date.new(2021, 5, 28),
        status: 'closed',
        reporting_location_hierarchy: 'GUI.GUI002.GUI00201',
        date_of_first_report: Date.new(2021, 5, 18)
      }
    )

    violation1 = Violation.create!(
      data: {
        type: 'attack_on_schools',
        ctfmr_verified: 'verified',
        violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 },
        ctfmr_verified_date: Date.new(2021, 5, 13)
      },
      incident_id: incident1.id
    )

    shared_victim = IndividualVictim.create!(data: { individual_age: 2 })

    violation1.individual_victims = [
      IndividualVictim.create!(data: { individual_age: 9 }),
      shared_victim
    ]

    violation2 = Violation.create!(
      data: { type: 'attack_on_schools', violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 } },
      incident_id: incident1.id
    )

    violation2.individual_victims = [
      IndividualVictim.create!(data: { individual_age: 10, individual_sex: 'unknown' }),
      shared_victim
    ]

    violation3 = Violation.create!(
      data: { type: 'attack_on_schools', violation_tally: { boys: 2, girls: 1, unknown: 2, total: 5 } },
      incident_id: incident2.id
    )

    violation3.individual_victims = [
      IndividualVictim.create!(data: { individual_age: 12, individual_sex: 'unknown' }),
      shared_victim
    ]

    violation4 = Violation.create!(
      data: {
        type: 'deprivation_liberty', violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 1, 'total' => 3 }
      },
      incident_id: incident1.id
    )

    violation4.individual_victims = [
      IndividualVictim.create!(data: { individual_age: 7, individual_sex: 'unknown' })
    ]
  end

  it 'return data for individual age indicator' do
    data = ManagedReports::Indicators::IndividualRegion.build(
      managed_report_user,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'incident_date' => SearchFilters::DateRange.new(
          field_name: 'incident_date',
          from: Date.parse('2021-04-01'),
          to: Date.parse('2022-06-10')
        )
      }
    ).data

    expect(data).to match_array(
      [{ group_id: '2021-Q2', data: [{ id: 'GUI001', total: 3 }] },
       { group_id: '2021-Q3', data: [] },
       { group_id: '2021-Q4', data: [] },
       { group_id: '2022-Q1', data: [] },
       { group_id: '2022-Q2', data: [] }]
    )
  end

  describe 'when is filtered by date_of_first_report' do
    it 'return data for individual age indicator' do
      data = ManagedReports::Indicators::IndividualRegion.build(
        managed_report_user,
        {
          'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
          'date_of_first_report' => SearchFilters::DateRange.new(
            field_name: 'date_of_first_report',
            from: Date.parse('2021-04-01'),
            to: Date.parse('2022-06-10')
          )
        }
      ).data

      expect(data).to match_array(
        [{ group_id: '2021-Q2', data: [{ id: 'GUI001', total: 3 }] },
         { group_id: '2021-Q3', data: [] },
         { group_id: '2021-Q4', data: [] },
         { group_id: '2022-Q1', data: [] },
         { group_id: '2022-Q2', data: [] }]
      )
    end
  end

  describe 'when is filtered by ctfmr_verified_date' do
    it 'return data for individual age indicator' do
      data = ManagedReports::Indicators::IndividualRegion.build(
        managed_report_user,
        {
          'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
          'ctfmr_verified_date' => SearchFilters::DateRange.new(
            field_name: 'ctfmr_verified_date',
            from: Date.parse('2021-04-01'),
            to: Date.parse('2022-06-10')
          )
        }
      ).data

      expect(data).to match_array(
        [{ group_id: '2021-Q2', data: [{ id: 'GUI001', total: 2 }] },
         { group_id: '2021-Q3', data: [] },
         { group_id: '2021-Q4', data: [] },
         { group_id: '2022-Q1', data: [] },
         { group_id: '2022-Q2', data: [] }]
      )
    end
  end

  describe 'when is filtered by violation_type' do
    it 'return data for individual age indicator' do
      data = ManagedReports::Indicators::IndividualRegion.build(
        managed_report_user,
        {
          'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
          'violation_type' => SearchFilters::TextList.new(field_name: 'violation_type', values: %w[attack_on_schools])
        }
      ).data

      expect(data).to match_array([{ id: 'GUI001', total: 3 }])
    end
  end
end
