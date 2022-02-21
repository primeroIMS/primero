require 'rails_helper'

describe ManagedReports::Indicators::TotalGBVSexualViolence do
  before do
    clean_data(Incident)

    Incident.create!(data: { incident_date: Date.new(2020, 8, 12), gbv_sexual_violence_type: 'rape' })
    Incident.create!(data: { incident_date: Date.new(2020, 9, 8), gbv_sexual_violence_type: 'sexual_assault' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 10), gbv_sexual_violence_type: 'forced_marriage' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 10), gbv_sexual_violence_type: 'non-gbv' })
    Incident.create!(data: { incident_date: Date.new(2020, 10, 10) })
  end

  it 'returns the total number of incidents with a gbv_sexual_violence_type' do
    total_incidents = ManagedReports::Indicators::TotalGBVSexualViolence.build.data

    expect(total_incidents).to eq(3)
  end
end
