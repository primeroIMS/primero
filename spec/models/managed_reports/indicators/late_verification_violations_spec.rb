# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::LateVerificationViolations do
  before do
    travel_to Time.zone.local(2022, 6, 30, 11, 30, 44)

    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.new(2022, 1, 23), status: 'open' })
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 5, 4), status: 'open' })
    incident2 = Incident.create!(data: {
                                   incident_date: Date.new(2022, 1, 23),
                                   incident_date_end: Date.new(2022, 1, 28),
                                   status: 'open',
                                   is_incident_date_range: true
                                 })
    incident3 = Incident.create!(data: {
                                   incident_date: Date.new(2022, 1, 23),
                                   status: 'open',
                                   is_incident_date_range: true
                                 })

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 },
              ctfmr_verified: 'verified' },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', violation_tally: { 'boys': 2, 'girls': 30, 'unknown': 2, 'total': 34 },
              ctfmr_verified: 'verified' },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'attack_on_schools', ctfmr_verified: 'verified',
              ctfmr_verified_date: Date.new(2022, 5, 1),
              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 5, 'total': 8 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 5, 1) },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 5, 23) },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 5, 1) },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'attack_on_hospitals', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 5, 1) },
      incident_id: incident3.id
    )
  end

  after do
    travel_back
  end

  it 'return data for late verification indicator' do
    data = ManagedReports::Indicators::LateVerificationViolations.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: '2021-05-01',
          to: '2022-05-31'
        )
      }
    ).data

    expect(data).to match_array(
      [{ 'id' => 'attack_on_hospitals', 'total' => 3 }, { 'id' => 'attack_on_schools', 'total' => 1 }]
    )
  end
end
