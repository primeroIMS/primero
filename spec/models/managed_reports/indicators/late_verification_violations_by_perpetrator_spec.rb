# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::LateVerificationViolationsByPerpetrator do
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
        status: 'open',
        module_id: PrimeroModule::MRM,
        attack_on_schools: [
          {
            unique_id: 'bbfd214c-77c4-11f0-8941-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23)
          }
        ],
        maiming: [
          {
            unique_id: '8edd80b2-76d9-11f0-8338-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification',
            violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
          },
          {
            unique_id: '76d2adba-8752-11f0-accf-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23),
            violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
          }
        ],
        killing: [
          {
            unique_id: '52477e6c-8752-11f0-9c81-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23),
            violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 }
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
          }
        ]
      }.with_indifferent_access
    )
    incident0.save!

    incident1 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 23),
        status: 'closed',
        module_id: PrimeroModule::MRM,
        killing: [
          {
            unique_id: '3b98ae80-be5b-11f0-906c-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23),
            violation_tally: { boys: 1, girls: 1, unknown: 6, total: 8 }
          }
        ],
        perpetrators: [
          {
            unique_id: '4907045e-be5b-11f0-852a-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_3',
            violations_ids: %w[3b98ae80-be5b-11f0-906c-7c10c98b54af]
          }
        ]
      }.with_indifferent_access
    )
    incident1.save!
  end

  it 'return data for late verified violations by perpetrator' do
    data = ManagedReports::Indicators::LateVerificationViolationsByPerpetrator.build(
      nil,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-08-01'),
          to: Date.parse('2022-08-31')
        )
      }
    ).data

    expect(data).to match_array(
      [
        { id: 'armed_force_1', maiming: 7, total: 7 },
        { id: 'armed_force_2', attack_on_schools: 1, killing: 4, total: 5 }
      ]
    )
  end
end
