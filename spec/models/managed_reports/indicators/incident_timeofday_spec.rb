require 'rails_helper'

describe ManagedReports::Indicators::IncidentTimeofday do
  before do
    clean_data(Incident)

    Incident.create!(data: { incident_date: Date.new(2020, 8, 12), incident_timeofday: 'morning' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 8), incident_timeofday: 'afternoon' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 10), incident_timeofday: 'evening_night' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 12), incident_timeofday: 'afternoon' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 8), incident_timeofday: 'unknown' })
  end

  it 'returns the number of incidents grouped by incident_timeofday' do
    data = ManagedReports::Indicators::IncidentTimeofday.build.data

    expect(data).to match_array(
      [
        { 'id' => 'morning', 'total' => 1 },
        { 'id' => 'evening_night', 'total' => 1 },
        { 'id' => 'unknown', 'total' => 1 },
        { 'id' => 'afternoon', 'total' => 2 }
      ]
    )
  end
end
