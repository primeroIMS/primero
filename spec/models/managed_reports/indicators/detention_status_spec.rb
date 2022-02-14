# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::DetentionStatus do
  before do
    clean_data(Incident, Violation, IndividualVictim)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })
    violation1 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 3, 'total': 6 } },
      incident_id: incident.id
    )
    violation1.individual_victims = [
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'true',
          length_deprivation_liberty: Date.today.beginning_of_month - 1.week,
          deprivation_liberty_end: Date.today
        }
      )
    ]
    violation2 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
      incident_id: incident.id
    )
    violation2.individual_victims = [
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'true',
          length_deprivation_liberty: Date.today.beginning_of_month - 1.month,
          deprivation_liberty_end: Date.today - 3.days
        }
      )
    ]
    violation3 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 1, 'unknown': 2, 'total': 5 } },
      incident_id: incident.id
    )
    violation3.individual_victims = [
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'true',
          length_deprivation_liberty: Date.today.beginning_of_month
        }
      )
    ]
    violation4 = Violation.create!(
      data: { type: 'killing', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
    violation4.individual_victims = [
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'true',
          length_deprivation_liberty: Date.today.beginning_of_month,
          deprivation_liberty_end: Date.today + 3.days
        }
      ),
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'true',
          length_deprivation_liberty: Date.today,
          deprivation_liberty_end: Date.today + 3.days
        }
      )
    ]
    violation5 = Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
    violation5.individual_victims = [
      IndividualVictim.create!(
        data: {
          victim_deprived_liberty_security_reasons: 'false',
          length_deprivation_liberty: Date.today.beginning_of_year
        }
      )
    ]
  end

  it 'returns data for violation tally indicator' do
    violation_tally_data = ManagedReports::Indicators::DetentionStatus.build(
      nil
    ).data

    expect(violation_tally_data).to match_array(
      [{ 'count' => 3, 'status' => 'detained' }, { 'count' => 2, 'status' => 'released' }]
    )
  end
end
