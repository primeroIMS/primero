# frozen_string_literal: true

require 'rails_helper'

describe MonitoringReportingMechanism, search: true do
  let(:user_1) do
    primero_module = PrimeroModule.new(name: 'CP')

    role = Role.new(permissions: [], modules: [primero_module])
    role.save(validate: false)

    group1 = UserGroup.create!(name: 'Group1')

    user = User.new(user_name: 'user1', role: @role, user_groups: [group1])
    user.save(validate: false)
    user
  end

  let(:incident_1) do
    incident1 = Incident.new_with_user(
      user_1,
      {
        'incident_date' => '2022-04-08',
        'killing' => [
          {
            'unique_id' => 'b23b70de-9132-4c89-be8d-57e85a69ec68',
            'ctfmr_verified' => 'verified',
            'ctfmr_verified_date' => Date.today.beginning_of_quarter,
            'verified_ghn_reported' => ['2022-q2'],
            'type' => 'killing'
          }
        ],
        'perpetrators' => [
          {
            'unique_id' => 'a32b70de-9132-4c89-be8d-67e85a69ec68',
            'armed_force_group_party_name' => 'armed_force_1',
            'violations_ids' => ['b23b70de-9132-4c89-be8d-57e85a69ec68']
          }
        ],
        'individual_victims' => [
          {
            'unique_id' => 'c32b70de-9132-4c89-be8d-77e85a69ec68',
            'individual_age' => 10,
            'individual_sex' => 'male',
            'victim_deprived_liberty_security_reasons' => 'yes',
            'reasons_deprivation_liberty' => 'reason_1',
            'facilty_victims_held' => 'facility_1',
            'torture_punishment_while_deprivated_liberty' => 'no',
            'violations_ids' => ['b23b70de-9132-4c89-be8d-57e85a69ec68']
          }
        ]
      }
    )
    incident1.save!
    incident1
  end

  let(:incident_2) do
    incident2 = Incident.new_with_user(
      user_1,
      {
        'killing' => [
          {
            'unique_id' => 'f37ccb6e-9f85-473e-890e-7037e8ece397',
            'verified_ghn_reported' => ['2022-q1'],
            'type' => 'killing'
          }
        ],
        'maiming' => [
          'unique_id' => '5255e66c-5e57-4291-af2a-0acd50c1de72',
          'type' => 'maiming'
        ],
        'perpetrators' => [
          {
            'armed_force_group_party_name' => 'other',
            'violations_ids' => ['f37ccb6e-9f85-473e-890e-7037e8ece397']
          }
        ],
        'individual_victims' => [
          {
            'individual_age' => 3,
            'individual_sex' => 'male',
            'victim_deprived_liberty_security_reasons' => 'unknown',
            'reasons_deprivation_liberty' => 'reason_2',
            'facilty_victims_held' => 'facility_2',
            'torture_punishment_while_deprivated_liberty' => 'yes',
            'violations_ids' => ['f37ccb6e-9f85-473e-890e-7037e8ece397']
          },
          {
            'individual_age' => 15,
            'individual_sex' => 'female',
            'victim_deprived_liberty_security_reasons' => 'no',
            'reasons_deprivation_liberty' => nil,
            'facilty_victims_held' => 'facility_1',
            'torture_punishment_while_deprivated_liberty' => 'yes',
            'violations_ids' => ['5255e66c-5e57-4291-af2a-0acd50c1de72']
          }
        ]
      }
    )
    incident2.save!
    incident2
  end

  let(:incident_3) do
    incident3 = Incident.new_with_user(
      user_1,
      {
        'killing' => [
          { 'type' => 'killing', 'ctfmr_verified' => 'not_mrm' }
        ],
        'maiming' => [
          { 'type' => 'maiming', 'ctfmr_verified' => 'report_pending_verification' },
          { 'type' => 'maiming', 'ctfmr_verified' => 'report_pending_verification' }
        ]
      }
    )
    incident3.save!
    incident3
  end

  before do
    clean_data(User, UserGroup, Role, PrimeroModule, Incident, Violation, IndividualVictim)
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

  it 'can find an incident by armed_force_group_party_names' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'armed_force_group_party_names', value: 'other')
      ]
    ).results
    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_2.id)
  end

  it 'can find an incident by verified_ghn_reported' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::ValueList.new(field_name: 'verified_ghn_reported', values: %w[2022-q1 2022-q2])
      ],
      sort: { 'short_id': 'asc' }
    ).results

    expect(search_result.size).to eq(2)
    expect(search_result.map(&:id)).to match_array([incident_1.id, incident_2.id])
  end

  it 'can find an incident with a late verified violation' do
    search_result = SearchService.search(
      Incident,
      filters: [
        SearchFilters::ValueList.new(field_name: 'late_verified_violations', values: %w[killing])
      ],
      sort: { 'short_id': 'asc' }
    ).results

    expect(search_result.size).to eq(1)
    expect(search_result.first.id).to eq(incident_1.id)
  end
end
