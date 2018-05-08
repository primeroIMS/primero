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

    scenario "it hides photo column if form not visible" do
      visit "/cases"

      within("table") do
        expect(page).to_not have_content "PHOTO"
      end
    end

    scenario "it shows photo column if form is visible" do
      @form_section.visible = true
      @form_section.save!

      visit "/cases"

      within("table.record_list_view") do
        expect(page).to have_content "PHOTO"
      end
    end
  end

  feature "index" do
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

      scenario "sends transfer request", search: true do
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