# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::AttackType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })

    Violation.create!(
      data: {
        type: 'killing',
        attack_type: 'aerial_attack',
        violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'maiming', attack_type: 'aerial_attack',
        violation_tally: { 'boys': 3, 'girls': 2, 'unknown': 1, 'total': 6 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'killing', attack_type: 'arson', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        type: 'killing', attack_type: 'arson', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 0, 'total': 2 }
      },
      incident_id: incident.id
    )
    Violation.create!(
      data: {
        attack_type: 'other', violation_tally: { 'boys': 5, 'girls': 10, 'unknown': 5, 'total': 20 }
      },
      incident_id: incident.id
    )
  end

  it 'returns data for attack type indicator' do
    attack_type_data = ManagedReports::Indicators::AttackType.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
    ).data

    expect(attack_type_data).to match_array(
      [
        { boys: 1, girls: 1, id: 'aerial_attack', total: 3, unknown: 1 },
        { boys: 2, girls: 2, id: 'arson', total: 5, unknown: 1 }
      ]
    )
  end
end
