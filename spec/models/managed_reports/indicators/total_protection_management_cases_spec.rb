# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::TotalProtectionManagementCases do
  before do
    clean_data(Child)

    Child.create!(
      data: {
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-05',
        status: 'closed',
        consent_reporting: true
      }
    )
    Child.create!(
      data: {
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08',
        status: 'closed',
        consent_reporting: true
      }
    )
    Child.create!(
      data: {
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-11-07'
      }
    )
    Child.create!(
      data: {
        gender: 'female',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08'
      }
    )
  end

  it 'returns data for total_protection_management_cases indicator' do
    report_data = ManagedReports::Indicators::TotalProtectionManagementCases.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'open', female: 1, male: 1, total: 2 },
        { id: 'closed', male: 2, total: 2 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::TotalProtectionManagementCases.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'closed', male: 2, total: 2 }
        ]
      )
    end
  end

  context 'when gender is null' do
    before do
      Child.create!(
        id: 'bc691666-f940-11ef-9ac6-18c04db5c362',
        data: {
          next_steps: ['a_continue_protection_assessment'],
          registration_date: '2021-10-08'
        }
      )
    end

    it 'returns incomplete_data for null genders' do
      report_data = ManagedReports::Indicators::TotalProtectionManagementCases.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'open', female: 1, male: 1, incomplete_data: 1, total: 3 },
          { id: 'closed', male: 2, total: 2 }
        ]
      )
    end

    after do
      Child.find_by(id: 'bc691666-f940-11ef-9ac6-18c04db5c362').destroy!
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::TotalProtectionManagementCases.build(
          nil,
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
              data: an_array_matching(
                [
                  { id: 'open', female: 1, male: 1, total: 2 },
                  { id: 'closed', male: 2, total: 2 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::TotalProtectionManagementCases.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-11-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: an_array_matching(
                [
                  { id: 'closed', male: 2, total: 2 },
                  { id: 'open', female: 1, total: 1 }
                ]
              )
            },
            {
              group_id: '2021-11',
              data: [{ id: 'open', male: 1, total: 1 }]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::TotalProtectionManagementCases.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: '2021-10-01',
              to: '2021-10-16'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-09-26 - 2021-10-02',
              data: []
            },
            {
              group_id: '2021-10-03 - 2021-10-09',
              data: an_array_matching(
                [
                  { id: 'closed', male: 2, total: 2 },
                  { id: 'open', female: 1, total: 1 }
                ]
              )
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: []
            }
          ]
        )
      end
    end
  end
end
