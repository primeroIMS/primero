# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageCasesRiskLevel do
  let(:module1) do
    PrimeroModule.create!(
      unique_id: 'primeromodule-cp-a', name: 'CPA', associated_record_types: %w[case]
    )
  end

  let(:module2) do
    PrimeroModule.create!(
      unique_id: 'primeromodule-cp-b', name: 'CPB', associated_record_types: %w[case]
    )
  end

  let(:child1) do
    Child.create!(
      data: {
        module_id: module1.unique_id,
        gender: 'male',
        registration_date: '2021-10-05',
        next_steps: ['a_continue_protection_assessment'],
        risk_level: 'high',
        consent_reporting: true
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        gender: 'male',
        module_id: module1.unique_id,
        registration_date: '2021-10-08',
        next_steps: ['a_continue_protection_assessment'],
        risk_level: 'medium'
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        module_id: module2.unique_id,
        gender: 'male',
        registration_date: '2021-11-07',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        module_id: module2.unique_id,
        gender: 'female',
        registration_date: '2021-11-12',
        next_steps: ['a_continue_protection_assessment'],
        risk_level: 'low',
        consent_reporting: true
      }
    )
  end

  let(:child5) do
    Child.create!(
      data: {
        module_id: module2.unique_id,
        gender: 'female',
        registration_date: '2021-10-09',
        next_steps: ['a_continue_protection_assessment'],
        risk_level: 'medium'
      }
    )
  end

  before do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child, PrimeroModule)
    child1
    child2
    child3
    child4
    child5
  end

  after do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child, PrimeroModule)
  end

  it 'returns data for percentage_cases_risk_level indicator' do
    report_data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'high', male: 33.33, total: 20.0 },
        { id: 'medium', female: 50.0, male: 33.33, total: 40.0 },
        { id: 'low', female: 50.0, total: 20.0 },
        { id: 'incomplete_data', male: 33.33, total: 20.0 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'high', male: 100.0, total: 50.0 },
          { id: 'low', female: 100.0, total: 50.0 }
        ]
      )
    end
  end

  context 'when gender is null' do
    before do
      Child.create!(
        id: 'bc691666-f940-11ef-9ac6-18c04db5c362',
        data: {
          registration_date: '2021-10-09',
          next_steps: ['a_continue_protection_assessment'],
          risk_level: 'medium'
        }
      )
    end

    it 'returns incomplete_data for null genders' do
      report_data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'high', male: 33.33, total: 16.67 },
          { id: 'medium', female: 50.0, male: 33.33, incomplete_data: 100, total: 50.0 },
          { id: 'low', female: 50.0, total: 16.67 },
          { id: 'incomplete_data', male: 33.33, total: 16.67 }
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
        data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(
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
              data: match_array(
                [
                  { id: 'high', male: 33.33, total: 20.0 },
                  { id: 'medium', female: 50.0, male: 33.33, total: 40.0 },
                  { id: 'low', female: 50.0, total: 20.0 },
                  { id: 'incomplete_data', male: 33.33, total: 20.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(
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
              data: match_array(
                [
                  { id: 'high', male: 50.0, total: 33.33 },
                  { id: 'medium', female: 100.0, male: 50.0, total: 66.67 }
                ]
              )
            },
            {
              group_id: '2021-11',
              data: match_array(
                [
                  { id: 'low', female: 100.0, total: 50.0 },
                  { id: 'incomplete_data', male: 100.0, total: 50.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(
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
              data: match_array(
                [
                  { id: 'high', male: 50.0, total: 33.33 },
                  { id: 'medium', female: 100.0, male: 50.0, total: 66.67 }
                ]
              )
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: match_array([])
            }
          ]
        )
      end
    end
  end

  describe 'module_id' do
    context 'when set' do
      it 'should return results by module' do
        report_data = ManagedReports::Indicators::PercentageCasesRiskLevel.build(
          nil,
          {
            'module_id' => SearchFilters::Value.new(field_name: 'module_id', value: 'primeromodule-cp-a')
          }
        ).data

        expect(report_data).to match_array(
          [
            { id: 'high', male: 50.00, total: 50.00 },
            { id: 'medium', male: 50.00, total: 50.00 }
          ]
        )
      end
    end
  end
end
