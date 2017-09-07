require 'spec_helper'
require 'sunspot'


feature "show page" do
  feature "workflow", search: true do
    before do
      @lookup = create(:lookup,
        id: 'lookup-service-response-type',
        name: 'Service Response Type',
        lookup_values: [
          { id: 'test1', display_text: 'Test1' },
          { id: 'test2', display_text: 'Test2' },
          { id: 'test3', display_text: 'Test3' }
      ].map(&:with_indifferent_access))


      binding.pry
      @user = setup_user(form_sections: [@form_section], primero_module: {
        workflow_status_indicator: true
      })

      @case = create(:child, owned_by: @user.user_name, module_id: @user.module_ids.first)

      Sunspot.commit

      create_session(@user, 'password123')
    end

    scenario "throws error on invalid required fields", search: true do
      visit "/cases"
      click_on 'display_1234'
      expect(page).to have_content "Logged in as: #{@user.user_name}"

      pause
      # within .ui.mini.step do
      # end
    end
  end
end