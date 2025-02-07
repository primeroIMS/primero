# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageCasesDuration do
  let(:child1) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-05',
        status: 'open',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-08',
        date_closure: '2021-11-08',
        status: 'closed',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-11-07',
        status: 'open',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-11-12',
        next_steps: ['a_continue_protection_assessment'],
        status: 'open'
      }
    )
  end

  let(:child5) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-10-09',
        date_closure: '2021-12-12',
        next_steps: ['a_continue_protection_assessment'],
        status: 'closed'
      }
    )
  end

  before do
    clean_data(SearchableValue, SearchableDatetime, Alert, Lookup, UserGroup, User, Agency, Role, Child)
    DateTime.stub(:now).and_return(Time.utc(2022, 2, 15, 14, 5, 0))
    child1
    child2
    child3
    child4
    child5
  end

  after do
    clean_data(SearchableValue, SearchableDatetime, Alert, Lookup, UserGroup, User, Agency, Role, Child)
  end

  it 'returns data for percentage_cases_duration indicator' do
    report_data = ManagedReports::Indicators::PercentageCasesDuration.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: '1_3_months', female: 50.0, male: 33.33, total: 40.0 },
        { id: '3_6_months', female: 50.0, male: 66.67, total: 60.0 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PercentageCasesDuration.build(
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
                  { id: '1_3_months', female: 50.0, male: 33.33, total: 40.0 },
                  { id: '3_6_months', female: 50.0, male: 66.67, total: 60.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PercentageCasesDuration.build(
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
                  { id: '1_3_months', female: 100.0, male: 50.0, total: 66.67 },
                  { id: '3_6_months', male: 50.0, total: 33.33 }
                ]
              )
            },
            {
              group_id: '2021-11',
              data: match_array([{ id: '3_6_months', female: 100.0, male: 100.0, total: 100.0 }])
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::PercentageCasesDuration.build(
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
                { id: '1_3_months', male: 50.0, female: 100.0, total: 66.67 },
                { id: '3_6_months', male: 50.0, total: 33.33 }
              ]
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
