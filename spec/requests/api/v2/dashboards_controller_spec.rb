# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::DashboardsController, type: :request do
  before :each do
    clean_data(User, UserGroup, Role, Child, Location, SystemSettings, Field, FormSection, Lookup, PrimeroModule)

    SystemSettings.create!(
      reporting_location_config: {
        admin_level: 2,
        field_key: 'owned_by_location'
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
        Permission::DASH_GROUP_OVERVIEW
      ]
    )

    group1 = UserGroup.create!(name: 'Group1')

    Location.create!(placename_en: 'Country', location_code: 'CNT', admin_level: 0, type: 'country', hierarchy_path: '')
    Location.create!(placename_en: 'State', location_code: 'STE', admin_level: 1, type: 'state', hierarchy_path: 'CTE')
    Location.create!(placename_en: 'City', location_code: 'CTY',
                     admin_level: 2, type: 'city', hierarchy_path: 'CTE.STE')

    Lookup.create!(
      unique_id: 'lookup-protection-concerns',
      name_en: 'Protection Concerns',
      lookup_values_en: [
        { id: 'refugee', display_text: 'Refugee' }.with_indifferent_access
      ]
    )

    @foo = User.new(user_name: 'foo', user_groups: [group1], location: 'CTY')
    @foo.save(validate: false)
    @bar = User.new(user_name: 'bar', user_groups: [group1], location: 'CTY')
    @bar.save(validate: false)

    Child.create!(data: {
                    record_state: true, status: 'open', owned_by: 'foo', workflow: 'new',
                    created_at: last_week, protection_concerns: ['refugee']
                  })
    Child.create!(data: {
                    record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar',
                    workflow: 'assessment', protection_concerns: ['refugee']
                  })
    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: this_week, workflow: 'closed', protection_concerns: ['refugee']
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: this_week, workflow: 'closed'
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo', date_closure: last_week,
                    workflow: 'closed', created_at: last_week, protection_concerns: ['refugee']
                  })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'bar' })

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/dashboards', search: true do
    it 'lists statistics for permitted dashboards' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [@permission_case, @permission_dashboard]
      )
      get '/api/v2/dashboards'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(5)

      case_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.case_overview' }
      expect(case_overview_dashboard['indicators']['total']['count']).to eq(2)
      expect(case_overview_dashboard['indicators']['total']['query']).to match_array(
        %w[record_state=true status=open]
      )
      expect(case_overview_dashboard['indicators']['new_or_updated']['count']).to eq(1)
      expect(case_overview_dashboard['indicators']['new_or_updated']['query']).to match_array(
        %w[record_state=true status=open not_edited_by_owner=true]
      )

      workflow_dashboard = json['data'].find { |d| d['name'] == 'dashboard.workflow' }
      expect(workflow_dashboard['indicators']['workflow']['assessment']['count']).to eq(1)
      expect(workflow_dashboard['indicators']['workflow']['assessment']['query']).to match_array(
        %w[owned_by=foo record_state=true status=open,closed workflow=assessment]
      )

      reporting_location_dashboard = json['data'].find { |d| d['name'] == 'dashboard.reporting_location' }
      expect(reporting_location_dashboard['indicators']['reporting_location_open']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_this_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_last_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_this_week']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_last_week']['cty']['count']).to eq(1)

      protection_concerns_dashboard = json['data'].find { |d| d['name'] == 'dashboard.dash_protection_concerns' }
      expect(protection_concerns_dashboard['indicators']['protection_concerns_open_cases']['refugee']['count']).to eq(2)
      expect(protection_concerns_dashboard['indicators']['protection_concerns_new_this_week']['refugee']['count']).to eq(1)
      expect(protection_concerns_dashboard['indicators']['protection_concerns_all_cases']['refugee']['count']).to eq(4)
      expect(protection_concerns_dashboard['indicators']['protection_concerns_closed_this_week']['refugee']['count']).to eq(1)

      group_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.dash_group_overview' }
      expect(group_overview_dashboard['indicators']['group_overview_open']['count']).to eq(2)
      expect(group_overview_dashboard['indicators']['group_overview_closed']['count']).to eq(3)
    end

    describe 'Test the shared with dashboard', search: true do
      before :each do
        @primero_module = PrimeroModule.new(name: 'CP')
        @primero_module.save(validate: false)
        @permission_refer_case = Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ, Permission::WRITE, Permission::CREATE,
            Permission::REFERRAL, Permission::RECEIVE_REFERRAL,
            Permission::TRANSFER, Permission::RECEIVE_TRANSFER
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
                         ], modules: [@primero_module])
        @role.save(validate: false)
        @group_a = UserGroup.create!(name: 'Group_a')
        @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group_a])
        @user1.save(validate: false)
        @group_b = UserGroup.create!(name: 'Group_b')
        @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group_a])
        @user2.save(validate: false)
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
        Sunspot.commit
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
          %w[referred_users=user2 !last_updated_by=user2 record_state=true status=open]
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

      it 'lists statistics for permitted shared with my team dashboard dashboards' do
        login_for_test(
          user_name: 'user1',
          group_permission: Permission::SELF,
          permissions: [@permission_case, @permission_dashboard_shared_with_me_team]
        )
        get '/api/v2/dashboards'

        expect(response).to have_http_status(200)
        indicators = json['data'][0]['indicators']
        expect(indicators['shared_with_my_team_referrals'][@user2.user_name]['count']).to eq(1)
        expect(indicators['shared_with_my_team_pending_transfers'][@user2.user_name]['count']).to eq(2)
      end

      after :each do
        clean_data(User, UserGroup, Role, Child, Location, SystemSettings, Lookup)
        Sunspot.commit
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
    clean_data(User, UserGroup, Role, Child, Location, SystemSettings, Lookup)
    Sunspot.commit
  end
end
