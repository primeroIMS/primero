require 'spec_helper'
require 'sunspot'

feature "home view" do
  feature "workflow module", search: true do
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
    end

    before do
      @roles = create(:role, :group_permission => Permission::GROUP, permissions_list: [
        Permission.new(
          :resource => Permission::CASE,
          :actions => [Permission::MANAGE]
        ),
        Permission.new(
          :resource => Permission::DASHBOARD,
          :actions => [
            Permission::DASH_CASE_BY_WORKFLOW
          ]
        )
      ])

      @user = setup_user(primero_module: {
        id: PrimeroModule::CP,
        workflow_status_indicator: true,
        use_workflow_case_plan: true,
        use_workflow_service_implemented: true
      }, roles: @roles, is_manager: true)

      @case = create(:child,
        owned_by: @user.user_name,
        module_id: @user.module_ids.first,
        associated_user_names: @user.user_name,
        child_status: "open",
        assigned_user_names: [@user.user_name],
        module_id: @user.modules.first.id,
        case_plan_approved_date: DateTime.now.to_date,
        owned_by_location2: "test",
        date_closure: DateTime.now.to_date,
        protection_concerns: "test1",
        workflow: Child::WORKFLOW_SERVICE_IMPLEMENTED,
        record_state: true
      )

      Sunspot.commit
    end

    scenario "has workflow", search: true do
      create_session(@user, 'password123')
      visit "/"
      expect(page).to have_content "Logged in as: #{@user.user_name}"
      expect(page).to have_content "NEW"
      expect(page).to have_content "REOPENED"
      expect(page).to have_content "CASE PLAN"
      expect(page).to have_content "TEST1"
      expect(page).to have_content "TEST2"
      expect(page).to have_content "CASES BY WORKFLOW"
      within(".table-counts tr:first-of-type td:nth-of-type(2)") do
        expect(page).to have_content "1"
      end
    end

    after(:all, :search => true) do
      clean_up_objects
    end
  end
end
