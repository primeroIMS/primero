require 'spec_helper'
require 'sunspot'

feature "show page" do
  feature "workflow status stepper", search: true do
    before(:all) do
      create_lookup('lookup-service-response-type', [
        { id: 'test1', display_text: 'Test1' },
        { id: 'test2', display_text: 'Test2' },
        { id: 'test3', display_text: 'Test3' }
      ])

      create_lookup('lookup-case-status', [
          { id: 'open', display_text: 'Open' },
          { id: 'closed', display_text: 'Closed' },
      ])
    end

    before do
      @user = setup_user(primero_module: {
        workflow_status_indicator: true
      })

      @user2 = setup_user(primero_module: {
        workflow_status_indicator: true,
        use_workflow_service_implemented: false
      })

      @case = create(:child, owned_by: @user.user_name, module_id: @user.module_ids.first)
      @case2 = create(:child, owned_by: @user2.user_name, module_id: @user2.module_ids.first)

      Sunspot.commit
    end

    scenario "renders workflow status stepper", search: true do
      create_session(@user, 'password123')
      visit "/cases"
      click_on 'display_1234'

      within(".ui.mini.steps") do
        expect(page).to have_content "New"
        expect(page).to have_content "Case Plan"
        expect(page).to have_content "Test1"
        expect(page).to have_content "Test2"
        expect(page).to have_content "Test3"
        expect(page).to have_content "Service Implemented"
        expect(page).to have_content "Closed"
      end
    end

    scenario "blacklists workflow steps", search: true do
      create_session(@user2, 'password123')

      visit "/cases"
      click_on 'display_1234'

      within(".ui.mini.steps") do
        expect(page).to_not have_content "Test2"
        expect(page).to_not have_content "Service Implemented"
      end
    end
  end
end