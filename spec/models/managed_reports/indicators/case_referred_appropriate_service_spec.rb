# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::CaseReferredAppropriateService do
  let(:test_module) do
    primero_module = PrimeroModule.new(
      unique_id: 'test_module',
      name: 'Test Module',
      description: 'Test Module',
      associated_record_types: %w[case],
      module_options: {
        use_workflow_service_implemented: true
      }
    )
    primero_module.save(validate: false)
    primero_module
  end

  let(:child1) do
    Child.create!(
      data: {
        age: 8,
        sex: 'male',
        registration_date: '2021-10-05',
        module_id: 'test_module',
        services_section: [
          {
            unique_id: '929fe0fa-c4b8-11f0-b210-7c10c98b54af',
            service_type: 'type1',
            service_implemented: 'implemented',
            service_implemented_day_time: '2021-10-15T12:29:06.000Z'
          },
          {
            unique_id: 'a85335a0-c4b8-11f0-88ba-7c10c98b54af',
            service_type: 'type2',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          }
        ]
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        age: 2,
        sex: 'male',
        registration_date: '2021-10-12',
        module_id: 'test_module',
        services_section: [
          {
            unique_id: 'e4066c02-c4b8-11f0-b4fe-7c10c98b54af',
            service_type: 'type2',
            service_implemented: 'implemented',
            service_status_referred: true,
            service_implemented_day_time: '2021-10-18T10:15:10.000Z'
          },
          {
            unique_id: 'eabdf45c-c4b8-11f0-a4ef-7c10c98b54af',
            service_type: 'type3',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          }
        ]
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        age: 3,
        sex: 'female',
        registration_date: '2021-11-05',
        module_id: 'test_module',
        services_section: [
          {
            unique_id: '1be9d5d2-c4b9-11f0-a293-7c10c98b54af',
            service_type: 'type3',
            service_implemented: 'implemented',
            service_status_referred: true,
            service_implemented_day_time: '2021-11-12T22:10:00.000Z'
          },
          {
            unique_id: '25a7f702-c4b9-11f0-88b1-7c10c98b54af',
            service_type: 'type1',
            service_implemented: 'implemented',
            service_status_referred: true,
            service_implemented_day_time: '2021-12-09T10:29:06.000Z'
          }
        ]
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        age: 11,
        sex: 'male',
        registration_date: '2021-10-08',
        module_id: 'test_module',
        services_section: [
          {
            unique_id: '6842d8de-c4b9-11f0-ad33-7c10c98b54af',
            service_type: 'type2',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          },
          {
            unique_id: '6e9a108a-c4b9-11f0-a100-7c10c98b54af',
            service_type: 'type2',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          }
        ]
      }
    )
  end

  before do
    clean_data(PrimeroModule, Lookup, UserGroup, User, Agency, Role, Child)
    test_module
    child1
    child2
    child3
    child4
  end

  after do
    clean_data(PrimeroModule, Lookup, UserGroup, User, Agency, Role, Child)
  end

  it 'returns data for case_referred_appropriate_service indicator' do
    report_data = ManagedReports::Indicators::CaseReferredAppropriateService.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'type1', female: 1, total: 1 },
        { id: 'type2', male: 3, total: 3 },
        { id: 'type3', male: 1, female: 1, total: 2 }
      ]
    )
  end

  context 'when filtered by age range and service_implemented' do
    it 'returns data for the applied filters' do
      report_data = ManagedReports::Indicators::CaseReferredAppropriateService.build(
        nil,
        {
          'age' => SearchFilters::NumericRange.new(field_name: 'age', from: 0, to: 5),
          'service_implemented' => SearchFilters::TextValue.new(field_name: 'service_implemented', value: 'implemented')
        }
      ).data

      expect(report_data).to match_array(
        [
          { id: 'type1', female: 1, total: 1 },
          { id: 'type2', male: 1, total: 1 },
          { id: 'type3', female: 1, total: 1 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'returns results grouped by the year of registration_date' do
        data = ManagedReports::Indicators::CaseReferredAppropriateService.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: Date.parse('2021-01-01'),
              to: Date.parse('2021-12-31')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: match_array(
                [
                  { id: 'type1', female: 1, total: 1 },
                  { id: 'type2', male: 3, total: 3 },
                  { id: 'type3', male: 1, female: 1, total: 2 }
                ]
              )
            }
          ]
        )
      end

      it 'returns results grouped by the year of service_implemented_day_time' do
        data = ManagedReports::Indicators::CaseReferredAppropriateService.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'service_implemented_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_implemented_day_time',
              from: Date.parse('2021-01-01'),
              to: Date.parse('2021-12-31')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: match_array(
                [
                  { id: 'type1', female: 1, total: 1 },
                  { id: 'type2', male: 1, total: 1 },
                  { id: 'type3', female: 1, total: 1 }
                ]
              )
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'return results grouped by the month of registration_date' do
        data = ManagedReports::Indicators::CaseReferredAppropriateService.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'registration_date' => SearchFilters::DateRange.new(
              field_name: 'registration_date',
              from: Date.parse('2021-10-01'),
              to: Date.parse('2021-12-31')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: [
                { id: 'type2', male: 3, total: 3 },
                { id: 'type3', male: 1, total: 1 }
              ]
            },
            {
              group_id: '2021-11',
              data: [
                { id: 'type1', female: 1, total: 1 },
                { id: 'type3', female: 1, total: 1 }
              ]
            },
            {
              group_id: '2021-12',
              data: []
            }
          ]
        )
      end

      it 'return results grouped by the month of service_implemented_day_time' do
        data = ManagedReports::Indicators::CaseReferredAppropriateService.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'service_implemented_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_implemented_day_time',
              from: Date.parse('2021-10-01'),
              to: Date.parse('2021-12-31')
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: [
                { id: 'type2', male: 1, total: 1 }
              ]
            },
            {
              group_id: '2021-11',
              data: [
                { id: 'type3', female: 1, total: 1 }
              ]
            },
            {
              group_id: '2021-12',
              data: [
                { id: 'type1', female: 1, total: 1 }
              ]
            }
          ]
        )
      end
    end
  end
end
