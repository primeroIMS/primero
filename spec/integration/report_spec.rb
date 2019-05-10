# TODO: Following scenarios are skipped (using xscenario) due to issues with chrome update / new webdriver gem / capybara gem
# This should be addressed by PRIM-914

require 'rails_helper'
require 'sunspot'

feature "reports", search: true do
  before do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Child.all.each &:destroy
    Report.all.each &:destroy
    SystemSettings.all.each &:destroy
    User.all.each &:destroy

    @form_section_for_report = create(:form_section,
      is_first_tab: true,
      fields: [
        build(:field, name: "age", display_name: "Age", type: Field::NUMERIC_FIELD),
        build(:field, name: "location_current", display_name: "Current Location", type: Field::TEXT_FIELD, option_strings_source:
"Location")
      ]
    )

    Child.refresh_form_properties

    Sunspot.setup(Child) {integer 'age', as: "age_i".to_sym}
    Sunspot.setup(Child) {string 'location_current', as: "location_current_sci".to_sym}

    @system = SystemSettings.create(default_locale: "en", primary_age_range: "primary", age_ranges: {"primary" => [0..5,6..10]})
    @location = create(:location, placename: "Test::Location", location_code: '51227', admin_level: 0)
    @user_for_report = setup_user(form_sections: [@form_section_for_report], primero_module: {id: "primeromodule-cp"})
    @case_for_report = create(:child, owned_by: @user_for_report.user_name, module_id: @user_for_report.module_ids.first, age: 2, location_current: "51227", case_id_display: "display_for_report_1")
    @case_for_report2 = create(:child, owned_by: @user_for_report.user_name, module_id: @user_for_report.module_ids.first, age: 2, location_current: "51228", case_id_display: "display_for_report_2")
    @report = create(:report, aggregate_by: ["location_current"])

    Sunspot.commit
  end

  xscenario "generates report", search: true do
    create_session(@user_for_report, 'password123')

    visit "/reports"
    click_on("test_age_location_report")
    expect(page).to have_content("test_age_location_report")
    expect(page).to have_content("0 - 5")
    within(".report_row_values:first-of-type") do
      expect(page).to have_content("1")
    end

    expect(page).to have_content("TEST::LOCATION")
    expect(page).to have_content("51228")

    click_on("Graph")
    within(".tabs-title.is-active") do
      expect(page).to have_content("Graph")
    end
  end
end
