# frozen_string_literal: true

require 'rails_helper'

describe ManagedReport do
  describe '#list' do
    let(:managed_reports) { ManagedReport.list }

    it 'return a Hash of ManagedReport' do
      expect(managed_reports).to be_an_instance_of(Hash)
      expect(managed_reports.size).to eq(2)
    end

    it 'should have gbv_statistics and violation keys' do
      expect(managed_reports.keys).to match_array([Permission::GBV_STATISTICS_REPORT, Permission::VIOLATION_REPORT])
    end

    it 'should return subreports of gbv_statistics' do
      expect(managed_reports[Permission::GBV_STATISTICS_REPORT].subreports).to match_array(
        %w[incidents perpetrators survivors]
      )
    end

    it 'should return permitted_filters of gbv_statistics' do
      expect(managed_reports[Permission::GBV_STATISTICS_REPORT].permitted_filters).to match_array(
        [{ date_of_first_report: {}, incident_date: {} }]
      )
    end

    it 'should return subreports of violations' do
      expect(
        managed_reports[Permission::VIOLATION_REPORT].subreports
      ).to match_array(%w[killing maiming detention rape])
    end

    it 'should return permitted_filters of violations' do
      expect(managed_reports[Permission::VIOLATION_REPORT].permitted_filters).to match_array(
        [
          :ctfmr_verified, :verified_ctfmr_technical,
          { ctfmr_verified_date: {}, date_of_first_report: {}, incident_date: {} }
        ]
      )
    end
  end
end
