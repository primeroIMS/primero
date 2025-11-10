# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::UnverifiedInformationViolations do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(
      data: { incident_date: Date.new(2021, 5, 23), date_of_first_report: Date.new(2021, 5, 23), status: 'open' }
    )
    incident1 = Incident.create!(
      data: { incident_date: Date.new(2022, 4, 4), date_of_first_report: Date.new(2022, 4, 4), status: 'open' }
    )
    incident2 = Incident.create!(
      data: { incident_date: Date.new(2022, 4, 8), date_of_first_report: Date.new(2022, 4, 8), status: 'closed' }
    )

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 },
              ctfmr_verified: 'report_pending_verification' },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 5, 'total' => 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys' => 3, 'girls' => 4, 'unknown' => 5, 'total' => 12 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys' => 3, 'girls' => 1, 'unknown' => 5, 'total' => 9 } },
      incident_id: incident2.id
    )
  end

  it 'return data for unverified information indicator' do
    query = %w[
      incident_date=2021-04-01..2022-06-10
    ]

    data = ManagedReports::Indicators::UnverifiedInformationViolations.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2021-04-01'),
          to: Date.parse('2022-06-10')
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          'id' => 'attack_on_hospitals',
          'total' => {
            count: 1,
            query: %w[
              violation_with_verification_status=attack_on_hospitals_report_pending_verification
              incident_date=2021-04-01..2022-06-10
            ]
          }
        },
        {
          'id' => 'attack_on_schools',
          'total' => {
            count: 1,
            query: %w[
              violation_with_verification_status=attack_on_schools_report_pending_verification
              incident_date=2021-04-01..2022-06-10
            ]
          }
        }
      ]
    )
  end
end
