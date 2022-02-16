# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ViolationTallyDetention do
  before do
    clean_data(Incident, Violation, IndividualVictim)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })
    violation1 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 3, 'total': 6 } },
      incident_id: incident.id
    )
    violation1.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation2 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
      incident_id: incident.id
    )
    violation2.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation3 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 1, 'unknown': 2, 'total': 5 } },
      incident_id: incident.id
    )
    violation3.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation4 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
    violation4.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]
    violation5 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
    violation5.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'false' })
    ]
  end

  it 'returns data for violation tally indicator' do
    violation_tally_data = ManagedReports::Indicators::ViolationTallyDetention.build(
      nil
    ).data

    expect(violation_tally_data).to eq(
      { 'boys' => 6, 'girls' => 7, 'total' => 21, 'unknown' => 8 }
    )
  end
end
