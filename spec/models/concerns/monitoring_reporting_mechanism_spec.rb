# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe MonitoringReportingMechanism, search: true do
  let(:user1) do
    primero_module = PrimeroModule.new(name: 'CP')

    role = Role.new(permissions: [], modules: [primero_module])
    role.save(validate: false)

    group1 = UserGroup.create!(name: 'Group1')

    user = User.new(user_name: 'user1', role: @role, user_groups: [group1])
    user.save(validate: false)
    user
  end

  let(:incident1) do
    incident1 = Incident.new_with_user(
      user1,
      {
        'incident_date' => '2022-04-08',
        'module_id' => PrimeroModule::MRM,
        'killing' => [
          {
            'unique_id' => 'b23b70de-9132-4c89-be8d-57e85a69ec68',
            'ctfmr_verified' => 'verified',
            'ctfmr_verified_date' => Date.today.beginning_of_quarter,
            'verified_ghn_reported' => '2022-q2',
            'type' => 'killing'
          }
        ],
        'perpetrators' => [
          {
            'unique_id' => 'a32b70de-9132-4c89-be8d-67e85a69ec68',
            'armed_force_group_party_name' => 'armed_force_1',
            'perpetrator_category' => 'crossfire',
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

  let(:incident2) do
    incident2 = Incident.new_with_user(
      user1,
      {
        'module_id' => PrimeroModule::MRM,
        'killing' => [
          {
            'unique_id' => 'f37ccb6e-9f85-473e-890e-7037e8ece397',
            'verified_ghn_reported' => '2022-q1',
            'type' => 'killing',
            'ctfmr_verified_date' => Date.today.end_of_quarter,
            'weapon_type' => 'airstrike'
          }
        ],
        'maiming' => [
          'unique_id' => '5255e66c-5e57-4291-af2a-0acd50c1de72',
          'type' => 'maiming'
        ],
        'perpetrators' => [
          {
            'armed_force_group_party_name' => 'other',
            'perpetrator_category' => 'armed_group',
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

  let(:incident3) do
    incident3 = Incident.new_with_user(
      user1,
      {
        'module_id' => PrimeroModule::MRM,
        'killing' => [
          { 'type' => 'killing', 'ctfmr_verified' => 'not_mrm', 'ctfmr_verified_date' => Date.today.end_of_quarter }
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

  let(:incident4) do
    incident4 = Incident.new_with_user(
      user1,
      {
        'module_id' => PrimeroModule::MRM,
        'military_use' => [
          {
            'type' => 'military_use',
            'facility_impact' => 'total_destruction',
            'military_use_type' => 'military_use_of_school'
          }
        ],
        'recruitment' => [
          { 'type' => 'recruitment', 'child_role' => 'combatant' }
        ],
        'abduction' => [
          { 'type' => 'abduction', 'abduction_purpose_single' => 'extortion' }
        ],
        'killing' => [
          { 'type' => 'abduction', 'weapon_type' => 'baton' }
        ]
      }
    )
    incident4.save!
    incident4
  end

  let(:incident5) do
    incident5 = Incident.new_with_user(
      user1,
      {
        'module_id' => PrimeroModule::MRM,
        'attack_on_hospitals' => [
          {
            'type' => 'attack_on_hospitals',
            'facility_attack_type' => %w[attack_on_medical_personnel threat_of_attack_on_hospital],
            'facility_impact' => 'serious_damage'
          }
        ],
        'denial_humanitarian_access' => [
          { 'type' => 'denial_humanitarian_access', 'types_of_aid_disrupted_denial' => 'food' }
        ]
      }
    )
    incident5.save!
    incident5
  end

  before do
    clean_data(User, UserGroup, Role, PrimeroModule, Incident, Violation, IndividualVictim)
    incident1
    incident2
    incident3
    incident4
    incident5
  end

  it 'can find incidents where individual victims are linked to a violation type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'individual_violations', value: 'maiming')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find incidents where individual victims have an age' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::Value.new(field_name: 'individual_age', value: 10)
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'contains the violations with verification status' do
    expect(incident3.violation_with_verification_status).to match_array(
      %w[
        killing_not_mrm maiming_report_pending_verification
      ]
    )
  end

  it 'can find an incident with a violation of type killing and verified' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'violation_with_verification_status', value: 'killing_verified')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'can find incidents where individual victims have a sex' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'individual_sex', value: 'female')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find incidents where individual victims have a victim_deprived_liberty_security_reasons' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'victim_deprived_liberty_security_reasons', value: 'unknown')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find incidents where individual victims have a reasons_deprivation_liberty' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'reasons_deprivation_liberty', value: 'reason_1')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'can find incidents where individual victims have a facilty_victims_held' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'victim_facilty_victims_held', value: 'facility_2')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find incidents where individual victims have a torture_punishment_while_deprivated_liberty' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'torture_punishment_while_deprivated_liberty', value: 'no'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'can find an incident with a violation of type maiming and report_pending_verification' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'violation_with_verification_status', value: 'maiming_report_pending_verification'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident3.id)
  end

  it 'can find an incident by verification_status' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'verification_status', value: 'not_mrm')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident3.id)
  end

  it 'can find an incident by armed_force_group_party_names' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'armed_force_group_party_names', value: 'other')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find an incident by verified_ghn_reported' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextList.new(field_name: 'verified_ghn_reported', values: %w[2022-q1 2022-q2])
      ],
      sort: { 'short_id' => 'asc' }
    )

    expect(search_result.total).to eq(2)
    expect(search_result.records.map(&:id)).to match_array([incident1.id, incident2.id])
  end

  it 'can find an incident by violation_with_weapon_type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'violation_with_weapon_type', value: 'killing_airstrike')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident2.id)
  end

  it 'can find an incident by violation_with_facility_impact' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'violation_with_facility_impact', value: 'military_use_total_destruction'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident4.id)
  end

  it 'can find an incident by child_role' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'child_role', value: 'combatant')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident4.id)
  end

  it 'can find an incident by abduction_purpose_single' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'abduction_purpose_single', value: 'extortion')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident4.id)
  end

  it 'can find an incident by violation_with_facility_attack_type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'violation_with_facility_attack_type',
          value: 'attack_on_hospitals_attack_on_medical_personnel'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident5.id)
  end

  it 'can find an incident by military_use_type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'military_use_type', value: 'military_use_of_school')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident4.id)
  end

  it 'can find an incident by types_of_aid_disrupted_denial' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'types_of_aid_disrupted_denial', value: 'food')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident5.id)
  end

  it 'can find an incident by facility_attack_type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'facility_attack_type',
          value: 'threat_of_attack_on_hospital'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident5.id)
  end

  it 'can find an incident by facility_impact' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(
          field_name: 'facility_impact',
          value: 'serious_damage'
        )
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident5.id)
  end

  it 'can find an incident by weapon_type' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextValue.new(field_name: 'weapon_type', value: 'baton')
      ]
    )
    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident4.id)
  end

  it 'can find an incident with a late verified violation' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextList.new(field_name: 'late_verified_violations', values: %w[killing])
      ],
      sort: { 'short_id' => 'asc' }
    )

    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'can find an incident by type of perpetrator' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextList.new(field_name: 'perpetrator_category', values: %w[crossfire])
      ],
      sort: { 'short_id' => 'asc' }
    )

    expect(search_result.total).to eq(1)
    expect(search_result.records.first.id).to eq(incident1.id)
  end

  it 'can find an incident by ctfmr_verified_date' do
    search_result = PhoneticSearchService.search(
      Incident,
      filters: [
        SearchFilters::TextList.new(field_name: 'ctfmr_verified_date', values: [Date.today.end_of_quarter])
      ],
      sort: { 'short_id' => 'asc' }
    )

    expect(search_result.total).to eq(2)
    expect(search_result.records.map(&:id)).to match_array([incident2.id, incident3.id])
  end

  it 'the records has been stamped with fields from violations' do
    expect(incident1.individual_violations).to match_array(%w[killing])
    expect(incident1.individual_sex).to match_array(%w[male])
    expect(incident1.victim_deprived_liberty_security_reasons).to match_array(%w[yes])
    expect(incident1.reasons_deprivation_liberty).to match_array(%w[reason_1])
    expect(incident1.victim_facilty_victims_held).to match_array(%w[facility_1])
    expect(incident1.torture_punishment_while_deprivated_liberty).to match_array(%w[no])
    expect(incident1.armed_force_group_party_names).to match_array(%w[armed_force_1])
    expect(incident1.perpetrator_category).to match_array(%w[crossfire])
    expect(incident1.violation_with_verification_status).to match_array(%w[killing_verified])
    expect(incident1.verified_ghn_reported).to match_array(%w[2022-q2])
    expect(incident1.ctfmr_verified_date).to match_array([Date.today.beginning_of_quarter])
    expect(incident5.facility_attack_type).to match_array(%w[attack_on_medical_personnel threat_of_attack_on_hospital])
  end

  it 'recalculates the stamped fields' do
    incident1.update_properties(
      user1,
      'perpetrators' => [
        {
          'unique_id' => 'a32b70de-9132-4c89-be8d-67e85a69ec68',
          'perpetrator_category' => 'category2'
        },
        {
          'unique_id' => '23e9b1ba-2f25-11ef-8c62-18c04db5c362',
          'armed_force_group_party_name' => 'armed_force_2',
          'violations_ids' => ['b23b70de-9132-4c89-be8d-57e85a69ec68']
        }
      ]
    )
    incident1.save!

    expect(incident1.perpetrator_category).to match_array(%w[category2])
    expect(incident1.armed_force_group_party_names).to match_array(%w[armed_force_1 armed_force_2])
  end
end
