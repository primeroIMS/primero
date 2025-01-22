# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReport do
  before :each do
    SystemSettings.stub(:primary_age_ranges).and_return([0..5, 6..11, 12..17, 18..AgeRange::MAX])
  end

  describe '#list' do
    let(:managed_reports) { ManagedReport.list }

    it 'return a Hash of ManagedReport' do
      expect(managed_reports).to be_an_instance_of(Hash)
      expect(managed_reports.size).to eq(18)
    end

    it 'should have gbv_statistics and violation keys' do
      expect(managed_reports.keys).to match_array([Permission::GBV_STATISTICS_REPORT,
                                                   Permission::VIOLATION_REPORT, Permission::GHN_REPORT,
                                                   Permission::INDIVIDUAL_CHILDREN,
                                                   Permission::PROTECTION_CONCERNS_REPORT,
                                                   Permission::REPORTING_LOCATIONS_REPORT,
                                                   Permission::FOLLOWUPS_REPORT,
                                                   Permission::SERVICES_REPORT,
                                                   Permission::CASES_WORKFLOW_REPORT,
                                                   Permission::WORKFLOW_REPORT,
                                                   Permission::VIOLENCE_TYPE_REPORT,
                                                   Permission::REFERRALS_TRANSFERS_REPORT,
                                                   Permission::PROTECTION_OUTCOMES,
                                                   Permission::PROCESS_QUALITY_TOTAL_CASES,
                                                   Permission::PROCESS_QUALITY_AVERAGE_CASES,
                                                   Permission::PROCESS_QUALITY_SUCCESSFUL_REFERRALS,
                                                   Permission::PROCESS_QUALITY_IMPLEMENTED_REFERRALS,
                                                   Permission::CASE_CHARACTERISTICS])
    end

    it 'should return subreports of gbv_statistics' do
      expect(managed_reports[Permission::GBV_STATISTICS_REPORT].subreports).to match_array(
        %w[incidents]
      )
    end

    it 'should return permitted_filters of gbv_statistics' do
      expect(managed_reports[Permission::GBV_STATISTICS_REPORT].permitted_filters).to match_array(
        [:grouped_by, { date_of_first_report: {}, incident_date: {} }]
      )
    end

    it 'should return subreports of violations' do
      expect(
        managed_reports[Permission::VIOLATION_REPORT].subreports
      ).to match_array(
        %w[killing maiming detention sexual_violence attack_on_hospitals attack_on_schools
           denial_humanitarian_access abduction recruitment military_use]
      )
    end

    it 'should return permitted_filters of violations' do
      expect(managed_reports[Permission::VIOLATION_REPORT].permitted_filters).to match_array(
        [
          :ctfmr_verified, :verified_ctfmr_technical, :grouped_by,
          { ctfmr_verified_date: {}, date_of_first_report: {}, incident_date: {} }
        ]
      )
    end
  end
end
