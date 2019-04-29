require 'rails_helper'
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

      # TODO: Eventually we will do something similar to Child.refresh_form_properties for Sunspot.
      Sunspot.setup(Child) do
        date 'date_closure', as: :date_closure_d
        date 'date_case_plan', as: :date_case_plan_d
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

feature "show page", search: true do
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
        module_options: {
          workflow_status_indicator: true,
          use_workflow_case_plan: true,
          use_workflow_service_implemented: true
        }
      })

      @user2 = setup_user(primero_module: {
        module_options: {
          workflow_status_indicator: true,
          use_workflow_service_implemented: false
        }
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

  feature 'actions' do
    before(:all) do
      @role1 = create(:role, permissions_list: [Permission.new(:resource => Permission::CASE, :actions => [
        Permission::WRITE,
        Permission::READ
      ])])
      @role2 = create(:role, permissions_list: [Permission.new(:resource => Permission::CASE, :actions => [
        Permission::WRITE,
        Permission::READ,
        Permission::ENABLE_DISABLE_RECORD
      ])])
      @user1 = setup_user(roles: @role1)
      @user2 = setup_user(roles: @role2)
    end

    before do
      @case1 = create(:child, owned_by: @user1.user_name, module_id: @user1.module_ids.first)
      @case2 = create(:child, owned_by: @user2.user_name, module_id: @user2.module_ids.first)
    end

    scenario 'should not show disable action if not permitted' do
      create_session(@user1, 'password123')
      visit("/cases/#{@case1.id}")
      save_screenshot
      click_on('Actions')

      within('#menu') do
        expect(page).to_not have_content "Disable"
      end
    end

    scenario 'should show disable action if permitted' do
      create_session(@user2, 'password123')
      visit("/cases/#{@case2.id}")
      click_on('Actions')

      within('#menu') do
        expect(page).to have_content "Disable"
      end
    end
  end

  feature "form fields" do
    before(:all) do
      create(:lookup, id: 'lookup-multi-test', lookup_values: [
        { id: 'opt1', display_text: 'Opt1' },
        { id: 'opt2', display_text: 'Opt2' },
      ].map(&:with_indifferent_access))

      @agency1 = create(:agency)
      @agency2 = create(:agency)
      @location1 = create(:location)
      @location2 = create(:location)
    end

    before do
      @form_section = create(:form_section,
        is_first_tab: true,
        fields: [
          build(:field, name: "field1", display_name: "NumField", type: Field::NUMERIC_FIELD),
          build(:field, name: "field2", display_name: "DateField", type: Field::DATE_FIELD),
          build(:field, name: "field3", display_name: "TxtField", type: Field::TEXT_FIELD),
          build(:field, name: "field4", display_name: "LocationField", type: Field::SELECT_BOX, option_strings_source: "Location"),
          build(:field, name: "field5", display_name: "UserField", type: Field::SELECT_BOX, option_strings_source: "User"),
          build(:field, name: "field6", display_name: "AgencyField", type: Field::SELECT_BOX, multi_select: true, option_strings_source: "Agency"),
          build(:field, name: "field7", display_name: "MultiField", type: Field::SELECT_BOX, multi_select: true, option_strings_source: "lookup lookup-multi-test")
        ]
      )

      Child.refresh_form_properties

      @user = setup_user(form_sections: [@form_section])
      @case = create(:child, owned_by: @user.user_name,
        module_id: @user.module_ids.first,
        field1: 2,
        field2: DateTime.parse('01-Nov-2016'),
        field3: 'hello',
        field4: @location2.location_code,
        field5: @user.user_name,
        field6: [@agency1.id],
        field7: ['opt1', 'opt2'])

      Sunspot.commit
    end

    scenario "renders different type of fields" do
      create_session(@user, 'password123')
      visit("/cases/#{@case.id}")
      within('fieldset') do
        expect(page).to have_content "2"
        expect(page).to have_content "01-Nov-2016"
        expect(page).to have_content "hello"
        expect(page).to have_content @location2.placename
        expect(page).to have_content @user.user_name
        expect(page).to have_content @agency1.id
        expect(page).to have_content "Opt1, Opt2"
      end
    end
  end
end
