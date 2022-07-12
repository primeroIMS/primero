# frozen_string_literal: true

require 'rails_helper'

describe MonitoringReportingMechanism, search: true do
  before do
    clean_data(Incident, Violation, IndividualVictim)
  end

  let(:incident_1) do
    Incident.create!(
      data: { incident_date: '2022-04-08' },
      violations: [
        Violation.new(
          data: {
            type: 'killing',
            ctfmr_verified: 'verified'
          },
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
        )
      ]
    )
  end

  let(:incident_2) do
    Incident.create!(
      violations: [
        Violation.new(
          data: { type: 'killing' },
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
          data: { type: 'maiming' },
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

  let(:incident_3) do
    Incident.create!(
      violations: [
        Violation.new(data: { type: 'killing', ctfmr_verified: 'not_mrm' }),
        Violation.new(data: { type: 'maiming', ctfmr_verified: 'report_pending_verification' }),
        Violation.new(data: { type: 'maiming', ctfmr_verified: 'report_pending_verification' })
      ]
    )
  end

  before do
    clean_data(Incident, Violation)
    incident_1
    incident_2
    incident_3
    Incident.reindex
    Sunspot.commit
  end

  it 'can find incidents where individual victims are linked to a violation type' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'individual_violations', value: 'maiming')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_2.id)
  end

  it 'can find incidents where individual victims have an age' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'individual_age', value: '10')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_1.id)
  end

  it 'contains the violations with verification status' do
    expect(incident_3.violation_with_verification_status).to match_array(
      %w[
        killing_not_mrm maiming_report_pending_verification
      ]
    )
  end

  it 'can find an incident with a violation of type killing and verified' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'violation_with_verification_status', value: 'killing_verified')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_1.id)
  end

  it 'can find incidents where individual victims have a sex' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'individual_sex', value: 'female')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_2.id)
  end

  it 'can find incidents where individual victims have a victim_deprived_liberty_security_reasons' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'victim_deprived_liberty_security_reasons', value: 'unknown')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_2.id)
  end

  it 'can find incidents where individual victims have a reasons_deprivation_liberty' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'reasons_deprivation_liberty', value: 'reason_1')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_1.id)
  end

  it 'can find incidents where individual victims have a facilty_victims_held' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'victim_facilty_victims_held', value: 'facility_2')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_2.id)
  end

  it 'can find incidents where individual victims have a torture_punishment_while_deprivated_liberty' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(
          field_name: 'torture_punishment_while_deprivated_liberty', value: 'no'
        )
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_1.id)
  end

  it 'can find an incident with a violation of type maiming and report_pending_verification' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(
          field_name: 'violation_with_verification_status', value: 'maiming_report_pending_verification'
        )
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_3.id)
  end

  it 'can find an incident by verification_status' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'verification_status', value: 'not_mrm')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_3.id)
  end
end
