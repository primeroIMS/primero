# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ViolationTally do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })
    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 3, 'total': 6 } },
      incident_id: incident.id
    )
    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
      incident_id: incident.id
    )
    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 1, 'unknown': 2, 'total': 5 } },
      incident_id: incident.id
    )
    Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
  end

  it 'returns data for violation tally indicator' do
    violation_tally_data = ManagedReports::Indicators::ViolationTally.build(
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
    ).data

    expect(violation_tally_data).to eq(
      { 'boys' => 4, 'girls' => 6, 'total' => 16, 'unknown' => 6 }
    )
  end
end
