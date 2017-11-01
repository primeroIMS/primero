require 'spec_helper'
require 'sunspot'

feature "home view" do
  feature "dashboard", search: true do
    before(:all) do
      clean_up_objects

      create_lookup('lookup-service-response-type', [
        { id: 'test1', display_text: 'Test1' },
        { id: 'test2', display_text: 'Test2' }
      ])

      create_lookup('lookup-case-status', [
        { id: 'open', display_text: 'Open' },
        { id: 'closed', display_text: 'Closed' },
      ])

      create_lookup('lookup-risk-level', [
        {id: "high", display_text: "High"},
        {id: "medium", display_text: "Medium"},
        {id: "low", display_text: "Low"}
      ])

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
          ])
        ]
      )

      Child.refresh_form_properties
      Sunspot.setup(Child) {string "risk_level", as: "risk_level_sci"}
      Sunspot.setup(Child) {string "approval_status_case_plan", as: "approval_status_case_plan_sci"}
      Sunspot.setup(Child) {date "service_response_day_time"}
      Sunspot.setup(Child) {date "service_appointment_date"}
      Sunspot.setup(Child) {string "service_implemented", as: "risk_level_sci"}

      @user = setup_user(
        form_sections: [@form_section],
        primero_module: {
          id: PrimeroModule::CP,
          workflow_status_indicator: true,
          use_workflow_case_plan: true,
          use_workflow_service_implemented: true
        },
        roles: @roles,
        is_manager: true
      )
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

      Sunspot.commit
    end

    scenario "has workflow", search: true do
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
    end

    scenario "has case module", search: true do
      create_session(@user, 'password123')
      visit "/"
      within("h4.stat_heading") do
        expect(page).to have_content "Case"
      end
      within("h4.stat_heading + .row .column.section-stat:first-of-type .stats") do
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

    scenario "Cases by Assessment Level", search: true do
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group div:nth-of-type(2) div.column:first-of-type div.row:first-of-type .count") do
        expect(page).to have_content "1"
      end
      within(".dashboard-group div:nth-of-type(2) div.column:first-of-type div.row:first-of-type .label.primary") do
        expect(page).to have_content "High Priority"
      end
    end

    scenario "has approvals module", search: true do
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

    scenario "has overdue tasks module", search: true do
      create_session(@user, 'password123')
      visit "/"
      within(".dashboard-group div:nth-of-type(4) h4") do
        expect(page).to have_content "OVERDUE TASKS"
      end
      within(".dashboard-group div:nth-of-type(4) .panel_content table td:nth-of-type(5)") do
        expect(page).to have_content "1"
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
