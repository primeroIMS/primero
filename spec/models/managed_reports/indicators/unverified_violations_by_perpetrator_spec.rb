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
            ctfmr_verified_date: Date.new(2022, 4, 23),
            violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 }
          },
          {
            unique_id: '8edd80b2-76d9-11f0-8338-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification',
            violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
          }
        ],
        perpetrators: [
          {
            unique_id: 'e13ffb2e-77c3-11f0-ba4b-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_2',
            violations_ids: ['bbfd214c-77c4-11f0-8941-7c10c98b54af']
          },
          {
            unique_id: '20f8b6a2-77c4-11f0-b34b-7c10c98b54af',
            armed_force_group_party_name: 'armed_force_1',
            violations_ids: ['8edd80b2-76d9-11f0-8338-7c10c98b54af']
          }
        ]
      }.with_indifferent_access
    )
    incident0.save!
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

    expect(data).to match_array([{ id: 'armed_force_1', attack_on_schools: 1, total: 1 }])
  end
end
