# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::SexualViolenceType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })
    Violation.create!(
      data: {
        type: 'sexual_violence', sexual_violence_type: %w[rape],
        violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 3, 'total': 6 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'sexual_violence', sexual_violence_type: %w[
          forced_abortion
          forced_marriage
        ],
        violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'sexual_violence', sexual_violence_type: [
          'rape'
        ],
        violation_tally: { 'boys': 2, 'girls': 1, 'unknown': 2, 'total': 5 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'sexual_violence', sexual_violence_type: %w[
          forced_abortion
          rape
        ],
        violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'killing', sexual_violence_type: [
          'forced_abortion'
        ],
        violation_tally: { 'boys': 2, 'girls': 4, 'unknown': 3, 'total': 9 }
      },
      incident_id: incident.id
    )
  end

  it 'returns data for attack type indicator' do
    sexual_violence_type = ManagedReports::Indicators::SexualViolenceType.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'sexual_violence') }
    ).data
    # binding.pry
    expect(sexual_violence_type).to match_array(
      [
        { 'total' => 18, 'unknown' => 7, 'boys' => 5, 'girls' => 6, :id => 'rape' },
        { 'boys' => 3, 'girls' => 4, 'unknown' => 3, 'total' => 10, :id => 'forced_abortion' },
        { 'total' => 3, 'girls' => 1, 'unknown' => 1, 'boys' => 1, :id => 'forced_marriage' }
      ]
    )
  end
end
