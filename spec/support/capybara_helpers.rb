module CapybaraHelpers
  def login_user(user)
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
  end
end