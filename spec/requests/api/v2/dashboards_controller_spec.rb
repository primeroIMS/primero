require 'rails_helper'

describe Api::V2::DashboardsController, type: :request do

  before :each do
    Lookup.delete_all

    SystemSettings.create!(reporting_location_config: {
      admin_level: 2,
      field_key: 'owned_by_location'
    })

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
        Permission::DASH_PROTECTION_CONCERNS
      ]
    )

    group1 = UserGroup.create!(name: 'Group1')

    Location.create!( placename_en: "Country", location_code:"CNT", admin_level: 0, type: "country", hierarchy_path: "")
    Location.create!( placename_en: "State", location_code:"STE", admin_level: 1, type: "state", hierarchy_path: "CTE")
    Location.create!( placename_en: "City", location_code:"CTY", admin_level: 2, type: "city", hierarchy_path: "CTE.STE")

    Lookup.create!(
      unique_id: 'lookup-protection-concerns',
      name_en: 'Protection Concerns',
      lookup_values_en: [
        {id: 'refugee', display_text: 'Refugee'}.with_indifferent_access
      ]
    )

    @foo = User.new(user_name: 'foo', user_groups: [group1], location: 'CTY')
    @foo.save(validate: false)
    @bar = User.new(user_name: 'bar', user_groups: [group1], location: 'CTY')
    @bar.save(validate: false)


    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', workflow: 'new', created_at: 1.week.ago, protection_concerns: ['refugee'] })
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar', workflow: 'assessment', protection_concerns: ['refugee'] })
    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 1.day.ago, workflow: 'closed', protection_concerns: ['refugee'] })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 2.days.ago, workflow: 'closed' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'foo', date_closure: 15.days.ago, workflow: 'closed', created_at: 1.week.ago, protection_concerns: ['refugee'] })
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
      expect(json['data'].size).to eq(4)

      case_overview_dashboard = json['data'].find { |d| d['name'] == 'dashboard.case_overview' }
      expect(case_overview_dashboard['indicators']['open']['count']).to eq(2)
      expect(case_overview_dashboard['indicators']['open']['query']).to match_array(%w[owned_by=foo record_state=true status=open])

      workflow_dashboard = json['data'].find { |d| d['name'] == 'dashboard.workflow' }
      expect(workflow_dashboard['indicators']['workflow']['assessment']['count']).to eq(1)
      expect(workflow_dashboard['indicators']['workflow']['assessment']['query']).to match_array(%w[owned_by=foo record_state=true status=open workflow=assessment])

      reporting_location_dashboard = json['data'].find { |d| d['name'] == 'dashboard.reporting_location' }
      expect(reporting_location_dashboard['indicators']['reporting_location_open']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_this_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_open_last_week']['cty']['count']).to eq(1)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_this_week']['cty']['count']).to eq(2)
      expect(reporting_location_dashboard['indicators']['reporting_location_closed_last_week']['cty']['count']).to eq(1)

      protection_concerns_dashboard = json['data'].find { |d| d['name'] == 'dashboard.dash_protection_concerns' }
      expect(protection_concerns_dashboard['indicators']['Open Cases']['refugee']['count']).to eq(2)
      expect(protection_concerns_dashboard['indicators']['New (This Week)']['refugee']['count']).to eq(1)
      expect(protection_concerns_dashboard['indicators']['All Cases']['refugee']['count']).to eq(4)
      expect(protection_concerns_dashboard['indicators']['Closed (This Week)']['refugee']['count']).to eq(1)
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