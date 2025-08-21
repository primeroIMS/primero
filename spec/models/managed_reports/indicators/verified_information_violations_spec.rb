# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::VerifiedInformationViolations do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(
      data: { incident_date: Date.new(2021, 5, 23), date_of_first_report: Date.new(2021, 5, 23), status: 'open' }
    )
    incident1 = Incident.create!(
      data: { incident_date: Date.new(2022, 4, 4), date_of_first_report: Date.new(2022, 4, 4), status: 'open' }
    )

    Violation.create!(
      data: {
        type: 'attack_on_schools',
        ctfmr_verified: 'verified',
        ctfmr_verified_date: Date.new(2021, 5, 23),
        violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 }
      },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools',
              ctfmr_verified_date: Date.new(2021, 5, 23),
              violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', ctfmr_verified: 'verified',
              ctfmr_verified_date: Date.new(2021, 7, 31),
              violation_tally: { boys: 1, girls: 1, unknown: 1, total: 3 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'killing',
              ctfmr_verified_date: Date.new(2021, 5, 23),
              violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals',
              ctfmr_verified_date: Date.new(2022, 4, 4),
              ctfmr_verified: 'verified',
              violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 5, 'total' => 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: {
        type: 'denial_humanitarian_access',
        ctfmr_verified: 'verified',
        ctfmr_verified_date: Date.new(2021, 5, 23),
        violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 }
      },
      incident_id: incident.id
    )
  end

  it 'return data for verified information indicator' do
    data = ManagedReports::Indicators::VerifiedInformationViolations.build(
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
        { 'id' => 'attack_on_hospitals', 'total' => 1 },
        { 'id' => 'denial_humanitarian_access', 'total' => 1 },
        { 'id' => 'attack_on_schools', 'total' => 1 }
      ]
    )
  end
end
