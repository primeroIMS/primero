# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::LateVerification do
  before do
    travel_to Time.zone.local(2022, 6, 30, 11, 30, 44)

    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.new(2022, 1, 23), status: 'open' })
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 6, 29), status: 'open' })
    incident2 = Incident.create!(data: { incident_date: Date.new(2021, 10, 21), status: 'open' })

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 },
              ctfmr_verified: 'verified' },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 5, 'total': 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 7, 1) },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 0, 'total': 3 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 1, 1) },
      incident_id: incident2.id
    )
  end

  after do
    travel_back
  end

  it 'return data for late verification indicator' do
    data = ManagedReports::Indicators::LateVerification.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: '2022-07-01',
          to: '2022-07-30'
        )
      }
    ).data

    expect(data).to match_array(
      [
        { group_id: 'boys', data: [{ id: 'maiming', total: 2 }] },
        { group_id: 'girls', data: [{ id: 'maiming', total: 3 }] },
        { group_id: 'unknown', data: [{ id: 'maiming', total: 2 }] },
        { group_id: 'total', data: [{ id: 'maiming', total: 7 }] }
      ]
    )
  end

  it 'return data for late verification indicator' do
    data = ManagedReports::Indicators::LateVerification.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: '2022-01-01',
          to: '2022-01-01'
        )
      }
    ).data

    expect(data).to match_array(
      [
        { group_id: 'boys', data: [{ id: 'maiming', total: 1 }] },
        { group_id: 'girls', data: [{ id: 'maiming', total: 2 }] },
        { group_id: 'unknown', data: [{ id: 'maiming', total: 0 }] },
        { group_id: 'total', data: [{ id: 'maiming', total: 3 }] }
      ]
    )
  end
end
