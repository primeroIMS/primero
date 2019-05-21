# TODO: Following scenarios are skipped (using xscenario) due to issues with chrome update / new webdriver gem / capybara gem
# This should be addressed by PRIM-914

require 'rails_helper'
require 'sunspot'

feature "home view" do
  feature "dashboard", search: true do
    before(:all) do
      clean_up_objects

      create_lookup('lookup-service-response-type', [
        { id: 'test1', display_text: 'Test1' },
        { id: 'test2', display_text: 'Test2' }
      ])

      create_lookup('lookup-protection-concerns', [
        {id: "test1", display_text: "test1"},
        {id: "test2", display_text: "test2"}
      ])

      create_lookup('lookup-risk-level', [
        {id: "high", display_text: "High"},
        {id: "medium", display_text: "Medium"},
        {id: "low", display_text: "Low"}
      ])

      @system = create(:system_settings)

      @roles = create(:role, :group_permission => Permission::GROUP, permissions_list: [
        Permission.new(
          :resource => Permission::CASE,
          :actions => [Permission::MANAGE]
        ),
        Permission.new(
          :resource => Permission::DASHBOARD,
          :actions => [
            Permission::VIEW_APPROVALS,
            Permission::VIEW_ASSESSMENT,
            Permission::VIEW_PROTECTION_CONCERNS_FILTER,
            Permission::DASH_CASES_BY_TASK_OVERDUE,
            Permission::DASH_CASE_BY_WORKFLOW,
            Permission::DASH_SHOW_NONE_VALUES
          ]
        )
      ])

      @location = create(:location, placename: "test_location", location_code: "test_location")

      # TODO Core Fields: this adds fields that are core fields for some of the dashboard modules but don't break the rendering of the page if they aren't present
      @form_section = create(:form_section,
        is_first_tab: true,
        fields: [
          build(:field, name: "risk_level", display_name: "Risk Level", type: Field::SELECT_BOX, option_strings_source: "lookup lookup-risk-level", create_property: false),
          build(:field, name: "approval_status_case_plan", display_name: "Approval Status Case Plan", create_property: false),
          build(:field, name: "service_due_dates", display_name: "Service Due Dates", type: Field::DATE_FIELD),
          build(:subform_field, name: "services_section", unique_id: 'services_section', fields: [
            build(:field, name: "service_response_day_time", type: Field::DATE_FIELD, display_name: "Service Response Day Time", create_property: false),
            build(:field, name: "service_appointment_date", type: Field::DATE_FIELD, display_name: "Service Appointment Date", create_property: false),
            build(:field, name: "service_implemented", display_name: "Service Implemented", create_property: false)
          ]),
          build(:field, name: "date_closure", display_name: "date_closure", type: Field::DATE_FIELD, create_property: false),
          build(:field, name: "protection_concerns", display_name: "protection_concerns", type: Field::SELECT_BOX, option_strings_source: "lookup lookup-protection-concerns", create_property: false),
          build(:field, name: 'date_case_plan', type: 'date_field', display_name: 'Date Case Plan Due'),
          build(:field, name: 'case_plan_due_date', type: 'date_field', display_name: 'Date Case Plan Due')
        ]
      )

      Child.refresh_form_properties
      Sunspot.setup(Child) do
        string "risk_level", as: "risk_level_sci"
        string "approval_status_case_plan", as: "approval_status_case_plan_sci"
        date "service_response_day_time"
        date "service_appointment_date"
        string "service_implemented", as: "risk_level_sci"
        #TODO: we aren't currently testing locations, this is just here to get around solr errors
        string "owned_by_location0", as: "owned_by_location0_sci"
        date "date_closure", as: "date_closure_d"
        date "date_case_plan", as: "date_case_plan_d"
        date "case_plan_due_date", as: "case_plan_due_date_d"
        string "protection_concerns", :multiple => true
      end
      Sunspot.commit

      @user_group = build(:user_group)
      @user_group.save

      @user = setup_user(
        form_sections: [@form_section],
        primero_module: {
          id: PrimeroModule::CP,
          workflow_status_indicator: true,
          use_workflow_case_plan: true,
          use_workflow_service_implemented: true
        },
        roles: @roles,
        is_manager: true,
        location: "test_location"
      )
      @user2 = setup_user(
          form_sections: [@form_section],
          primero_module: {
              id: PrimeroModule::CP,
              workflow_status_indicator: true,
              use_workflow_case_plan: true,
              use_workflow_service_implemented: true
          },
          roles: @roles,
          is_manager: true,
          user_group: @user_group
      )
      @admin = setup_user(primero_module: {
        id: PrimeroModule::CP
      }, form_sections: [@form_section], location: "test_location")
    end

    before do
      @case = create(:child,
        owned_by: @user.user_name,
        associated_user_names: @user.user_name,
        child_status: Record::STATUS_OPEN,
        assigned_user_names: [@user.user_name],
        module_id: @user.modules.first.id,
        case_plan_approved_date: DateTime.now.to_date,
        owned_by_location2: "test",
        date_closure: DateTime.now.to_date,
        protection_concerns: "test1",
        workflow: Child::WORKFLOW_SERVICE_IMPLEMENTED,
        record_state: true,
        risk_level: "high",
        approval_status_case_plan: Child::APPROVAL_STATUS_PENDING,
        service_due_dates: ["2017/10/23"],
        services_section: [
          {
            service_response_type: "intervention_non_judicial",
            service_response_day_time: Time.now - 2.day,
            service_appointment_date: Time.now - 1.day,
            service_implemented: "not_implemented"
          }
        ]
      )

      @case2 = create(:child,
                     owned_by: @user2.user_name,
                     associated_user_names: @user2.user_name,
                     child_status: Record::STATUS_OPEN,
                     assigned_user_names: [@user2.user_name],
                     module_id: @user2.modules.first.id,
                     case_plan_approved_date: DateTime.now.to_date,
                     owned_by_location2: "test",
                     date_closure: DateTime.now.to_date,
                     protection_concerns: "test1",
                     workflow: Child::WORKFLOW_SERVICE_IMPLEMENTED,
                     record_state: true,
                     risk_level: "high",
                     approval_status_case_plan: Child::APPROVAL_STATUS_PENDING,
                     service_due_dates: ["2017/10/23"],
                     services_section: [
                         {
                             service_response_type: "intervention_non_judicial",
                             service_response_day_time: Time.now - 2.day,
                             service_appointment_date: Time.now - 1.day,
                             service_implemented: "not_implemented"
                         }
                     ]
      )

      @case3 = create(:child,
        owned_by: @admin.user_name,
        associated_user_names: @admin.user_name,
        child_status: "open",
        assigned_user_names: [@admin.user_name],
        module_id: @admin.modules.first.id,
        case_plan_approved_date: DateTime.now.to_date,
        date_closure: DateTime.now.to_date,
        protection_concerns: "test1",
        workflow: Child::WORKFLOW_SERVICE_IMPLEMENTED,
        record_state: true
      )

      Sunspot.commit
    end

    xscenario "has workflow", search: true do
      create_session(@user, 'password123')
      visit "/"
      expect(page).to have_content "NEW"
      expect(page).to have_content "REOPENED"
      expect(page).to have_content "CASE PLAN"
      expect(page).to have_content "TEST1"
      expect(page).to have_content "TEST2"
      expect(page).to have_content "CASES BY WORKFLOW"

      within(".dashboard-group div:nth-of-type(3) .table-counts tr:first-of-type td:nth-of-type(2)") do
        expect(page).to have_content "1"
      end

      user_ids = page.all(".dashboard-group div:nth-of-type(3) .panel_content .table-counts td:first-of-type").map(&:text)
      expect(user_ids).to include(@user.user_name.upcase)
      expect(user_ids).not_to include(@user2.user_name.upcase)
    end

    xscenario "has case module", search: true do
      create_session(@user, 'password123')
      visit "/"
      within("h4.stat_heading") do
        expect(page).to have_content "Case"
      end
      within("h4.stat_heading + .row a.column.section-stat:first-of-type .stats") do
        expect(page).to have_content "1"
      end
      within("h4.stat_heading + .row") do
        expect(page).to have_content "Open"
        expect(page).to have_content "Closed"
        expect(page).to have_content "Transfers Awaiting Acceptance"
        expect(page).to have_content "Pending Transfers"
        expect(page).to have_content "Rejected Transfers"
      end
    end

    xscenario "Cases by Assessment Level", search: true do
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group div:nth-of-type(2) div.column:first-of-type div.row:first-of-type .count") do
        expect(page).to have_content "1"
      end
      within(".dashboard-group div:nth-of-type(2) div.column:first-of-type div.row:first-of-type .label.primary") do
        expect(page).to have_content "High Priority"
      end
    end

    xscenario "has approvals module", search: true do
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group .row:nth-of-type(2) .column:nth-of-type(2) .row:nth-of-type(1)") do
        expect(page).to have_content "BIA"
        expect(page).to have_content "0"
      end
      within(".dashboard-group .row:nth-of-type(2) .column:nth-of-type(2) .row:nth-of-type(2)") do
        expect(page).to have_content "Case Plan"
        expect(page).to have_content "1"
      end
      within(".dashboard-group .row:nth-of-type(2) .column:nth-of-type(2) .row:nth-of-type(3)") do
        expect(page).to have_content "Closure"
        expect(page).to have_content "0"
      end
    end

    xscenario "has overdue tasks module", search: true do
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group div:nth-of-type(4) h4") do
        expect(page).to have_content "OVERDUE TASKS"
      end
      within(".dashboard-group div:nth-of-type(4) .panel_content table td:nth-of-type(5)") do
        expect(page).to have_content "1"
      end
    end

    xscenario "displays overdue case plan in overdue tasks for manager" do
      case_common = {
        owned_by: @user.user_name,
        module_id: @user.module_ids.first,
        associated_user_names: @user.user_name,
        assigned_user_names: [@user.user_name],
        record_state: true,
        child_status: 'open'
      }

      @case3 = create(:child, case_common.merge!(case_plan_due_date: DateTime.now - 3.days))
      @case4 = create(:child, case_common.merge!(case_plan_due_date: DateTime.now + 3.days))
      @case5 = create(:child, case_common.merge!(case_plan_due_date: DateTime.now - 3.days, date_case_plan: DateTime.now))

      Sunspot.commit
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group div:nth-of-type(4) .panel_content table td:nth-of-type(3)") do
        expect(page).to have_content "1"
      end
    end

    xscenario "has cases by location", search: true do
      create_session(@admin, 'password123')
      visit "/"
      within("#content.columns.dashboards > div:first-of-type .panel_header > h4") do
        expect(page).to have_content "CASES"
      end
      within("#content.columns.dashboards > div:first-of-type .panel_header th:first-of-type") do
        expect(page).to have_content "COUNTRY"
      end
      # TODO: this requires the owned_by_location0 field to be added to the db for cases, once searchable location code is refactored, revisit this test.
      # within("#content.columns.dashboards > div:first-of-type .table-counts tr:first-of-type td:first-of-type") do
      #   expect(page).to have_content "test_location"
      # end
    end

    xscenario "has cases by protection concern", search: true do
      create_session(@admin, 'password123')
      visit "/"
      within("#content.columns.dashboards > div:nth-of-type(2) .panel_header > h4") do
        expect(page).to have_content "PROTECTION CONCERNS"
      end
      within("#content.columns.dashboards > div:nth-of-type(2) .table-counts tr:first-of-type td:first-of-type") do
        expect(page).to have_content "TEST1"
      end
    end

    after(:each, :search => true) do
      Child.all.each &:destroy
      Sunspot.commit
    end

    after(:all, :search => true) do
      clean_up_objects
    end
  end
end
