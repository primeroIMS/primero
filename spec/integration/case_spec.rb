# TODO: Following scenarios are skipped (using xscenario) due to issues with chrome update / new webdriver gem / capybara gem
# This should be addressed by PRIM-914

require 'rails_helper'

feature "index page" do
  feature "photos" do
    before do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy

      @form_section = create(:form_section,
        unique_id: 'photos_and_audio',
        visible: false
      )

      @user = setup_user(form_sections: [@form_section], primero_module: {id: PrimeroModule::CP})
      create_session(@user, 'password123')
    end

    xscenario "it hides photo column if form not visible" do
      visit "/cases"

      within("table") do
        expect(page).to_not have_content "PHOTO"
      end
    end

    xscenario "it shows photo column if form is visible" do
      @form_section.visible = true
      @form_section.save!

      visit "/cases"

      within("table.record_list_view") do
        expect(page).to have_content "PHOTO"
      end
    end
  end

  feature "case index" do
    feature "add service from incident details modal" do
      before(:all) do
        FormSection.all.each &:destroy
        PrimeroModule.all.each &:destroy

        incident_details_subform_fs = create(:form_section,
          unique_id: 'incident_details_subform_section',
          fields: [
            build(:field, display_name: 'Test Input')
          ]
        )

        services_subform_fs = create(:form_section,
          unique_id: 'services_section',
          fields: [
            build(:field, display_name: 'Test Input')
          ]
        )

        @incident_details_fs = create(:form_section,
          unique_id: 'incident_details_container',
          fields: [
            build(:subform_field,
              name: 'incident_details',
              subform_section_id: incident_details_subform_fs.unique_id )
          ]
        )

        @services_fs = create(:form_section,
          unique_id: 'services',
          fields: [
            build(:subform_field,
              name: 'services_section',
              subform_section_id: services_subform_fs.unique_id )
          ]
        )

        @role = create(:role, permissions_list: [Permission.new(:resource => Permission::CASE, :actions => [
          Permission::WRITE,
          Permission::READ,
          Permission::SERVICES_SECTION_FROM_CASE,
          Permission::SERVICE_PROVISION_INCIDENT_DETAILS,
          Permission::INCIDENT_DETAILS_FROM_CASE,
        ])])

        @role2 = create(:role, permissions_list: [Permission.new(:resource => Permission::CASE, :actions => [
          Permission::WRITE,
          Permission::READ,
          Permission::SERVICES_SECTION_FROM_CASE,
          Permission::INCIDENT_DETAILS_FROM_CASE,
        ])])

        Child.refresh_form_properties
      end

      before do
        @user = setup_user(form_sections: [@incident_details_fs, @services_fs], primero_module: { id: PrimeroModule::CP }, roles: @role)
        @user2 = setup_user(form_sections: [@incident_details_fs, @services_fs], primero_module: { id: PrimeroModule::CP }, roles: @role2)

        @case = create(:child, owned_by: @user.user_name, module_id: @user.module_ids.first)
        @case2 = create(:child, owned_by: @user2.user_name, module_id: @user2.module_ids.first)

        Sunspot.commit
      end

      xscenario "it shows save and add service provision button on add incident modal", search: true do
        create_session(@user, 'password123')
        visit "/cases"
        within('table') { find(:css, 'input').click }
        click_on 'Actions'
        within('#menu') do
          find('a', text: 'Add Incident', match: :prefer_exact).click
        end
        expect(page).to have_content "Incident Details"
        expect(page).to have_content "SAVE AND ADD SERVICE PROVISION"
        fill_in 'Test Input', with: 'test 1'
        find('a', text: 'SAVE AND ADD SERVICE PROVISION', match: :prefer_exact).click
        expect(page).to have_content "Response Overview"
        fill_in 'Test Input', with: 'test 2'
        click_on 'Save'

        expect(page).to have_content "Case #{@case.short_id} was successfully updated"
      end

      xscenario "does not show service provision button without permission", search: true do
        create_session(@user2, 'password123')
        visit "/cases"
        within('table') { find(:css, 'input').click }
        click_on 'Actions'
        within('#menu') do
          find('a', text: 'Add Incident', match: :prefer_exact).click
        end
        expect(page).to have_content "Incident Details"
        expect(page).to_not have_content "SAVE AND ADD SERVICE PROVISION"
      end
    end

    feature "transfer request modal" do
      before do
        @role = create(:role, permissions_list: [Permission.new(:resource => Permission::CASE, :actions => [
          Permission::WRITE,
          Permission::READ,
          Permission::DISPLAY_VIEW_PAGE,
          Permission::REQUEST_TRANSFER,
          Permission::SEARCH_OWNED_BY_OTHERS
        ])])
        @user = setup_user(roles: @role)
        @case = create(:child, owned_by: @user.user_name, module_id: @user.module_ids.first)

        @user2 = setup_user()

        Sunspot.commit
      end

      xscenario "sends transfer request", search: true do
        create_session(@user2, 'password123')
        visit("/cases")
        search_for(@case.short_id)

        within('table') do
         find('.record-view-modal').click
        end

        find(:css, '.request-transfer-modal').click

        within('.transfer_request_form') do
          fill_in 'request_transfer_notes', with: 'test'
        end

        click_on('Send Request')

        expect(page).to have_content "Request transfer sent"
      end
    end
  end
end