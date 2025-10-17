# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::CaseProtectionConcernsReportingLocation do
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
    clean_data(SystemSettings, Child, Location)

    managed_report_user.stub(:reporting_location_admin_level).and_return(1)

    Child.create!(
      data: {
        registration_date: Date.new(2021, 5, 13),
        status: 'open',
        age: 10,
        sex: 'female',
        reporting_location_hierarchy: 'CT.CT001.CT00101',
        protection_concerns: %w[concern_1]
      }
    )

    Child.create!(
      data: {
        registration_date: Date.new(2021, 1, 23),
        status: 'open',
        age: 2,
        sex: 'female',
        reporting_location_hierarchy: 'CT.CT002.CT00201',
        protection_concerns: %w[concern_1]
      }
    )

    Child.create!(
      data: {
        registration_date: Date.new(2022, 5, 23),
        status: 'open',
        age: 15,
        reporting_location_hierarchy: 'CT.CT001.CT00101',
        protection_concerns: %w[concern_2]
      }
    )

    Child.create!(
      data: {
        registration_date: Date.new(2022, 8, 23),
        status: 'open',
        age: 9,
        sex: 'male',
        protection_concerns: %w[concern_3]
      }
    )
  end

  it 'return data for case_protection_concerns_reporting_location indicator' do
    data = ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.build(
      managed_report_user, {}
    ).data

    expect(data).to match_array(
      [
        { id: 'CT001', female: 1, incomplete_data: 1, total: 2 },
        { id: 'CT002', female: 1, total: 1 },
        { id: 'incomplete_data', male: 1, total: 1 }
      ]
    )
  end

  context 'when filtered by age range and protection concerns' do
    it 'returns data for the applied filters' do
      report_data = ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.build(
        managed_report_user,
        {
          'age' => SearchFilters::NumericRange.new(field_name: 'age', from: 0, to: 5),
          'protection_concerns' => SearchFilters::TextList.new(field_name: 'protection_concerns', values: %w[concern_1])
        }
      ).data

      expect(report_data).to match_array([{ id: 'CT002', female: 1, total: 1 }])
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.build(
          managed_report_user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-01-01',
              to: '2021-12-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: match_array(
                [
                  { id: 'CT001', female: 1, total: 1 },
                  { id: 'CT002', female: 1, total: 1 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.build(
          managed_report_user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-04-01',
              to: '2021-05-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-04',
              data: match_array([])
            },
            {
              group_id: '2021-05',
              data: match_array([{ id: 'CT001', female: 1, total: 1 }])
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.build(
          managed_report_user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-05-01',
              to: '2021-05-15'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2021-04-25 - 2021-05-01', data: [] },
            { group_id: '2021-05-02 - 2021-05-08', data: [] },
            {
              group_id: '2021-05-09 - 2021-05-15',
              data: match_array([{ id: 'CT001', female: 1, total: 1 }])
            }
          ]
        )
      end
    end
  end
end
