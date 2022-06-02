# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::SurvivorsNumberOfServicesProvided do
  before do
    clean_data(Incident, UserGroup, User, Agency, Role)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::GBV_STATISTICS_REPORT
        ]
      )
    ]
    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: permissions
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions: permissions
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions: permissions
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions: permissions
    )

    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
    agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2')

    group_a = UserGroup.create(unique_id: 'group-a', name: 'Group A')
    group_b = UserGroup.create(unique_id: 'group-b', name: 'Group B')

    @self_user = User.create!(
      full_name: 'Self User',
      user_name: 'self_user',
      email: 'self_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a],
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: agency_role
    )

    @all_user = User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      role: all_role
    )

    Incident.new_with_user(
      @self_user,
      incident_date: Date.new(2021, 2, 12),
      service_safehouse_referral: 'service_provided_by_your_agency',
      health_medical_referral_subform_section:
        [
          { unique_id: '001', service_medical_referral: 'service_provided_by_your_agency' },
          { unique_id: '002', service_medical_referral: 'service_provided_by_your_agency' }
        ]
    ).save!
    Incident.new_with_user(
      @group_user,
      incident_date: Date.new(2021, 1, 8),
      service_safehouse_referral: 'service_provided_by_your_agency',
      psychosocial_counseling_services_subform_section:
        [
          { unique_id: '001', service_psycho_referral: 'service_provided_by_your_agency' }
        ]
    ).save!
    Incident.new_with_user(
      @agency_user,
      incident_date: Date.new(2020, 10, 10),
      service_safehouse_referral: 'service_provided_by_your_agency',
      legal_assistance_services_subform_section:
        [
          { unique_id: '001', service_legal_referral: 'service_provided_by_your_agency' }
        ]
    ).save!
    Incident.new_with_user(
      @all_user,
      incident_date: Date.new(2020, 10, 10),
      service_safehouse_referral: 'service_provided_by_your_agency',
      police_or_other_type_of_security_services_subform_section:
        [
          { unique_id: '001', service_police_referral: 'service_provided_by_your_agency' }
        ],
      livelihoods_services_subform_section:
        [
          { unique_id: '001', service_livelihoods_referral: 'service_provided_by_your_agency' }
        ],
      child_protection_services_subform_section:
        [
          { unique_id: '001', service_protection_referral: 'service_provided_by_your_agency' }
        ]
    ).save!
  end

  it 'returns the total number of survivors by number of services provided' do
    data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build.data

    expect(data).to match_array(
      [
        { 'id' => 'service_safehouse_referral', 'total' => 4 },
        { 'id' => 'service_medical_referral', 'total' => 2 },
        { 'id' => 'service_psycho_referral', 'total' => 1 },
        { 'id' => 'service_legal_referral', 'total' => 1 },
        { 'id' => 'service_police_referral', 'total' => 1 },
        { 'id' => 'service_livelihoods_referral', 'total' => 1 },
        { 'id' => 'service_protection_referral', 'total' => 1 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(@self_user).data

      expect(data).to match_array(
        [
          { 'id' => 'service_safehouse_referral', 'total' => 1 },
          { 'id' => 'service_medical_referral', 'total' => 2 },
          { 'id' => 'service_psycho_referral', 'total' => 0 },
          { 'id' => 'service_legal_referral', 'total' => 0 },
          { 'id' => 'service_police_referral', 'total' => 0 },
          { 'id' => 'service_livelihoods_referral', 'total' => 0 },
          { 'id' => 'service_protection_referral', 'total' => 0 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(@group_user).data

      expect(data).to match_array(
        [
          { 'id' => 'service_safehouse_referral', 'total' => 3 },
          { 'id' => 'service_medical_referral', 'total' => 0 },
          { 'id' => 'service_psycho_referral', 'total' => 1 },
          { 'id' => 'service_legal_referral', 'total' => 1 },
          { 'id' => 'service_police_referral', 'total' => 1 },
          { 'id' => 'service_livelihoods_referral', 'total' => 1 },
          { 'id' => 'service_protection_referral', 'total' => 1 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(@agency_user).data

      expect(data).to match_array(
        [
          { 'id' => 'service_safehouse_referral', 'total' => 2 },
          { 'id' => 'service_medical_referral', 'total' => 0 },
          { 'id' => 'service_psycho_referral', 'total' => 1 },
          { 'id' => 'service_legal_referral', 'total' => 1 },
          { 'id' => 'service_police_referral', 'total' => 0 },
          { 'id' => 'service_livelihoods_referral', 'total' => 0 },
          { 'id' => 'service_protection_referral', 'total' => 0 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(@all_user).data

      expect(data).to match_array(
        [
          { 'id' => 'service_safehouse_referral', 'total' => 4 },
          { 'id' => 'service_medical_referral', 'total' => 2 },
          { 'id' => 'service_psycho_referral', 'total' => 1 },
          { 'id' => 'service_legal_referral', 'total' => 1 },
          { 'id' => 'service_police_referral', 'total' => 1 },
          { 'id' => 'service_livelihoods_referral', 'total' => 1 },
          { 'id' => 'service_protection_referral', 'total' => 1 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              group_id: 2020,
              data:
                [
                  { 'id' => 'service_police_referral', 'total' => 1 },
                  { 'id' => 'service_livelihoods_referral', 'total' => 1 },
                  { 'id' => 'service_legal_referral', 'total' => 1 },
                  { 'id' => 'service_safehouse_referral', 'total' => 2 },
                  { 'id' => 'service_protection_referral', 'total' => 1 }
                ]
            },
            {
              group_id: 2021,
              data:
                [
                  { 'id' => 'service_psycho_referral', 'total' => 1 },
                  { 'id' => 'service_medical_referral', 'total' => 2 },
                  { 'id' => 'service_safehouse_referral', 'total' => 2 }
                ]
            },
            { group_id: 2022, data: [] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2021-03-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [] },
            { group_id: '2020-09', data: [] },
            {
              group_id: '2020-10',
              data: [
                { 'id' => 'service_protection_referral', 'total' => 1 },
                { 'id' => 'service_police_referral', 'total' => 1 },
                { 'id' => 'service_livelihoods_referral', 'total' => 1 },
                { 'id' => 'service_safehouse_referral', 'total' => 2 },
                { 'id' => 'service_legal_referral', 'total' => 1 }
              ]
            },
            { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] },
            {
              group_id: '2021-01',
              data:
                [
                  { 'id' => 'service_psycho_referral', 'total' => 1 },
                  { 'id' => 'service_safehouse_referral', 'total' => 1 }
                ]
            },
            {
              group_id: '2021-02',
              data: [
                { 'id' => 'service_safehouse_referral', 'total' => 1 },
                { 'id' => 'service_medical_referral', 'total' => 2 }
              ]
            },
            { group_id: '2021-03', data: [] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2021-03-31'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [] },
            {
              group_id: '2020-Q4',
              data:
                [
                  { 'id' => 'service_protection_referral', 'total' => 1 },
                  { 'id' => 'service_police_referral', 'total' => 1 },
                  { 'id' => 'service_legal_referral', 'total' => 1 },
                  { 'id' => 'service_safehouse_referral', 'total' => 2 },
                  { 'id' => 'service_livelihoods_referral', 'total' => 1 }
                ]
            },
            {
              group_id: '2021-Q1',
              data:
                [
                  { 'id' => 'service_psycho_referral', 'total' => 1 },
                  { 'id' => 'service_safehouse_referral', 'total' => 2 },
                  { 'id' => 'service_medical_referral', 'total' => 2 }
                ]
            }
          ]
        )
      end
    end
  end
end
