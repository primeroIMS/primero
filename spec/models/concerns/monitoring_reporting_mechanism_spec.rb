# frozen_string_literal: true

require 'rails_helper'

describe MonitoringReportingMechanism do
  let(:incident_1) do
    Incident.create!(
      violations: [
        Violation.new(
          type: 'killing',
          individual_victims:
          [
            IndividualVictim.new(
              data: {
                individual_age: 10,
                individual_sex: 'male',
                victim_deprived_liberty_security_reasons: 'yes',
                reasons_deprivation_liberty: 'reason_1',
                facilty_victims_held: 'facility_1',
                torture_punishment_while_deprivated_liberty: 'no'
              }
            )
          ]
        ),
        Violation.new(
          type: 'killing',
          individual_victims:
          [
            IndividualVictim.new(
              data: {
                individual_age: 3,
                individual_sex: 'male',
                victim_deprived_liberty_security_reasons: 'unknown',
                reasons_deprivation_liberty: 'reason_2',
                facilty_victims_held: 'facility_2',
                torture_punishment_while_deprivated_liberty: 'yes'
              }
            )
          ]
        ),
        Violation.new(
          type: 'maiming',
          individual_victims:
          [
            IndividualVictim.new(
              data: {
                individual_age: 15,
                individual_sex: 'female',
                victim_deprived_liberty_security_reasons: 'no',
                reasons_deprivation_liberty: nil,
                facilty_victims_held: 'facility_1',
                torture_punishment_while_deprivated_liberty: 'yes'
              }
            )
          ]
        )
      ]
    )
  end

  it 'returns the violation type for the individual victims' do
    expect(incident_1.individual_victims_violation_types).to match_array(%w[killing maiming])
  end

  it 'returns the age for the individual victims' do
    expect(incident_1.individual_victims_age).to match_array([10, 3, 15])
  end

  it 'returns the sex for the individual victims' do
    expect(incident_1.individual_victims_sex).to match_array(%w[male female])
  end

  it 'returns the victim_deprived_liberty_security_reasons for the individual victims' do
    expect(incident_1.individual_victims_deprived_liberty_security_reasons).to match_array(%w[yes no unknown])
  end

  it 'returns the reasons_deprivation_liberty for the individual victims' do
    expect(incident_1.individual_victims_reasons_deprivation_liberty).to match_array(%w[reason_1 reason_2])
  end

  it 'returns the facilty_victims_held for the individual victims' do
    expect(incident_1.individual_victims_facilty_victims_held).to match_array(%w[facility_1 facility_2])
  end

  it 'returns the torture_punishment_while_deprivated_liberty for the individual victims' do
    expect(incident_1.individual_victims_torture_punishment_while_deprivated_liberty).to match_array(%w[yes no])
  end
end
