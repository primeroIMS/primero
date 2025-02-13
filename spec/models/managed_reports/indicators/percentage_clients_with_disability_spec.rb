# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageClientsWithDisability do
  let(:child1) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-05',
        next_steps: ['a_continue_protection_assessment'],
        disability_status_yes_no: 'true',
        consent_reporting: true
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-10-08',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        sex: 'male',
        registration_date: '2021-11-07',
        next_steps: ['a_continue_protection_assessment'],
        disability_status_yes_no: 'true'
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-11-12',
        next_steps: ['a_continue_protection_assessment'],
        disability_status_yes_no: 'true'
      }
    )
  end

  let(:child5) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-10-09',
        next_steps: ['a_continue_protection_assessment'],
        disability_status_yes_no: 'false',
        consent_reporting: true
      }
    )
  end

  before do
    clean_data(SearchableValue, Alert, Lookup, UserGroup, User, Agency, Role, Child)
    child1
    child2
    child3
    child4
    child5
  end

  after do
    clean_data(SearchableValue, Alert, Lookup, UserGroup, User, Agency, Role, Child)
  end

  it 'returns data for percentage_clients_with_disability indicator' do
    report_data = ManagedReports::Indicators::PercentageClientsWithDisability.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'true', female: 50.0, male: 66.67, total: 60.0 },
        { id: 'false', female: 50.0, male: 33.33, total: 40.0 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::SearchableFilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::PercentageClientsWithDisability.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'true', male: 100.0, total: 50.0 },
          { id: 'false', female: 100.0, total: 50.0 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PercentageClientsWithDisability.build(
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
                  { id: 'true', female: 50.0, male: 66.67, total: 60.0 },
                  { id: 'false', female: 50.0, male: 33.33, total: 40.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PercentageClientsWithDisability.build(
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
                  { id: 'true', male: 50.0, total: 33.33 },
                  { id: 'false', female: 100.0, male: 50.0, total: 66.67 }
                ]
              )
            },
            {
              group_id: '2021-11',
              data: match_array([{ id: 'true', female: 100.0, male: 100.0, total: 100.0 }])
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::PercentageClientsWithDisability.build(
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
                  { id: 'true', male: 50.0, total: 33.33 },
                  { id: 'false', male: 50.0, female: 100.0, total: 66.67 }
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
