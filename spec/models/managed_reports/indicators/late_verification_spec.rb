# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::LateVerification do
  before do
    travel_to Time.zone.local(2022, 6, 30, 11, 30, 44)

    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.new(2022, 1, 23), status: 'open' })
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 6, 29), status: 'open' })
    incident2 = Incident.create!(data: { incident_date: Date.new(2021, 10, 21), status: 'open' })

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 },
              ctfmr_verified: 'verified' },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 5, 'total' => 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 7, 1) },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 0, 'total' => 3 },
              ctfmr_verified: 'verified', ctfmr_verified_date: Date.new(2022, 1, 1) },
      incident_id: incident2.id
    )
  end

  after do
    travel_back
  end

  it 'return data for late verification indicator' do
    common_query = %w[
      violation_with_verification_status=maiming_verified
      has_late_verified_violations=true
      ctfmr_verified_date=2022-07-01..2022-07-30
    ]

    data = ManagedReports::Indicators::LateVerification.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-07-01'),
          to: Date.parse('2022-07-30')
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          group_id: 'boys',
          data: [
            { id: 'maiming', total: { count: 2, query: %w[child_types=boys] + common_query } }
          ]
        },
        {
          group_id: 'girls',
          data: [
            { id: 'maiming', total: { count: 3, query: %w[child_types=girls] + common_query } }
          ]
        },
        {
          group_id: 'unknown',
          data: [
            { id: 'maiming', total: { count: 2, query: %w[child_types=unknown] + common_query } }
          ]
        },
        {
          group_id: 'total',
          data: [
            { id: 'maiming', total: { count: 7, query: common_query } }
          ]
        }
      ]
    )
  end

  it 'return data for late verification indicator' do
    common_query = %w[
      violation_with_verification_status=maiming_verified
      has_late_verified_violations=true
      ctfmr_verified_date=2022-01-01..2022-01-01
    ]

    data = ManagedReports::Indicators::LateVerification.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-01-01'),
          to: Date.parse('2022-01-01')
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          group_id: 'boys',
          data: [
            { id: 'maiming', total: { count: 1, query: %w[child_types=boys] + common_query } }
          ]
        },
        {
          group_id: 'girls',
          data: [
            { id: 'maiming', total: { count: 2, query: %w[child_types=girls] + common_query } }
          ]
        },
        {
          group_id: 'unknown',
          data: [
            { id: 'maiming', total: { count: 0, query: %w[child_types=unknown] + common_query } }
          ]
        },
        {
          group_id: 'total',
          data: [
            { id: 'maiming', total: { count: 3, query: common_query } }
          ]
        }
      ]
    )
  end
end
