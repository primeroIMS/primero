# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageClientsGender do
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
        sex: 'male',
        registration_date: '2021-10-05',
        status: 'open',
        gender: 'gender_1',
        next_steps: ['a_continue_protection_assessment'],
        consent_reporting: true
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        module_id: module1.unique_id,
        sex: 'male',
        registration_date: '2021-10-08',
        status: 'open',
        gender: 'gender_3',
        next_steps: ['a_continue_protection_assessment']
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        module_id: module2.unique_id,
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
        module_id: module2.unique_id,
        sex: 'female',
        registration_date: '2021-11-12',
        next_steps: ['a_continue_protection_assessment'],
        gender: 'gender_2',
        status: 'open'
      }
    )
  end

  let(:child5) do
    Child.create!(
      data: {
        sex: 'female',
        registration_date: '2021-10-09',
        next_steps: ['a_continue_protection_assessment'],
        gender: 'gender_3',
        consent_reporting: true,
        status: 'open'
      }
    )
  end

  before do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child, PrimeroModule)
    DateTime.stub(:now).and_return(Time.utc(2022, 2, 15, 14, 5, 0))
    child1
    child2
    child3
    child4
    child5
  end

  after do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Child, PrimeroModule)
  end

  it 'returns data for percentage_clients_gender indicator' do
    report_data = ManagedReports::Indicators::PercentageClientsGender.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'gender_1', total: 20.0 },
        { id: 'gender_2', total: 20.0 },
        { id: 'gender_3', total: 40.0 },
        { id: 'incomplete_data', total: 20.0 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::PercentageClientsGender.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'gender_1', total: 50.0 },
          { id: 'gender_3', total: 50.0 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::PercentageClientsGender.build(
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
                  { id: 'gender_1', total: 20.0 },
                  { id: 'gender_2', total: 20.0 },
                  { id: 'gender_3', total: 40.0 },
                  { id: 'incomplete_data', total: 20.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::PercentageClientsGender.build(
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
                  { id: 'gender_1', total: 33.33 },
                  { id: 'gender_3', total: 66.67 }
                ]
              )
            },
            {
              group_id: '2021-11',
              data: match_array(
                [
                  { id: 'gender_2', total: 50.0 },
                  { id: 'incomplete_data', total: 50.0 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::PercentageClientsGender.build(
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
                  { id: 'gender_1', total: 33.33 },
                  { id: 'gender_3', total: 66.67 }
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

  describe 'module_id' do
    context 'when set' do
      it 'should return results by module' do
        report_data = ManagedReports::Indicators::PercentageClientsGender.build(
          nil,
          {
            'module_id' => SearchFilters::Value.new(field_name: 'module_id', value: 'primeromodule-cp-a')
          }
        ).data

        expect(report_data).to match_array(
          [
            { id: 'gender_1', total: 50.00 },
            { id: 'gender_3', total: 50.00 }
          ]
        )
      end
    end
  end
end
