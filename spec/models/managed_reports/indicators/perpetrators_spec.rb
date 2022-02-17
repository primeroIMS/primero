# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::Perpetrators do
  before do
    clean_data(Incident, Violation, Perpetrator)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })

    violation1 = Violation.create!(data: { type: 'killing', attack_type: 'arson',
                                           violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
                                   incident_id: incident.id)
    violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation2 = Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack',
                                           violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
                                   incident_id: incident.id)
    violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack',
                                           violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 4, 'total': 6 } },
                                   incident_id: incident.id)
    violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_3' })]

    violation4 = Violation.create!(data: { type: 'killing', attack_type: 'arson',
                                           violation_tally: { 'boys': 3, 'girls': 1, 'unknown': 1, 'total': 5 } },
                                   incident_id: incident.id)
    violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_4' })]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::Perpetrators.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
    ).data

    expect(perpetrators_data).to match_array(
      [
        { boys: 2, girls: 2, id: 'armed_force_2', total: 6, unknown: 2 },
        { boys: 3, girls: 1, id: 'armed_force_4', total: 5, unknown: 1 }
      ]
    )
  end
end
