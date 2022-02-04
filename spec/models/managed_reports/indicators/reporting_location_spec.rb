# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ReportingLocation do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'US' })
    incident2 = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'USE1' })
    incident3 = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'USE2' })

    Violation.create!(data: { type: 'killing' }, incident_id: incident.id)
    Violation.create!(data: { type: 'killing' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'maiming' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'killing' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'abduction' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'killing' }, incident_id: incident3.id)
  end

  it 'returns data for reporting location indicator' do
    reporting_location_data = ManagedReports::Indicators::ReportingLocation.build(
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
    ).data

    expect(reporting_location_data).to eq(
      [{ 'id' => 'US', 'total' => 1 }, { 'id' => 'USE1', 'total' => 1 }, { 'id' => 'USE2', 'total' => 2 }]
    )
  end
end
