# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ManagedReports::Indicators::PercentageSuccessfulReferrals do
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

  let(:role1) do
    Role.create!(
      name: 'Role 1',
      unique_id: 'role-1',
      group_permission: Permission::SELF,
      modules: [module1, module2],
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::RECEIVE_REFERRAL]
        )
      ]
    )
  end

  let(:agency1) { Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1') }

  let(:group1) { UserGroup.create(unique_id: 'group-1', name: 'Group 1') }

  let(:user1) do
    User.create!(
      full_name: 'User 1',
      user_name: 'user_1',
      email: 'user1@localhost.com',
      agency_id: agency1.id,
      user_groups: [group1],
      role: role1
    )
  end

  let(:user2) do
    User.create!(
      full_name: 'User 2',
      user_name: 'user_2',
      email: 'user2@localhost.com',
      agency_id: agency1.id,
      user_groups: [group1],
      role: role1
    )
  end

  let(:child1) do
    child1 = Child.new_with_user(
      user1,
      gender: 'male',
      module_id: module1.unique_id,
      registration_date: '2021-10-05',
      services_section: [
        {
          unique_id: '1c9df758-d1d8-11ef-99e2-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'not_implemented',
          service_type: 'type1',
          service_response_day_time: '2021-10-06T10:05:08.350Z'
        },
        {
          unique_id: 'a31b5062-d1da-11ef-835d-18c04db5c362',
          service_implemented: 'not_implemented',
          service_type: 'type2',
          service_response_day_time: '2021-10-07T08:05:08.350Z'
        }
      ]
    )
    child1.save!
    child1
  end

  let(:child2) do
    child2 = Child.new_with_user(
      user1,
      gender: 'male',
      module_id: module1.unique_id,
      registration_date: '2021-10-08',
      consent_reporting: true,
      services_section: [
        {
          unique_id: '1046df62-d1db-11ef-b87d-18c04db5c362',
          service_implemented: 'implemented',
          service_status_referred: true,
          service_type: 'type1',
          service_response_day_time: '2021-10-09T11:35:08.350Z',
          service_implemented_day_time: '2021-10-12T08:05:08.350Z'
        },
        {
          unique_id: '21adebae-d1d8-11ef-ab62-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'not_implemented',
          service_type: 'type2',
          service_response_day_time: '2021-10-10T10:05:08.350Z'
        }
      ]
    )
    child2.save!
    child2
  end

  let(:child3) do
    child3 = Child.new_with_user(
      user1,
      gender: 'male',
      module_id: module2.unique_id,
      registration_date: '2021-11-07',
      services_section: [
        {
          unique_id: '22278df6-d1d8-11ef-967f-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'implemented',
          service_type: 'type1',
          service_response_day_time: '2021-11-08T09:05:08.350Z',
          service_implemented_day_time: '2021-11-15T08:05:08.350Z'
        },
        {
          unique_id: '9d1c264e-d1dc-11ef-b92a-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'not_implemented',
          service_type: 'type3',
          service_response_day_time: '2021-11-09T12:35:08.350Z'
        }
      ]
    )
    child3.save!
    child3
  end

  let(:child4) do
    child4 = Child.new_with_user(
      user2,
      gender: 'female',
      module_id: module2.unique_id,
      registration_date: '2021-10-08',
      consent_reporting: true,
      services_section: [
        {
          unique_id: '227fccd2-d1d8-11ef-bdf0-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'not_implemented',
          service_type: 'type3',
          service_response_day_time: '2021-10-09T08:15:08.350Z'
        },
        {
          unique_id: 'c4aaa866-d1dc-11ef-a3d6-18c04db5c362',
          service_implemented: 'not_implemented',
          service_type: 'type3',
          service_response_day_time: '2021-10-10T12:35:08.350Z'
        },
        {
          unique_id: 'ccad48b6-d1dc-11ef-bf85-18c04db5c362',
          service_status_referred: true,
          service_implemented: 'not_implemented',
          service_type: 'type2',
          service_response_day_time: '2021-10-11T08:35:08.350Z'
        }
      ]
    )
    child4.save!
    child4
  end

  let(:referral1) do
    service = child1.services_section.first
    referral1 = Referral.new(
      transitioned_to: user2.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user1.user_name,
      created_at: service['service_response_day_time'] + 3.days,
      record: child1
    )
    referral1.save(validate: false)
    referral1
  end

  let(:referral2) do
    service = child2.services_section.first
    referral2 = Referral.new(
      transitioned_to: user2.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user1.user_name,
      created_at: service['service_response_day_time'] + 1.months,
      record: child2
    )
    referral2.save(validate: false)
    referral2
  end

  let(:referral3) do
    service = child2.services_section.last
    referral3 = Referral.new(
      transitioned_to: user2.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user1.user_name,
      created_at: service['service_response_day_time'] + 2.months,
      record: child2
    )
    referral3.save(validate: false)
    referral3
  end

  let(:referral4) do
    service = child3.services_section.first
    referral4 = Referral.new(
      transitioned_to: user2.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user1.user_name,
      created_at: service['service_response_day_time'] + 2.days,
      record: child3
    )
    referral4.save(validate: false)
    referral4
  end

  let(:referral5) do
    service = child3.services_section.last
    referral5 = Referral.new(
      transitioned_to: user2.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user1.user_name,
      created_at: service['service_response_day_time'] + 3.days,
      record: child3
    )
    referral5.save(validate: false)
    referral5
  end

  let(:referral6) do
    service = child4.services_section.first
    referral6 = Referral.new(
      transitioned_to: user1.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user2.user_name,
      created_at: service['service_response_day_time'] + 2.days,
      record: child4
    )
    referral6.save(validate: false)
    referral6
  end

  let(:referral7) do
    service = child4.services_section.first
    referral7 = Referral.new(
      transitioned_to: user1.user_name,
      service_record_id: service['unique_id'],
      transitioned_by: user2.user_name,
      created_at: service['service_response_day_time'] + 3.months,
      record: child4
    )
    referral7.save(validate: false)
    referral7
  end

  before do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Referral, Incident, Child, PrimeroModule)
    referral1
    referral2
    referral3
    referral4
    referral5
    referral6
    referral7
  end

  after do
    clean_data(Alert, Lookup, UserGroup, User, Agency, Role, Referral, Incident, Child, PrimeroModule)
  end

  it 'returns data for average_cases_per_case_worker indicator' do
    report_data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(nil, {}).data

    expect(report_data).to match_array(
      [
        { id: 'implemented', male: 40.0, total: 28.57 },
        { id: 'not_implemented', female: 100.0, male: 60.0, total: 71.43 }
      ]
    )
  end

  context 'when consent_reporting is visible' do
    before do
      ManagedReports::FilterService.stub(:consent_reporting_visible?).and_return(true)
    end

    it 'returns data for those records where the consent was provided' do
      report_data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'implemented', male: 50.0, total: 25.0 },
          { id: 'not_implemented', female: 100.0, male: 50.0, total: 75.0 }
        ]
      )
    end
  end

  context 'when gender is null' do
    before do
      child = Child.new_with_user(
        user1,
        id: 'bc691666-f940-11ef-9ac6-18c04db5c362',
        registration_date: '2021-10-05',
        services_section: [
          {
            unique_id: '4b4e488c-f9fb-11ef-a955-18c04db5c362',
            service_implemented: 'not_implemented',
            service_type: 'type2',
            service_response_day_time: '2021-10-07T08:05:08.350Z'
          }
        ]
      )
      child.save!

      service = child.services_section.first
      referral = Referral.new(
        transitioned_to: user1.user_name,
        service_record_id: service['unique_id'],
        transitioned_by: user2.user_name,
        created_at: service['service_response_day_time'] + 3.months,
        record: child
      )
      referral.save(validate: false)
      referral
    end

    it 'returns incomplete_data for null genders' do
      report_data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(nil, {}).data

      expect(report_data).to match_array(
        [
          { id: 'implemented', male: 40.0, total: 25.0 },
          { id: 'not_implemented', female: 100.0, incomplete_data: 100, male: 60.0, total: 75.0 }
        ]
      )
    end

    after do
      Child.find_by(id: 'bc691666-f940-11ef-9ac6-18c04db5c362').destroy!
    end
  end

  it 'filters data for average_cases_per_case_worker indicator by service_type' do
    report_data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
      nil, 'service_type' => SearchFilters::Value.new(field_name: 'service_type', value: 'type1')
    ).data

    expect(report_data).to match_array(
      [
        { id: 'implemented', male: 66.67, total: 66.67 },
        { id: 'not_implemented', male: 33.33, total: 33.33 }
      ]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year for service_response_day_time' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'service_response_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_response_day_time',
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
                { id: 'implemented', male: 40.0, total: 28.57 },
                { id: 'not_implemented', female: 100.0, male: 60.0, total: 71.43 }
              ]
            }
          ]
        )
      end

      it 'should return results grouped by year for referral_created_at' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'referral_created_at' => SearchFilters::DateRange.new(
              field_name: 'referral_created_at',
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
                { id: 'implemented', male: 40.0, total: 33.33 },
                { id: 'not_implemented', female: 100.0, male: 60.0, total: 66.67 }
              ]
            }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month for service_response_day_time' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'service_response_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_response_day_time',
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
                { id: 'implemented', male: 33.33, total: 20.0 },
                { id: 'not_implemented', female: 100.0, male: 66.67, total: 80.0 }
              ]
            },
            {
              group_id: '2021-11',
              data: [
                { id: 'implemented', male: 50.0, total: 50.0 },
                { id: 'not_implemented', male: 50.0, total: 50.0 }
              ]
            }
          ]
        )
      end

      it 'should return results grouped by month for referral_created_at' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'referral_created_at' => SearchFilters::DateRange.new(
              field_name: 'referral_created_at',
              from: '2021-10-01',
              to: '2021-11-30'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: '2021-10',
              data: [{ id: 'not_implemented', female: 100.0, male: 100.0, total: 100.0 }]
            },
            {
              group_id: '2021-11',
              data: [
                { id: 'implemented', male: 66.67, total: 66.67 },
                { id: 'not_implemented', male: 33.33, total: 33.33 }
              ]
            }
          ]
        )
      end
    end

    context 'when is week' do
      it 'should return results grouped by week for service_response_day_time' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'service_response_day_time' => SearchFilters::DateRange.new(
              field_name: 'service_response_day_time',
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
                { id: 'implemented', male: 50.0, total: 33.33 },
                { id: 'not_implemented', female: 100.0, male: 50.0, total: 66.67 }
              ]
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: [{ id: 'not_implemented', female: 100.0, male: 100.0, total: 100.0 }]
            }
          ]
        )
      end

      it 'should return results grouped by week for referral_created_at' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
            'referral_created_at' => SearchFilters::DateRange.new(
              field_name: 'referral_created_at',
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
              data: [{ id: 'not_implemented', male: 100.0, total: 100.0 }]
            },
            {
              group_id: '2021-10-10 - 2021-10-16',
              data: [{ id: 'not_implemented', female: 100.0, total: 100.0 }]
            }
          ]
        )
      end
    end
  end

  describe 'module_id' do
    context 'when set' do
      it 'should return results by module' do
        data = ManagedReports::Indicators::PercentageSuccessfulReferrals.build(
          nil,
          {
            'module_id' => SearchFilters::Value.new(field_name: 'module_id', value: 'primeromodule-cp-a')
          }
        ).data

        expect(data).to match_array(
          [
            { id: 'implemented', male: 33.33, total: 33.33 },
            { id: 'not_implemented', male: 66.67, total: 66.67 }
          ]
        )
      end
    end
  end
end
