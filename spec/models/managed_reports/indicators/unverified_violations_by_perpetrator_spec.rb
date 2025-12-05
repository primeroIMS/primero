# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::UnverifiedViolationsByPerpetrator do
  let(:managed_report_user) do
    fake_user(
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          managed_report_scope: Permission::ALL,
          actions: [Permission::VIOLATION_REPORT]
        )
      ]
    )
  end

  before do
    clean_data(Perpetrator, Violation, Incident)

    incident0 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 23),
        date_of_first_report: Date.new(2022, 4, 23),
        status: 'open',
        module_id: PrimeroModule::MRM,
        attack_on_schools: [
          {
            unique_id: 'bbfd214c-77c4-11f0-8941-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 4, 23)
          },
          {
            unique_id: '8edd80b2-76d9-11f0-8338-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification'
          }
        ],
        maiming: [
          unique_id: '76d2adba-8752-11f0-accf-7c10c98b54af',
          ctfmr_verified: 'report_pending_verification',
          violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
        ],
        killing: [
          {
            unique_id: '52477e6c-8752-11f0-9c81-7c10c98b54af',
            ctfmr_verified: 'reported_not_verified',
            violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 }
          }
        ],
        deprivation_liberty: [
          {
            unique_id: '44412e96-cf94-11f0-9bf9-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification',
            violation_tally: { boys: 1, girls: 2, unknown: 1, total: 4 }
          }
        ],
        military_use: [
          {
            unique_id: 'c9504bdc-d20d-11f0-917b-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification',
            violation_tally: { boys: 1, girls: 0, unknown: 1, total: 2 }
          }
        ],
        perpetrators: [
          {
            unique_id: 'e13ffb2e-77c3-11f0-ba4b-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_2',
            violations_ids: %w[bbfd214c-77c4-11f0-8941-7c10c98b54af 52477e6c-8752-11f0-9c81-7c10c98b54af]
          },
          {
            unique_id: '20f8b6a2-77c4-11f0-b34b-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_1',
            violations_ids: %w[8edd80b2-76d9-11f0-8338-7c10c98b54af 76d2adba-8752-11f0-accf-7c10c98b54af]
          },
          {
            unique_id: '4e8c13d4-cf94-11f0-987b-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_3',
            violations_ids: %w[44412e96-cf94-11f0-9bf9-7c10c98b54af c9504bdc-d20d-11f0-917b-7c10c98b54af]
          }
        ]
      }.with_indifferent_access
    )
    incident0.save!

    incident1 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 23),
        date_of_first_report: Date.new(2022, 4, 23),
        status: 'closed',
        module_id: PrimeroModule::MRM,
        attack_on_schools: [
          {
            unique_id: '91108740-be54-11f0-b02e-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification'
          }
        ],
        perpetrators: [
          {
            unique_id: '00f206ce-be55-11f0-8a5e-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_1',
            violations_ids: %w[91108740-be54-11f0-b02e-7c10c98b54af]
          }
        ]
      }.with_indifferent_access
    )
    incident1.save!
  end

  it 'return data for unverified violations by perpetrator' do
    data = ManagedReports::Indicators::UnverifiedViolationsByPerpetrator.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-04-01'),
          to: Date.parse('2022-04-23')
        )
      }
    ).data

    expect(data).to match_array(
      [
        { id: 'armed_force_1', attack_on_schools: 1, maiming: 7, total: 8 },
        { id: 'armed_force_2', killing: 4, total: 4 }
      ]
    )
  end
end
