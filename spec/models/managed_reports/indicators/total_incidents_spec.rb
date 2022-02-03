require 'rails_helper'

describe ManagedReports::Indicators::TotalIncidents do
  before do
    clean_data(Incident)

    Incident.create!(incident_date: Date.new(2020, 8, 12), date_of_first_report: Date.new(2020, 8, 10))
    Incident.create!(incident_date: Date.new(2020, 9, 8), date_of_first_report: Date.new(2020, 9, 8))
    Incident.create!(incident_date: Date.new(2020, 10, 10), date_of_first_report: Date.new(2020, 10, 5))
  end

  it 'returns the total number of incidents' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build.data

    expect(total_incidents).to eq(3)
  end

  it 'returns the total number of incidents for the incident_date range' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build(
      nil,
      [
        SearchFilters::DateRange.new(field_name: 'incident_date', from: '2020-08-01', to: '2020-09-30')
      ]
    ).data

    expect(total_incidents).to eq(2)
  end

  it 'returns the total number of incidents for the date_of_first_report range' do
    total_incidents = ManagedReports::Indicators::TotalIncidents.build(
      nil,
      [
        SearchFilters::DateRange.new(field_name: 'date_of_first_report', from: '2020-09-01', to: '2020-10-10')
      ]
    ).data

    expect(total_incidents).to eq(2)
  end
end
