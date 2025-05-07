# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::ImplementedSuccessfulReferrals do
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
        gender: 'male',
        module_id: 'test_module',
        registration_date: '2021-10-05',
        consent_reporting: true,
        services_section: [
          {
            unique_id: '1c9df758-d1d8-11ef-99e2-18c04db5c362',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          },
          {
            unique_id: 'a31b5062-d1da-11ef-835d-18c04db5c362',
            service_implemented: 'implemented',
            service_status_referred: true,
            service_implemented_day_time: '2021-10-07T08:05:08.350Z'
          }
        ]
      }
    )
  end

  let(:child2) do
    Child.create!(
      data: {
        gender: 'male',
        module_id: 'test_module',
        registration_date: '2021-10-08',
        consent_reporting: true,
        services_section: [
          {
            unique_id: '1046df62-d1db-11ef-b87d-18c04db5c362',
            service_implemented: 'implemented',
            service_status_referred: true,
            service_implemented_day_time: '2021-10-09T11:35:08.350Z'
          }
        ]
      }
    )
  end

  let(:child3) do
    Child.create!(
      data: {
        gender: 'male',
        module_id: 'test_module',
        registration_date: '2021-11-07',
        consent_reporting: true,
        services_section: [
          {
            unique_id: '22278df6-d1d8-11ef-967f-18c04db5c362',
            service_status_referred: true,
            service_implemented: 'implemented',
            service_implemented_day_time: '2021-11-08T09:05:08.350Z'
          }
        ]
      }
    )
  end

  let(:child4) do
    Child.create!(
      data: {
        gender: 'female',
        registration_date: '2021-10-08',
        module_id: 'test_module',
        services_section: [
          {
            unique_id: '227fccd2-d1d8-11ef-bdf0-18c04db5c362',
            service_status_referred: true,
            service_implemented: 'not_implemented'
          },
          {
            unique_id: 'ccad48b6-d1dc-11ef-bf85-18c04db5c362',
            service_status_referred: true,
            service_implemented: 'implemented',
            service_implemented_day_time: '2021-10-11T08:35:08.350Z'
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

  it 'returns data for implemented_successful_referrals indicator' do
    report_data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(nil, {}).data

    expect(report_data).to match_array([{ id: 'implemented', male: 3, female: 1, total: 4 }])
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(nil, {}).data

      expect(report_data).to match_array([{ id: 'implemented', male: 3, total: 3 }])
    end
  end

  context 'when gender is null' do
    before do
      Child.create!(
        id: 'bc691666-f940-11ef-9ac6-18c04db5c362',
        data: {
          registration_date: '2021-10-08',
          module_id: 'test_module',
          services_section: [
            {
              unique_id: '227fccd2-d1d8-11ef-bdf0-18c04db5c362',
              service_status_referred: true,
              service_implemented: 'not_implemented'
            },
            {
              unique_id: 'ccad48b6-d1dc-11ef-bf85-18c04db5c362',
              service_status_referred: true,
              service_implemented: 'implemented',
              service_implemented_day_time: '2021-10-11T08:35:08.350Z'
            }
          ]
        }
      )
    end

    it 'returns incomplete_data for null genders' do
      report_data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(nil, {}).data

      expect(report_data).to match_array([{ id: 'implemented', male: 3, incomplete_data: 1, female: 1, total: 5 }])
    end

    after do
      Child.find_by(id: 'bc691666-f940-11ef-9ac6-18c04db5c362').destroy!
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'service_implemented_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_implemented_day_time',
              from: '2021-01-01',
              to: '2021-12-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2021,
              data: [{ id: 'implemented', male: 3, female: 1, total: 4 }]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'service_implemented_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_implemented_day_time',
              from: '2021-10-01',
              to: '2021-11-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: [{ id: 'implemented', male: 2, female: 1, total: 3 }]
            },
            {
              group_id: '2021-11',
              data: [{ id: 'implemented', male: 1, total: 1 }]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week' do
        data = ManagedReports::Indicators::ImplementedSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'service_implemented_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_implemented_day_time',
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
              data: [{ id: 'implemented', male: 2, total: 2 }]
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: [{ id: 'implemented', female: 1, total: 1 }]
            }
          ]
        )
      end
    end
  end
end
