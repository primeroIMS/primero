# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ReportingLocationDenials do
  before do
    clean_data(SystemSettings, User, Role, Agency, Incident, Violation, Location)
    SystemSettings.create!(
      default_locale: 'en',
      incident_reporting_location_config: {
        field_key: 'incident_location',
        admin_level: 1,
        admin_level_map: { '1' => ['state'], '2' => ['province'] }
      }
    )
    SystemSettings.current(true)

    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          actions: [
            Permission::VIOLATION_REPORT
          ]
        )
      ]
    )
    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    locations = [
      { placename_i18n: { "en": 'US' }, location_code: 'US', admin_level: 0, type: 'country', hierarchy_path: 'US' },
      { placename_i18n: { "en": 'E1' }, location_code: 'E1', admin_level: 1, type: 'state', hierarchy_path: 'US.E1' },
      { placename_i18n: { "en": 'E2' }, location_code: 'E2', admin_level: 1, type: 'state', hierarchy_path: 'US.E2' },
      {
        placename_i18n: { "en": 'C1' }, location_code: 'C1', admin_level: 2,
        type: 'province', hierarchy_path: 'US.E2.C1'
      },
      {
        placename_i18n: { "en": 'C2' }, location_code: 'C2', admin_level: 2,
        type: 'province', hierarchy_path: 'US.E1.C2'
      }
    ]
    InsertAllService.insert_all(Location, locations)

    incident = Incident.create!(data: { incident_date: Date.new(2020, 8, 8), status: 'open', incident_location: 'C2' })
    incident2 = Incident.create!(data: { incident_date: Date.new(2021, 5, 8), status: 'open', incident_location: 'C2' })
    incident3 = Incident.create!(
      data: { incident_date: Date.new(2022, 2, 18), status: 'open', incident_location: 'C1' }
    )
    incident4 = Incident.create!(
      data: { incident_date: Date.new(2022, 3, 28), status: 'open', incident_location: 'C2' }
    )

    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'maiming' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)

    @user = User.create!(
      full_name: 'Test User 1', user_name: 'test_user_a', email: 'test_user_a@localhost.com',
      agency_id: agency_a.id, role: role, reporting_location_code: 1
    )
  end

  it 'returns data for reporting location indicator' do
    reporting_location_data = ManagedReports::Indicators::ReportingLocationDenials.build(
      @user,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(reporting_location_data).to match_array(
      [{ id: 'E1', total: 7 }, { id: 'E2', total: 3 }]
    )
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::ReportingLocationDenials.build(
          @user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: 2020, data: [{ id: 'E1', total: 1 }] },
            { group_id: 2021, data: [{ id: 'E1', total: 1 }] },
            { group_id: 2022, data: [{ id: 'E1', total: 5 }, { id: 'E2', total: 3 }] }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::ReportingLocationDenials.build(
          @user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-08', data: [{ id: 'E1', total: 1 }] },
            { group_id: '2020-09', data: [] }, { group_id: '2020-10', data: [] }, { group_id: '2020-11', data: [] },
            { group_id: '2020-12', data: [] }, { group_id: '2021-01', data: [] }, { group_id: '2021-02', data: [] },
            { group_id: '2021-03', data: [] }, { group_id: '2021-04', data: [] },
            { group_id: '2021-05', data: [{ id: 'E1', total: 1 }] },
            { group_id: '2021-06', data: [] }, { group_id: '2021-07', data: [] }, { group_id: '2021-08', data: [] },
            { group_id: '2021-09', data: [] }, { group_id: '2021-10', data: [] }, { group_id: '2021-11', data: [] },
            { group_id: '2021-12', data: [] }, { group_id: '2022-01', data: [] },
            { group_id: '2022-02', data: [{ id: 'E2', total: 3 }] },
            { group_id: '2022-03', data: [{ id: 'E1', total: 5 }] }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::ReportingLocationDenials.build(
          @user,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-03-30'
            ),
            'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access')
          }
        ).data

        expect(data).to match_array(
          [
            { group_id: '2020-Q3', data: [{ id: 'E1', total: 1 }] },
            { group_id: '2020-Q4', data: [] }, { group_id: '2021-Q1', data: [] },
            { group_id: '2021-Q2', data: [{ id: 'E1', total: 1 }] },
            { group_id: '2021-Q3', data: [] }, { group_id: '2021-Q4', data: [] },
            { group_id: '2022-Q1', data: [{ id: 'E1', total: 5 }, { id: 'E2', total: 3 }] }
          ]
        )
      end
    end
  end
end
