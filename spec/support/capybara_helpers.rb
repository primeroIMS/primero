module CapybaraHelpers
  def login_user(user)
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
  end

  def logout_user
    find('#logout').click
  end

  def create_session(user, password)
    if user.present? && password.present?
      login = Login.new user_name: user.user_name, password: password
      session = login.authenticate_user

      if session.present? && session.save
        page.set_rack_session(rftr_session_id: session.id)
      else
        raise I18n.t("session.login_error")
      end
    end
  end
end