require 'spec_helper'
require 'sunspot'

feature "index page" do
  feature "date filter", search: true do
    before do
      @form_section = create(:form_section,
        unique_id: 'test_form',
        is_first_tab: true,
        fields: [
          build(:field, name: 'date_closure', type: 'date_field', display_name: 'Date of Closure'),
          build(:field, name: 'date_case_plan', type: 'date_field', display_name: 'Date Case Plan Due'),
          build(:field, name: "assigned_user_names", display_name: "Assigned User Names", type: Field::SELECT_BOX, option_strings_source: "User", multi_select: true, create_property: false),
          build(:field, name: 'module_id')
        ]
      )

      @user = setup_user(form_sections: [@form_section], primero_module: {id: PrimeroModule::CP})

      @case_date_closure = create(:child,
        date_closure: DateTime.now,
        owned_by: @user.user_name,
        case_id_display: 'Case 1',
        module_id: @user.module_ids.first
      )

      @case_case_plan = create(:child,
        date_case_plan: DateTime.now,
        owned_by: @user.user_name,
        case_id_display: 'Case 2',
        module_id: @user.module_ids.first
      )

      Sunspot.setup(Child) do
        date 'date_closure', as: :date_closure_d
        date 'date_case_plan', as: :date_case_plan_d
        string 'module_id', as: :module_id_sci
      end

      Child.refresh_form_properties

      Sunspot.commit
    end

    scenario "filters records by selected date field", search: true do
      create_session(@user, 'password123')
      visit "/cases"
      scroll_to('.date_range')
      select_from_chosen('Date of Case Closure', from: 'date')
      select_from_date_input('date_from', DateTime.now - 3.days)
      select_from_date_input('date_to', DateTime.now + 3.days)
      scroll_to('body')
      find('#apply_filter').click
      scroll_to('body')
      within('table.record_list_view ') do
        expect(page).to have_content 'CASE 1'
        expect(page).to have_no_content 'CASE 2'
      end
    end
  end
end

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
        workflow_status_indicator: true,
        use_workflow_case_plan: true,
        use_workflow_service_implemented: true
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

    scenario "doesnt render a workflow status if not enabled", search: true do
      create_session(@user2, 'password123')

      visit "/cases"
      click_on 'display_1234'

      within(".ui.mini.steps") do
        expect(page).to_not have_content "Assessment"
        expect(page).to_not have_content "Case Plan"
        expect(page).to_not have_content "Service Implemented"
      end
    end
  end
end