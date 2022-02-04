require 'rails_helper'

describe ManagedReports::Indicators::ElapsedReportingTimeRape do
  before do
    clean_data(Incident)

    Incident.create!(
      data: {
        incident_date: Date.new(2020, 8, 10),
        date_of_first_report: Date.new(2020, 8, 12),
        gbv_sexual_violence_type: 'rape'
      }
    )
    Incident.create!(
      data: {
        incident_date: Date.new(2020, 9, 3),
        date_of_first_report: Date.new(2020, 9, 8),
        gbv_sexual_violence_type: 'rape'
      }
    )
    Incident.create!(
      data: {
        incident_date: Date.new(2020, 9, 9),
        date_of_first_report: Date.new(2020, 9, 10),
        gbv_sexual_violence_type: 'rape'
      }
    )
    Incident.create!(
      data: {
        incident_date: Date.new(2020, 8, 12),
        date_of_first_report: Date.new(2020, 9, 12),
        gbv_sexual_violence_type: 'rape'
      }
    )
    Incident.create!(
      data: {
        incident_date: Date.new(2020, 8, 8),
        date_of_first_report: Date.new(2020, 10, 8)
      }
    )
  end

  it 'returns the number of incidents grouped by elapsed_reporting_time and gbv_sexual_violence_type is rape' do
    data = ManagedReports::Indicators::ElapsedReportingTimeRape.build.data

    expect(data).to match_array(
      [
        { 'id' => '0_3_days', 'total' => 2 },
        { 'id' => '4_5_days', 'total' => 1 },
        { 'id' => 'over_1_month', 'total' => 1 }
      ]
    )
  end
end
