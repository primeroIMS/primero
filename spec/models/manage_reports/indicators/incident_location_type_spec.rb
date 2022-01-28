require 'rails_helper'

describe ManagedReports::Indicators::IncidentLocationType do
  before do
    clean_data(Incident)

    Incident.create!(data: { incident_date: Date.new(2020, 8, 12), incident_location_type: 'forest' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 8), incident_location_type: 'school' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 10), incident_location_type: 'road' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 12), incident_location_type: 'road' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 8), incident_location_type: 'farm' })
  end

  it 'returns the number of incidents grouped by incident_location_type' do
    data = ManagedReports::Indicators::IncidentLocationType.build.data

    expect(data).to match_array(
      [
        { 'id' => 'farm', 'total' => 1 },
        { 'id' => 'forest', 'total' => 1 },
        { 'id' => 'road', 'total' => 2 },
        { 'id' => 'school', 'total' => 1 }
      ]
    )
  end
end
