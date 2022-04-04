# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorsDenials do
  before do
    clean_data(Incident, Violation, Perpetrator,)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })

    violation1 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'arson' }, incident_id: incident.id
    )
    violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation2 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'aerial_attack' }, incident_id: incident.id
    )
    violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident.id)
    violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_3' })]

    violation4 = Violation.create!(
      data: { type: 'denial_humanitarian_access', attack_type: 'arson' }, incident_id: incident.id
    )
    violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_4' })]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::PerpetratorsDenials.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(perpetrators_data).to match_array(
      [
        { id: 'armed_force_2', total: 2 },
        { id: 'armed_force_4', total: 1 }
      ]
    )
  end
end
