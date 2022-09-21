# frozen_string_literal: true

require 'rails_helper'

describe ManagedReport do
  before :each do
    SystemSettings.stub(:primary_age_ranges).and_return([0..5, 6..11, 12..17, 18..AgeRange::MAX])
  end

  describe '#list' do
    let(:managed_reports) { ManagedReport.list }

    it 'return a Hash of ManagedReport' do
      expect(managed_reports).to be_an_instance_of(Hash)
      expect(managed_reports.size).to eq(4)
    end

    it 'should have gbv_statistics and violation keys' do
      expect(managed_reports.keys).to match_array([Permission::GBV_STATISTICS_REPORT,
                                                   Permission::VIOLATION_REPORT, Permission::GHN_REPORT,
                                                   Permission::INDIVIDUAL_CHILDREN])
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
