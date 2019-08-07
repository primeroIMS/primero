require 'spec_helper'
require 'sunspot'

feature "show page", search: true do
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

    xscenario 'should not show disable action if not permitted' do
      create_session(@user1, 'password123')
      visit("/cases/#{@case1.id}")
      save_screenshot
      click_on('Actions')

      within('#menu') do
        expect(page).to_not have_content "Disable"
      end
    end

    xscenario 'should show disable action if permitted' do
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

    xscenario "renders different type of fields" do
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