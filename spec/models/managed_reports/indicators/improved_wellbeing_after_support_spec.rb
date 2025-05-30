# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::ImprovedWellbeingAfterSupport do
  before do
    clean_data(Child, PrimeroModule)

    module1 = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-a', name: 'CPA', associated_record_types: %w[case]
    )

    module2 = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-b', name: 'CPB', associated_record_types: %w[case]
    )

    Child.create!(
      data: {
        module_id: module1.unique_id,
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-05',
        consent_reporting: true,
        psychsocial_assessment_score_most_recent: 15,
        psychsocial_assessment_score_initial: 10
      }
    )
    Child.create!(
      data: {
        module_id: module1.unique_id,
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08',
        consent_reporting: true,
        psychsocial_assessment_score_most_recent: 19,
        psychsocial_assessment_score_initial: 12
      }
    )
    Child.create!(
      data: {
        module_id: module2.unique_id,
        gender: 'male',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-11-07',
        consent_reporting: true,
        psychsocial_assessment_score_most_recent: 10,
        psychsocial_assessment_score_initial: 12
      }
    )
    Child.create!(
      module_id: module2.unique_id,
      data: {
        gender: 'female',
        next_steps: ['a_continue_protection_assessment'],
        registration_date: '2021-10-08',
        psychsocial_assessment_score_most_recent: 19,
        psychsocial_assessment_score_initial: 12
      }
    )
  end

  it 'returns data for improved_wellbeing_after_support indicator' do
    report_data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'improve_by_at_least_3_points', female: 100.0, male: 66.67, total: 75.0 },
        { id: 'not_improve_by_at_least_3_points', male: 33.33, total: 25.0 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'improve_by_at_least_3_points', male: 66.67, total: 66.67 },
          { id: 'not_improve_by_at_least_3_points', male: 33.33, total: 33.33 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(
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
                { id: 'improve_by_at_least_3_points', female: 100.0, male: 66.67, total: 75.0 },
                { id: 'not_improve_by_at_least_3_points', male: 33.33, total: 25.0 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(
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
              data: [{ id: 'improve_by_at_least_3_points', female: 100.0, male: 100.0, total: 100.0 }]
            },
            {
              group_id: '2021-11',
              data: [{ id: 'not_improve_by_at_least_3_points', male: 100.0, total: 100.0 }]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(
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
              data: [{ id: 'improve_by_at_least_3_points', female: 100.0, male: 100.0, total: 100.0 }]
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

  describe 'module_id' do
    context 'when set' do
      it 'should return results by module' do
        report_data = ManagedReports::Indicators::ImprovedWellbeingAfterSupport.build(
          nil,
          {
            'module_id' => SearchFilters::Value.new(field_name: 'module_id', value: 'primeromodule-cp-a')
          }
        ).data

        expect(report_data).to match_array(
          [
            { id: 'improve_by_at_least_3_points', male: 100.00, total: 100.00 }
          ]
        )
      end
    end
  end
end
