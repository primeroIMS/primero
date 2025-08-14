# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::UnverifiedViolationsByRegion do
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
        date_of_first_report: Date.new(2022, 4, 23),
        status: 'open',
        module_id: PrimeroModule::MRM,
        reporting_location_hierarchy: 'CT.CT01.CT011003.CT011003003',
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
        ]
      }.with_indifferent_access
    )
    incident0.save!
  end

  it 'return data for  unverified violations by region' do
    data = ManagedReports::Indicators::UnverifiedViolationsByRegion.build(
      managed_report_user,
      {
        'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
        'ghn_date_filter' => SearchFilters::DateRange.new(
          field_name: 'ghn_date_filter',
          from: Date.parse('2022-04-01'),
          to: Date.parse('2022-04-23')
        )
      }
    ).data

    expect(data).to match_array([{ id: 'CT01', attack_on_schools: 1, total: 1 }])
  end
end
