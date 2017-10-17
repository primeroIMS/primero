require 'spec_helper'
require 'sunspot'

feature "reports", search: true do
  before do

    @form_section = create(:form_section,
      is_first_tab: true,
      fields: [
        build(:field, name: "age", display_name: "Age", type: Field::NUMERIC_FIELD),
        build(:field, name: "location_current", display_name: "Current Location", type: Field::TEXT_FIELD)
      ]
    )

    Sunspot.setup(Child) {integer 'age', as: "age_i".to_sym}
    Sunspot.setup(Child) {string 'location_current', as: "location_current_sci".to_sym}

    Sunspot.remove_all!

    @user = setup_user(form_sections: [@form_section], primero_module: {id: "primeromodule-cp"})
    @case = create(:child, owned_by: @user.user_name, module_id: @user.module_ids.first, age: 2, location_current: "51227")
    @report = create(:report, aggregate_by: ["location_current"])

    Sunspot.commit
  end

  scenario "renders workflow status stepper", search: true do
    create_session(@user, 'password123')
    visit "/reports"
    click_on("test")
    within(".dataTable") do
      expect(page).to have_content("0 - 5")
    end
    page.save_screenshot('screenshot.png')
  end
end