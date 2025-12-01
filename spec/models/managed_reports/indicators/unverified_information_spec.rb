# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::UnverifiedInformation do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(
      data: { incident_date: Date.new(2021, 5, 23), date_of_first_report: Date.new(2021, 5, 23), status: 'open' }
    )
    incident1 = Incident.create!(
      data: { incident_date: Date.new(2022, 4, 4), date_of_first_report: Date.new(2022, 4, 4), status: 'open' }
    )
    incident2 = Incident.create!(
      data: { incident_date: Date.new(2021, 7, 4), date_of_first_report: Date.new(2021, 7, 4), status: 'open' }
    )
    incident3 = Incident.create!(
      data: { incident_date: Date.new(2021, 7, 10), date_of_first_report: Date.new(2021, 7, 10), status: 'closed' }
    )

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys' => 2, 'girls' => 0, 'unknown' => 2, 'total' => 4 },
              ctfmr_verified: 'reported_not_verified' },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'abduction', ctfmr_verified: 'report_pending_verification',
              violation_tally: { 'boys' => 1, 'girls' => 2, 'unknown' => 5, 'total' => 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'deprivation_liberty', ctfmr_verified: 'reported_not_verified',
              violation_tally: { 'boys' => 3, 'girls' => 2, 'unknown' => 4, 'total' => 9 } },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'abduction', ctfmr_verified: 'reported_not_verified',
              violation_tally: { 'boys' => 3, 'girls' => 2, 'unknown' => 4, 'total' => 9 } },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 2, 'total' => 7 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys' => 2, 'girls' => 3, 'unknown' => 1, 'total' => 6 } },
      incident_id: incident3.id
    )
  end

  it 'return data for unverified information indicator' do
    common_query = %w[
      violation_with_verification_status=abduction_report_pending_verification
      incident_date=2022-01-01..2022-06-10
    ]

    data = ManagedReports::Indicators::UnverifiedInformation.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-01-01'),
          to: Date.parse('2022-06-10')
        )
      }
    ).data

    expect(data).to match_array(
      [
        {
          group_id: 'boys',
          data: [
            { id: 'abduction', total: { count: 1, query: %w[child_types=boys] + common_query } }
          ]
        },
        {
          group_id: 'girls',
          data: [
            { id: 'abduction', total: { count: 2, query: %w[child_types=girls] + common_query } }
          ]
        },
        {
          group_id: 'unknown',
          data: [
            { id: 'abduction', total: { count: 5, query: %w[child_types=unknown] + common_query } }
          ]
        },
        {
          group_id: 'total',
          data: [
            { id: 'abduction', total: { count: 8, query: common_query } }
          ]
        }
      ]
    )
  end

  it 'return data for unverified information for multiple quarters' do
    abduction_query = %w[
      violation_with_verification_status=abduction_report_pending_verification
      incident_date=2021-04-01..2022-06-10
    ]

    killing_query = %w[
      violation_with_verification_status=killing_report_pending_verification
      incident_date=2021-04-01..2022-06-10
    ]

    data = ManagedReports::Indicators::UnverifiedInformation.build(
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
          group_id: 'boys',
          data: [
            { id: 'abduction', total: { count: 4, query: %w[child_types=boys] + abduction_query } },
            { id: 'killing', total: { count: 2, query: %w[child_types=boys] + killing_query } }
          ]
        },
        {
          group_id: 'girls',
          data: [
            { id: 'abduction', total: { count: 4, query: %w[child_types=girls] + abduction_query } },
            { id: 'killing', total: { count: 0, query: %w[child_types=girls] + killing_query } }
          ]
        },
        {
          group_id: 'unknown',
          data: [
            { id: 'abduction', total: { count: 9, query: %w[child_types=unknown] + abduction_query } },
            { id: 'killing', total: { count: 2, query: %w[child_types=unknown] + killing_query } }
          ]
        },
        {
          group_id: 'total',
          data: [
            { id: 'abduction', total: { count: 17, query: abduction_query } },
            { id: 'killing', total: { count: 4, query: killing_query  } }
          ]
        }
      ]
    )
  end
end
