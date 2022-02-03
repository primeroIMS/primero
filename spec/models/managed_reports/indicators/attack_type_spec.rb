# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::AttackType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })

    Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack' }, incident_id: incident.id)
    Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident.id)
    Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident.id)
    Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident.id)
    Violation.create!(data: { attack_type: 'other' }, incident_id: incident.id)
  end

  it 'returns data for attack type indicator' do
    attack_type_data = ManagedReports::Indicators::AttackType.build(
      nil,
      [
        SearchFilters::Value.new(field_name: 'type', value: 'killing')
      ]
    ).data

    expect(attack_type_data).to match_array(
      [
        { 'id' => 'aerial_attack', 'total' => 1 },
        { 'id' => 'arson', 'total' => 2 }
      ]
    )
  end
end
