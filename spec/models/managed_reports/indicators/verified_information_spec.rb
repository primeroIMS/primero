# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::VerifiedInformation do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.new(2021, 5, 23), status: 'open' })
    incident1 = Incident.create!(data: { incident_date: Date.new(2022, 4, 4), status: 'open' })

    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 0, 'unknown': 2, 'total': 4 } },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', ctfmr_verified: 'verified',
              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 5, 'total': 8 } },
      incident_id: incident1.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
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
          from: '2021-04-01',
          to: '2022-06-10'
        )
      }
    ).data

    expect(data).to match_array(
      [
        { group_id: 'boys', data: [{ id: 'denial_humanitarian_access', total: 1 }] },
        { group_id: 'girls', data: [{ id: 'denial_humanitarian_access', total: 2 }] },
        { group_id: 'unknown', data: [{ id: 'denial_humanitarian_access', total: 5 }] },
        { group_id: 'total', data: [{ id: 'denial_humanitarian_access', total: 8 }] }
      ]
    )
  end
end
