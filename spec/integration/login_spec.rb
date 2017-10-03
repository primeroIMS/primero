require 'spec_helper'

feature "signin process" do
  before do
    @user = create(:user, password: 'password123', password_confirmation: 'password123')
  end

  scenario "invalid signin" do
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: 'heyguy'
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content 'Invalid credentials. Please try again!'
  end

  scenario "valid signin" do
    login_user(@user)
    expect(page).to have_content "Logged in as: #{@user.user_name}"
  end

  scenario "returns to requested url after login" do
    visit "/users"
    within(".login_page form") do
      fill_in 'User Name', with: @user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page.current_path).to eq "/users"
  end

  scenario "does not allow user to be redirected to unauthorized url after login" do
    visit "/system_settings/administrator/edit"
    within(".login_page form") do
      fill_in 'User Name', with: @user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content "Not Authorized"
  end
end