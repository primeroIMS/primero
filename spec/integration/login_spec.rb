require 'spec_helper'

feature "signin process" do
  before do
    @user = create(:user, password: 'password123', password_confirmation: 'password123')
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
end