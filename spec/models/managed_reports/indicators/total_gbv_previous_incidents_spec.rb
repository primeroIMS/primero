require 'rails_helper'

describe ManagedReports::Indicators::TotalGBVPreviousIncidents do
  before do
    clean_data(Incident)

    Incident.create!(data: { incident_date: Date.new(2020, 8, 12), gbv_previous_incidents: true })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 8), gbv_previous_incidents: true })
    Incident.create!(incident_date: Date.new(2020, 10, 10))
  end

  it 'returns the total number of incidents with previous incidents' do
    total_incidents = ManagedReports::Indicators::TotalGBVPreviousIncidents.build.data

    expect(total_incidents).to eq(2)
  end

  it 'returns the total number of incidents with previous incidents for the incident_date range' do
    total_incidents = ManagedReports::Indicators::TotalGBVPreviousIncidents.build(
      nil,
      [
        SearchFilters::DateRange.new(field_name: 'incident_date', from: '2020-09-01', to: '2020-10-15')
      ]
    ).data

    expect(total_incidents).to eq(1)
  end
end
