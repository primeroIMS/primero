# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::LessImpactedAfterSupport do
  before do
    clean_data(Child)

    Child.create!(
      data: {
        sex: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-05',
        client_summary_worries_severity: '3',
        closure_problems_severity: '1'
      }
    )
    Child.create!(
      data: {
        sex: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08',
        client_summary_worries_severity: '3',
        closure_problems_severity: '0'
      }
    )
    Child.create!(
      data: {
        sex: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-11-07',
        client_summary_worries_severity: '0',
        closure_problems_severity: '2'
      }
    )
    Child.create!(
      data: {
        sex: 'female',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08',
        client_summary_worries_severity: '3',
        closure_problems_severity: '0'
      }
    )
    Child.create!(
      data: {
        sex: 'female',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-10',
        client_summary_worries_severity: 'do_not_understand_the_question',
        closure_problems_severity: '1'
      }
    )
  end

  it 'returns data for less_impacted_after_support indicator' do
    report_data = ManagedReports::Indicators::LessImpactedAfterSupport.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'clients_report_less_impacted', female: 100.0, male: 66.67, total: 75.0 },
        { id: 'clients_report_equally_or_more_severely_impacted', male: 33.33, total: 25.0 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::LessImpactedAfterSupport.build(
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
                  { id: 'clients_report_less_impacted', female: 100.0, male: 66.67, total: 75.0 },
                  { id: 'clients_report_equally_or_more_severely_impacted', male: 33.33, total: 25.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::LessImpactedAfterSupport.build(
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
              data: [{ id: 'clients_report_less_impacted', female: 100.0, male: 100.0, total: 100.0 }]
            },
            {
              group_id: '2021-11',
              data: [{ id: 'clients_report_equally_or_more_severely_impacted', male: 100.0, total: 100.0 }]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::LessImpactedAfterSupport.build(
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
              data: [{ id: 'clients_report_less_impacted', female: 100.0, male: 100.0, total: 100.0 }]
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
