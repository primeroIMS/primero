# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorsDetention do
  before do
    clean_data(Incident, Violation, Perpetrator, IndividualVictim)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })

    violation1 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident.id)
    violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]
    violation1.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation2 = Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack' }, incident_id: incident.id)
    violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]
    violation2.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident.id)
    violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_3' })]
    violation3.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation4 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident.id)
    violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_4' })]
    violation4.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'false' })
    ]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(
      nil
    ).data

    expect(perpetrators_data).to match_array(
      [{ 'id' => 'armed_force_2', 'total' => 2 }, { 'id' => 'armed_force_3', 'total' => 1 }]
    )
  end
end
