require 'spec_helper'

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
end