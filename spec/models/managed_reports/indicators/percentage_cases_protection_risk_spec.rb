# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageCasesProtectionRisk do
  let(:child1) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-05',
        next_steps: ['a_continue_protection_assessment'],
        protection_risks: %w[risk1 risk2]
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-08',
        next_steps: ['a_continue_protection_assessment'],
        protection_risks: %w[risk1 risk3]
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-11-07',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-10-12',
        next_steps: ['a_continue_protection_assessment'],
        protection_risks: %w[risk2]
      }
    )
  end

  before do
    clean_data(SearchableValue, Alert, Lookup, UserGroup, User, Agency, Role, Child)
    child1
    child2
    child3
    child4
  end

  after do
    clean_data(SearchableValue, Alert, Lookup, UserGroup, User, Agency, Role, Child)
  end

  it 'returns data for percentage_cases_protection_risk indicator' do
    report_data = ManagedReports::Indicators::PercentageCasesProtectionRisk.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'risk1', male: 66.67, total: 50.0 },
        { id: 'risk2', female: 100.0, male: 33.33, total: 50.0 },
        { id: 'risk3', male: 33.33, total: 25.0 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PercentageCasesProtectionRisk.build(
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
              data: [
                { id: 'risk1', male: 66.67, total: 50.0 },
                { id: 'risk2', female: 100.0, male: 33.33, total: 50.0 },
                { id: 'risk3', male: 33.33, total: 25.0 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PercentageCasesProtectionRisk.build(
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
              data: [
                { id: 'risk1', male: 100.0, total: 66.67 },
                { id: 'risk2', female: 100.0, male: 50.0, total: 66.67 },
                { id: 'risk3', male: 50.0, total: 33.33 }
              ]
            },
            {
              group_id: '2021-11',
              data: []
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::PercentageCasesProtectionRisk.build(
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
              data: [
                { id: 'risk1', male: 100.0, total: 100.0 },
                { id: 'risk2', male: 50.0, total: 50.0 },
                { id: 'risk3', male: 50.0, total: 50.0 }
              ]
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: [{ id: 'risk2', female: 100.0, total: 100.0 }]
            }
          ]
        )
      end
    end
  end
end
