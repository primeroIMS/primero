require 'spec_helper'

feature "forms" do
  feature "subforms" do
    before do
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

    scenario "throws error on invalid required fields" do
      visit '/cases'
      click_on('New Case')
      click_on('Save')
      expect(page).to have_selector('div.form-errors')
      expect(page).to have_css('input.is-invalid-input', count: 2)
    end

    scenario "generates subforms for new case" do
      visit '/cases'
      click_on('New Case')
      subform = @form_section.fields.first
      expect(page).to have_selector("fieldset#subform_#{subform.name}_0")
      expect(page).to have_selector("fieldset#subform_#{subform.name}_1")
    end

    scenario "saves when fields valid" do
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

    scenario "agency not avaliable when editing My Account" do
      visit '/'
      click_on('My Account')
      click_on('Edit')
      expect(page).to_not have_selector(".default-form .key[for='user_organization']")
    end
  end
end