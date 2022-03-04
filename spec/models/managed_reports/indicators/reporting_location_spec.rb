# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ReportingLocation do
  before do
    clean_data(SystemSettings, Role, Agency, UserGroup, User, Incident, Violation, Location)
    SystemSettings.create!(
      default_locale: 'en',
      incident_reporting_location_config: {
        field_key: 'incident_location',
        admin_level: 1,
        admin_level_map: { '1' => ['state'], '2' => ['province'] }
      }
    )
    SystemSettings.current(true)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::VIOLATION_REPORT
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
      reporting_location_code: 1,
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      reporting_location_code: 1,
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      reporting_location_code: 1,
      role: agency_role
    )

    @all_user = User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      reporting_location_code: 1,
      role: all_role
    )

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

    incident1 = Incident.new_with_user(
      @self_user,
      { incident_date: Date.today, status: 'open', incident_location: 'C2' }
    )
    incident1.save!
    incident2 = Incident.new_with_user(
      @group_user,
      { incident_date: Date.today, status: 'open', incident_location: 'C2' }
    )
    incident2.save!
    incident3 = Incident.new_with_user(
      @agency_user,
      { incident_date: Date.today, status: 'open', incident_location: 'C1' }
    )
    incident3.save!
    incident4 = Incident.new_with_user(
      @all_user,
      { incident_date: Date.today, status: 'open', incident_location: 'C2' }
    )
    incident4.save!

    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 3, 'girls': 2, 'unknown': 1, 'total': 6 } },
                      incident_id: incident1.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 3, 'girls': 2, 'unknown': 0, 'total': 5 } },
                      incident_id: incident2.id)
    Violation.create!(data: { type: 'maiming',
                              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 1, 'total': 4 } },
                      incident_id: incident2.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
                      incident_id: incident3.id)
    Violation.create!(data: { type: 'abduction',
                              violation_tally: { 'boys': 1, 'unknown': 1, 'total': 2 } }, incident_id: incident3.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'unknown': 1, 'total': 1 } }, incident_id: incident3.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 1, 'girls': 1, 'total': 2 } }, incident_id: incident4.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 1, 'girls': 1, 'unknown': 1, 'total': 3 } },
                      incident_id: incident4.id)
    Violation.create!(data: { type: 'killing',
                              violation_tally: { 'boys': 1, 'girls': 2, 'unknown': 1, 'total': 4 } },
                      incident_id: incident4.id)
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      reporting_location_data = ManagedReports::Indicators::ReportingLocation.build(
        @self_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(reporting_location_data).to match_array(
        [
          { boys: 3, girls: 2, id: 'E1', total: 6, unknown: 1 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      reporting_location_data = ManagedReports::Indicators::ReportingLocation.build(
        @group_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(reporting_location_data).to match_array(
        [
          { boys: 6, girls: 6, id: 'E1', total: 14, unknown: 2 },
          { boys: 1, girls: 1, id: 'E2', total: 4, unknown: 2 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      reporting_location_data = ManagedReports::Indicators::ReportingLocation.build(
        @agency_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(reporting_location_data).to match_array(
        [
          { boys: 3, girls: 2, id: 'E1', total: 5, unknown: 0 },
          { boys: 1, girls: 1, id: 'E2', total: 4, unknown: 2 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      reporting_location_data = ManagedReports::Indicators::ReportingLocation.build(
        @all_user,
        { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'killing') }
      ).data

      expect(reporting_location_data).to match_array(
        [
          { boys: 9, girls: 8, id: 'E1', total: 20, unknown: 3 },
          { boys: 1, girls: 1, id: 'E2', total: 4, unknown: 2 }
        ]
      )
    end
  end
end
