# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::DashboardsController, type: :request do
  before do
    clean_data(
      Alert, User, UserGroup, Role, Incident, Child, Location, SystemSettings, Field, FormSection, Lookup, PrimeroModule
    )

    SystemSettings.create!(
      reporting_location_config: {
        admin_level: 2,
        field_key: 'owned_by_location'
      },
      changes_field_to_form: {
        incident_details: 'incident_from_case'
      }
    )

    SystemSettings.current(true)

    @permission_case = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ]
    )
    @permission_dashboard = Permission.new(
      resource: Permission::DASHBOARD,
      actions: [
        Permission::DASH_WORKFLOW,
        Permission::DASH_CASE_OVERVIEW,
        Permission::DASH_REPORTING_LOCATION,
        Permission::DASH_PROTECTION_CONCERNS,
        Permission::DASH_GROUP_OVERVIEW,
        Permission::DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
        Permission::DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
        Permission::DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS,
        Permission::DASH_CASES_BY_TASK_OVERDUE_SERVICES,
        Permission::DASH_CASE_INCIDENT_OVERVIEW,
        Permission::DASH_WORKFLOW_TEAM,
        Permission::DASH_CASES_BY_SOCIAL_WORKER,
        Permission::DASH_NATIONAL_ADMIN_SUMMARY
      ]
    )

    group1 = UserGroup.create!(unique_id: 'usergroup-group1', name: 'Group1')

    @primero_module = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      associated_record_types: %w[case tracing_request incident]
    )

    @role = Role.new(
      permissions: [
        @permission_dashboard,
        @permission_case
      ],
      modules: [@primero_module],
      group_permission: Permission::GROUP
    )
    @role.save(validate: false)
    Location.create!(placename_en: 'Country', location_code: 'CNT', type: 'country')
    Location.create!(placename_en: 'State', location_code: 'STE', type: 'state', hierarchy_path: 'CNT.STE')
    Location.create!(placename_en: 'City', location_code: 'CTY',
                     type: 'city', hierarchy_path: 'CNT.STE.CTY')

    Lookup.create!(
      unique_id: 'lookup-protection-concerns',
      name_en: 'Protection Concerns',
      lookup_values_en: [
        { id: 'refugee', display_text: 'Refugee' }.with_indifferent_access
      ]
    )

    @foo = User.new(user_name: 'foo', user_groups: [group1], location: 'CTY', role: @role)
    @foo.save(validate: false)
    @bar = User.new(user_name: 'bar', user_groups: [group1], location: 'CTY')
    @bar.save(validate: false)

    Child.create!(
      data: {
        record_state: true, status: 'open', owned_by: 'foo', workflow: 'new', created_at: last_week,
        protection_concerns: ['refugee'], followup_subform_section: [{ followup_needed_by_date: Time.zone.now }],
        assessment_due_date: Time.zone.now, case_plan_due_date: Time.zone.now, services_section: [
          {
            service_type: 'health_medical_service', service_referral: 'referred',
            service_implemented: 'not_implemented', service_response_type: 'care_plan',
            service_appointment_date: (Date.today - 7.days),
            service_response_day_time: (Date.today - 7.days), service_response_timeframe: '3_days'
          }
        ], module_id: PrimeroModule::CP
      }
    )
    child = Child.create!(
      data: {
        record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar', workflow: 'assessment',
        protection_concerns: ['refugee'], followup_subform_section: [{ followup_needed_by_date: Time.zone.now }],
        assessment_due_date: Time.zone.now, case_plan_due_date: Time.zone.now,
        module_id: PrimeroModule::CP
      }
    )

    # TODO: This alert shouldn't be necessary once alerts on incidents get fixed.
    child.add_alert(type: Alertable::INCIDENT_FROM_CASE, alert_for: Alertable::FIELD_CHANGE)

    Incident.create!(
      data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' }, incident_case_id: child.id
    )

    child.reload
    child.update_properties(@bar, name_first: 'Updated Name')
    child.save!

    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: last_week, workflow: 'closed', protection_concerns: ['refugee']
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo', created_at: last_week,
                    date_closure: this_week, workflow: 'closed'
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo', date_closure: this_week,
                    workflow: 'closed', created_at: last_week, protection_concerns: ['refugee']
                  })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar' })
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/dashboards', search: true do
    it 'lists all the permitted dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(13)
    end

    it 'lists statistics for the case overview dashboard' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      case_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.case_overview' }
      expect(case_overview_dashboard['indicators']['total']['count']).to eq(2)
      expect(case_overview_dashboard['indicators']['total']['query']).to match_array(
        %w[record_state=true status=open]
      )
      expect(case_overview_dashboard['indicators']['new_or_updated']['count']).to eq(1)
      expect(case_overview_dashboard['indicators']['new_or_updated']['query']).to match_array(
        %w[record_state=true status=open not_edited_by_owner=true]
      )
    end

    it 'lists statistics for the workflow dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard],
        role: @role
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)
      workflow_dashboard = json['data'].find { |d| d['name'] == 'dashboard.workflow' }
      expect(workflow_dashboard['indicators']['workflow_primeromodule-cp']['assessment']['count']).to eq(1)
      expect(workflow_dashboard['indicators']['workflow_primeromodule-cp']['assessment']['query']).to match_array(
        %w[module_id=primeromodule-cp owned_by=foo record_state=true status=open,closed workflow=assessment]
      )
    end

    it 'lists statistics for the reporting location dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      reporting_location_dashboard = json['data'].find { |d| d['name'] == 'dashboard.reporting_location' }
      expect(reporting_location_dashboard['indicators']['reporting_location_open']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_this_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_last_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_this_week']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_last_week']['cty']['count']).to eq(1)
    end

    it 'lists statistics for the protection concerns dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      protection_concerns = json['data'].find { |d| d['name'] == 'dashboard.dash_protection_concerns' }['indicators']
      expect(protection_concerns['protection_concerns_open_cases']['refugee']['count']).to eq(2)
      expect(protection_concerns['protection_concerns_new_this_week']['refugee']['count']).to eq(1)
      expect(protection_concerns['protection_concerns_all_cases']['refugee']['count']).to eq(4)
      expect(protection_concerns['protection_concerns_closed_this_week']['refugee']['count']).to eq(1)
    end

    it 'lists statistics for the group overview dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      group_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.dash_group_overview' }
      expect(group_overview_dashboard['indicators']['group_overview_open']['count']).to eq(2)
      expect(group_overview_dashboard['indicators']['group_overview_closed']['count']).to eq(3)
    end

    it 'lists statistics for the task overdue assessment plan dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      tasks_overdue_assessment = json['data'].find { |d| d['name'] == 'dashboard.cases_by_task_overdue_assessment' }
      expect(tasks_overdue_assessment['indicators']['tasks_overdue_assessment']['foo']['count']).to eq(2)
      expect(tasks_overdue_assessment['indicators']['tasks_overdue_assessment'].count).to eq(1)
    end

    it 'lists statistics for the task overdue case plan dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      tasks_overdue_case_plan = json['data'].find { |d| d['name'] == 'dashboard.cases_by_task_overdue_case_plan' }
      expect(tasks_overdue_case_plan['indicators']['tasks_overdue_case_plan']['foo']['count']).to eq(2)
      expect(tasks_overdue_case_plan['indicators']['tasks_overdue_case_plan'].count).to eq(1)
    end

    it 'lists statistics for the task overdue followups dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      tasks_overdue_followups = json['data'].find { |d| d['name'] == 'dashboard.cases_by_task_overdue_followups' }
      expect(tasks_overdue_followups['indicators']['tasks_overdue_followups']['foo']['count']).to eq(2)
      expect(tasks_overdue_followups['indicators']['tasks_overdue_followups'].count).to eq(1)
    end

    it 'lists statistics for the task overdue services dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      tasks_overdue_services = json['data'].find { |d| d['name'] == 'dashboard.cases_by_task_overdue_services' }
      expect(tasks_overdue_services['indicators']['tasks_overdue_services']['foo']['count']).to eq(1)
      expect(tasks_overdue_services['indicators']['tasks_overdue_services'].count).to eq(1)
    end

    it 'lists statistics for the case incident overview dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      case_incident_overview = json['data'].find { |d| d['name'] == 'dashboard.dash_case_incident_overview' }
      expect(case_incident_overview['indicators'].count).to eq(5)
      expect(case_incident_overview['indicators']['total']['count']).to eq(2)
      expect(case_incident_overview['indicators']['new_or_updated']['count']).to eq(1)
      expect(case_incident_overview['indicators']['with_incidents']['count']).to eq(1)
      expect(case_incident_overview['indicators']['with_new_incidents']['count']).to eq(1)
      expect(case_incident_overview['indicators']['without_incidents']['count']).to eq(1)
    end

    it 'lists statistics for the cases by social worker dashboards' do
      login_for_test(
        user_name: 'foo',
        user_group_unique_ids: @foo.user_group_unique_ids,
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      cases_by_social_worker = json['data'].find { |d| d['name'] == 'dashboard.dash_cases_by_social_worker' }
      expect(cases_by_social_worker['indicators'].count).to eq(2)
      expect(cases_by_social_worker['indicators'].keys).to match_array(%w[cases_by_social_worker_total
                                                                          cases_by_social_worker_new_or_updated])
      expect(cases_by_social_worker['indicators']['cases_by_social_worker_total']['foo']['count']).to eq(2)
      expect(cases_by_social_worker['indicators']['cases_by_social_worker_new_or_updated']['foo']['count']).to eq(1)
    end

    it 'lists statistics for the national admin summary dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )

      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)

      national_admin_summary = json['data'].find { |d| d['name'] == 'dashboard.dash_national_admin_summary' }
      expect(national_admin_summary['indicators'].count).to eq(5)
      expect(national_admin_summary['indicators']['open']['count']).to eq(2)
      expect(national_admin_summary['indicators']['new_last_week']['count']).to eq(1)
      expect(national_admin_summary['indicators']['new_this_week']['count']).to eq(1)
      expect(national_admin_summary['indicators']['closed_last_week']['count']).to eq(1)
      expect(national_admin_summary['indicators']['closed_this_week']['count']).to eq(2)
    end

    describe 'Test the shared with dashboard', search: true do
      before :each do
        @permission_refer_case = Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ, Permission::WRITE, Permission::CREATE,
            Permission::REFERRAL, Permission::RECEIVE_REFERRAL,
            Permission::TRANSFER, Permission::RECEIVE_TRANSFER
          ]
        )
        @permission_dashboard_shared_with_my_team_overview = Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_SHARED_WITH_MY_TEAM_OVERVIEW
          ]
        )
        @permission_dashboard_shared_from_my_team = Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_SHARED_FROM_MY_TEAM
          ]
        )
        @role = Role.new(permissions: [
                           @permission_refer_case,
                           @permission_dashboard_shared_from_my_team
                         ], modules: [@primero_module], group_permission: Permission::GROUP)
        @role2 = Role.new(permissions: [
                            @permission_refer_case,
                            @permission_dashboard_shared_with_my_team_overview
                          ], group_permission: Permission::GROUP, modules: [@primero_module])
        @role.save(validate: false)
        @group_a = UserGroup.create!(name: 'Group_a')
        @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group_a])
        @user1.save(validate: false)
        @group_b = UserGroup.create!(name: 'Group_b')
        @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group_a])
        @user2.save(validate: false)
        @user3 = User.new(user_name: 'user3', role: @role2, user_groups: [@group_a])
        @user3.save(validate: false)
        @case_a = Child.create(
          data: {
            name: 'Test_a', owned_by: 'user1',
            disclosure_other_orgs: true, consent_for_services: true,
            module_id: @primero_module.unique_id, last_updated_by: 'user1'
          }
        )
        @case_b = Child.create(
          data: {
            name: 'Test_b', owned_by: 'user1',
            disclosure_other_orgs: true, consent_for_services: true,
            module_id: @primero_module.unique_id, last_updated_by: 'user2'
          }
        )

        @permission_dashboard_shared_with_me = Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_SHARED_WITH_ME
          ]
        )
        @permission_dashboard_shared_with_others = Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_SHARED_WITH_OTHERS
          ]
        )
        @permission_dashboard_shared_with_me_team = Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_SHARED_WITH_MY_TEAM
          ]
        )
        Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_a)
        Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_a)
        Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case_b)
        @case_b.update(transfer_status: Transition::STATUS_REJECTED)
        @case_a.save!
      end

      it 'lists statistics for permitted shared with me dashboards' do
        login_for_test(
          user_name: 'user2',
          group_permission: Permission::SELF,
          permissions: [@permission_case, @permission_dashboard_shared_with_me]
        )
        get '/api/v2/dashboards'

        expect(response).to have_http_status(200)

        shared_with_me_dashboard = json['data'][0]['indicators']
        expect(shared_with_me_dashboard['shared_with_me_total_referrals']['count']).to eq(1)
        expect(shared_with_me_dashboard['shared_with_me_new_referrals']['count']).to eq(1)
        expect(shared_with_me_dashboard['shared_with_me_transfers_awaiting_acceptance']['count']).to eq(2)
        expect(shared_with_me_dashboard['shared_with_me_total_referrals']['query']).to match_array(
          %w[referred_users=user2 record_state=true status=open]
        )
        expect(shared_with_me_dashboard['shared_with_me_new_referrals']['query']).to match_array(
          %w[referred_users=user2 not[last_updated_by]=user2 record_state=true status=open]
        )
        expect(shared_with_me_dashboard['shared_with_me_transfers_awaiting_acceptance']['query']).to match_array(
          %w[transferred_to_users=user2 record_state=true status=open]
        )
      end

      it 'lists statistics for permitted shared with others dashboards' do
        login_for_test(
          user_name: 'user1',
          group_permission: Permission::SELF,
          permissions: [@permission_case, @permission_dashboard_shared_with_others]
        )
        get '/api/v2/dashboards'

        expect(response).to have_http_status(200)

        expect(json['data'][0]['indicators']['shared_with_others_referrals']['count']).to eq(1)
        expect(json['data'][0]['indicators']['shared_with_others_pending_transfers']['count']).to eq(1)
        expect(json['data'][0]['indicators']['shared_with_others_rejected_transfers']['count']).to eq(1)
      end

      it 'lists statistics for permitted shared from my team dashboard dashboards' do
        sign_in(@user1)
        get '/api/v2/dashboards'

        expect(response).to have_http_status(200)

        dash = json['data'][0]['indicators']
        expect(dash['shared_from_my_team_referrals'][@user1.user_name]['count']).to eq(1)
        expect(dash['shared_from_my_team_pending_transfers'][@user1.user_name]['count']).to eq(1)
        expect(dash['shared_from_my_team_rejected_transfers'][@user1.user_name]['count']).to eq(1)
        expect(dash['shared_from_my_team_referrals'].count).to eq(1)
        expect(dash['shared_from_my_team_pending_transfers'].count).to eq(1)
        expect(dash['shared_from_my_team_rejected_transfers'].count).to eq(1)
      end

      describe 'shared with my team dashboard' do
        it 'list statistics for a user with admin permissions' do
          login_for_test(
            group_permission: Permission::ALL,
            permissions: [@permission_case, @permission_dashboard_shared_with_me_team]
          )
          get '/api/v2/dashboards'

          expect(response).to have_http_status(200)
          indicators = json['data'][0]['indicators']
          expect(indicators['shared_with_my_team_referrals'][@user2.user_name]['count']).to eq(1)
          expect(indicators['shared_with_my_team_pending_transfers'][@user2.user_name]['count']).to eq(2)
        end

        it 'lists statistics for a user with group permissions' do
          login_for_test(
            user_name: 'user1',
            user_group_unique_ids: [@group_a.unique_id],
            permissions: [@permission_case, @permission_dashboard_shared_with_me_team]
          )
          get '/api/v2/dashboards'

          expect(response).to have_http_status(200)
          indicators = json['data'][0]['indicators']
          expect(indicators['shared_with_my_team_referrals'][@user2.user_name]['count']).to eq(1)
          expect(indicators['shared_with_my_team_pending_transfers'][@user2.user_name]['count']).to eq(2)
        end

        it 'do not list statistics if values are not in the scope of the user' do
          login_for_test(
            group_permission: Permission::SELF,
            permissions: [@permission_case, @permission_dashboard_shared_with_me_team]
          )
          get '/api/v2/dashboards'

          expect(response).to have_http_status(200)
          indicators = json['data'][0]['indicators']
          expect(indicators['shared_with_my_team_referrals']).to be_empty
          expect(indicators['shared_with_my_team_pending_transfers']).to be_empty
        end
      end

      it 'lists statistics for permitted shared with my team (overview) dashboards' do
        sign_in(@user3)

        get '/api/v2/dashboards'

        expect(response).to have_http_status(200)
        expect(json['data'][0]['indicators']['shared_with_my_team_pending_transfers_overview']['count']).to eq(1)
      end

      after :each do
        clean_data(Alert, User, UserGroup, Role, Incident, Child, Location, SystemSettings, Lookup)
      end
    end
  end

  it 'returns an empty dashboard set if no explicit dashboard authorization' do
    login_for_test(permissions: [])
    get '/api/v2/dashboards'

    expect(response).to have_http_status(200)
    expect(json['data'].size).to eq(0)
  end

  after :each do
    clean_data(
      Alert, User, UserGroup, Role, Incident, Child, Location, SystemSettings, Field, FormSection, Lookup, PrimeroModule
    )
  end
end
