# TODO: Following scenarios are skipped (using xscenario) due to issues with chrome update / new webdriver gem / capybara gem
# This should be addressed by PRIM-914

require 'rails_helper'

feature "signin process" do
  before(:all) do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy

    program = create(:primero_program)
    module_options = { program_id: program.id}
    primero_module = create(:primero_module, module_options)
    @user = create(:user, password: 'password123', password_confirmation: 'password123')
    SystemSettings.create(default_locale: "en", primary_age_range: "primary", age_ranges: {"primary" => [1..2, 3..4]})
  end

  xscenario "invalid signin" do
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: 'heyguy'
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content 'Invalid credentials. Please try again!'
  end

  xscenario "valid signin" do
    login_user(@user)
    expect(page).to have_content "Logged in as: #{@user.user_name}"
  end

  xscenario "returns to requested url after login" do
    visit "/users"
    within(".login_page form") do
      fill_in 'User Name', with: @user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page.current_path).to eq "/users"
  end

  xscenario "does not allow user to be redirected to unauthorized url after login" do
    visit "/system_settings/administrator/edit"
    within(".login_page form") do
      fill_in 'User Name', with: @user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content "Not Authorized"
  end

  xscenario "does not store logout as stored location" do
    visit "/logout"
    within(".login_page form") do
      fill_in "User Name", with: @user.user_name
      fill_in "Password", with: 'password123'
    end
    click_button 'Log in'
    expect(page.current_path).to eq "/"
  end
end
