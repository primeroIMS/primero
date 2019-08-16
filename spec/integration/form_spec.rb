require 'spec_helper'

feature "forms" do
  feature "subforms" do
    before do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy

      @form_section = create(:form_section,
        is_first_tab: true,
        fields: [
          build(:subform_field, initial_subforms: 2, fields: [
            build(:field, required: true),
            build(:field)
          ])
        ]
      )

      @user = setup_user(form_sections: [@form_section])
      create_session(@user, 'password123')
    end

    xscenario "throws error on invalid required fields" do
      visit '/cases'
      click_on('New Case')
      sleep 2
      click_on('Save')
      expect(page).to have_selector('div.form-errors')
      expect(page).to have_css('input.is-invalid-input', count: 2)
    end

    xscenario "generates subforms for new case" do
      visit '/cases'
      click_on('New Case')
      subform = @form_section.fields.first
      expect(page).to have_selector("fieldset#subform_#{subform.name}_0")
      expect(page).to have_selector("fieldset#subform_#{subform.name}_1")
    end

    xscenario "saves when fields valid" do
      visit '/cases'
      click_on('New Case')

      subform = @form_section.fields.first
      within_in_subform subform.name, 0 do
        fill_in subform.subform_section.fields.first.display_name, with: 'test 1'
      end
      within_in_subform subform.name, 1 do
        fill_in subform.subform_section.fields.first.display_name, with: 'test 2'
      end

      click_on('Save')
      expect(page).to have_content(/Case record (.*) successfully created./)
    end

    xscenario "agency not avaliable when editing My Account" do
      visit '/'
      click_on('My Account')
      click_on('Edit')
      expect(page).to_not have_selector(".default-form .key[for='user_organization']")
    end

    xscenario "saves form when subform with required fields removed" do
      visit '/cases'
      click_on('New Case')

      page.evaluate_script('window.confirm = function() { return true; }')

      click_on('Remove', match: :first)

      click_on('Save')

      expect(page).to have_selector('div.form-errors')
      within '.label.alert' do
        expect(page).to have_content(1)
      end

      click_on('Remove')

      # Need manual sleep here, accepting the confirm modal does not wait for clicking on save
      sleep 2.seconds

      click_on('Save')
      expect(page).to have_content(/Case record (.*) successfully created./)
    end
  end

  feature "assigned user field" do
    before(:all) do
      @form_section = create(:form_section,
        is_first_tab: true,
        fields: [
          build(:select_field, name: 'assigned_user_names', display_name: 'Assigned User Names')
        ]
      )

      @role1 = create(:role, permissions_list: [
        build(:permission, resource: Permission::CASE, actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE,
          Permission::REMOVE_ASSIGNED_USERS
        ])
      ])
      @role2 = create(:role, permissions_list: [
        build(:permission, resource: Permission::CASE, actions: [
          Permission::READ,
          Permission::CREATE,
          Permission::WRITE
        ])
      ])

      @user1 = setup_user(form_sections: [@form_section], roles: @role1)
      @user2 = setup_user(form_sections: [@form_section], roles: @role2)
    end

    xscenario "allows user with correct permission to edit field" do
      create_session(@user1)
      visit '/cases'
      click_on('New Case')

      within('.chosen-container') do
        expect(page).to have_css("input[disabled]")
      end

      expect(page).to have_selector(:link_or_button, 'Remove referrals')
      click_on('Remove referrals')

      within('.chosen-container') do
        expect(page).to_not have_css("input[disabled]")
      end

      select_from_chosen('test2', from: 'Assigned User Names')
      click_on('Save')

      expect(page).to have_content('test2')
    end

    xscenario "does not show remove referals link for user without correct permission" do
      create_session(@user2)
      visit '/cases'
      click_on('New Case')
      expect(page).to_not have_selector(:link_or_button, 'Remove referrals')

      within('.chosen-container') do
        expect(page).to have_css("input[disabled]")
      end
    end
  end
end