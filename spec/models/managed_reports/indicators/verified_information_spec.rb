# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::VerifiedInformation do
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

    Violation.create!(
      data: {
        type: 'killing', ctfmr_verified: 'verified',
        violation_tally: { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 },
        ctfmr_verified_date: Date.new(2021, 5, 23)
      },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'abduction', ctfmr_verified: 'verified',
              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 5, 'total': 8 },
              ctfmr_verified_date: Date.new(2022, 4, 4) },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'abduction', ctfmr_verified: 'verified',
              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 7, 'total': 10 },
              ctfmr_verified_date: Date.new(2021, 7, 4) },
      incident_id: incident2.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 },
              ctfmr_verified_date: Date.new(2021, 5, 23) },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 10, 'girls': 20, 'unknown': 30, 'total': 60 },
              ctfmr_verified_date: Date.new(2021, 5, 23), is_late_verification: true },
      incident_id: incident.id
    )
  end

  it 'return data for verified information indicator' do
    data = ManagedReports::Indicators::VerifiedInformation.build(
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
        { group_id: 'boys', data: [{ id: 'abduction', total: 1 }] },
        { group_id: 'girls', data: [{ id: 'abduction', total: 2 }] },
        { group_id: 'unknown', data: [{ id: 'abduction', total: 5 }] },
        { group_id: 'total', data: [{ id: 'abduction', total: 8 }] }
      ]
    )
  end

  it 'return data for verified information for multiple quarters' do
    data = ManagedReports::Indicators::VerifiedInformation.build(
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
      [{ group_id: 'boys', data: [{ id: 'abduction', total: 2 }, { id: 'killing', total: 2 }] },
       { group_id: 'girls', data: [{ id: 'abduction', total: 4 }, { id: 'killing', total: 0 }] },
       { group_id: 'unknown', data: [{ id: 'abduction', total: 12 }, { id: 'killing', total: 2 }] },
       { group_id: 'total', data: [{ id: 'abduction', total: 18 }, { id: 'killing', total: 4 }] }]
    )
  end
end
