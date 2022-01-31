require 'rails_helper'

describe ManagedReports::Indicators::GBVSexualViolenceType do
  before do
    clean_data(Incident)

    Incident.create!(data: { incident_date: Date.new(2020, 8, 12), gbv_sexual_violence_type: 'rape' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 8), gbv_sexual_violence_type: 'sexual_assault' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 10), gbv_sexual_violence_type: 'physical_assault' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 12), gbv_sexual_violence_type: 'rape' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 8), gbv_sexual_violence_type: 'physical_assault' })
  end

  it 'returns the number of incidents grouped by gbv_sexual_violence_type' do
    data = ManagedReports::Indicators::GBVSexualViolenceType.build.data

    expect(data).to match_array(
      [
        { 'id' => 'physical_assault', 'total' => 2 },
        { 'id' => 'sexual_assault', 'total' => 1 },
        { 'id' => 'rape', 'total' => 2 }
      ]
    )
  end
end
