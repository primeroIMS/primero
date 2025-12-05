# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::LateVerificationViolationsByRegion do
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
    clean_data(Violation, Incident)

    managed_report_user.stub(:incident_reporting_location_admin_level).and_return(1)

    incident0 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 23),
        status: 'open',
        module_id: PrimeroModule::MRM,
        reporting_location_hierarchy: 'CT.CT01.CT011003.CT011003003',
        attack_on_schools: [
          {
            unique_id: 'bbfd214c-77c4-11f0-8941-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23)
          }
        ],
        deprivation_liberty: [
          {
            unique_id: '540b31c2-cf09-11f0-b955-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 25)
          }
        ],
        maiming: [
          {
            unique_id: '8edd80b2-76d9-11f0-8338-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23),
            violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
          }
        ],
        military_use: [
          {
            unique_id: '26071584-d20b-11f0-a14b-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 8, 23),
            violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
          }
        ]
      }.with_indifferent_access
    )
    incident0.save!

    incident1 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 10),
        status: 'open',
        module_id: PrimeroModule::MRM,
        reporting_location_hierarchy: 'CT.CT02.CT022003.CT022003001',
        killing: [
          {
            unique_id: '4cb37a58-874a-11f0-8227-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 10, 15),
            violation_tally: { boys: 1, girls: 0, unknown: 2, total: 3 }
          }
        ],
        attack_on_hospitals: [
          {
            unique_id: '164f9b14-874e-11f0-accb-7c10c98b54af',
            ctfmr_verified: 'report_pending_verification'
          }
        ]
      }.with_indifferent_access
    )
    incident1.save!

    incident2 = Incident.new_with_user(
      managed_report_user,
      {
        incident_date: Date.new(2022, 4, 10),
        status: 'closed',
        module_id: PrimeroModule::MRM,
        reporting_location_hierarchy: 'CT.CT02.CT022003.CT022003001',
        attack_on_hospitals: [
          {
            unique_id: 'ee0b7fee-be5a-11f0-aa99-7c10c98b54af',
            ctfmr_verified: 'verified',
            ctfmr_verified_date: Date.new(2022, 10, 15)
          }
        ]
      }.with_indifferent_access
    )
    incident2.save!
  end

  it 'return data for late verified violations by region' do
    data = ManagedReports::Indicators::LateVerificationViolationsByRegion.build(
      managed_report_user,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-08-01'),
          to: Date.parse('2022-10-30')
        )
      }
    ).data

    expect(data).to match_array(
      [
        { id: 'CT01', attack_on_schools: 1, maiming: 7, total: 8 },
        { id: 'CT02', killing: 3, total: 3 }
      ]
    )
  end
end
