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

  def create_system_setting
    system_settings_hash = {
      default_locale: "en",
      :primary_age_range => "primero",
      :age_ranges => {
        "primero" => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
        "unhcr" => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
      },
      :show_alerts => true
    }
    system_settings = SystemSettings.first || SystemSettings.create!(system_settings_hash)
  end

  def build_form(form_section)
    forms = []

    if form_section.present?
      forms = form_section
    else
      forms << create(:form_section,
        is_first_tab: true,
        fields: [
          build(:field)
        ]
      )
    end

    forms.map{ |fs| fs.unique_id }
  end

  def setup_user(args = {})
    create_system_setting

    form_sections = build_form(args[:form_sections])

    user_factory = args[:user].present? ? args[:user].to_sym : :user
    program = create(:primero_program)

    module_options = { program_id: program.id, associated_form_ids: form_sections }

    if args[:primero_module].present?
      module_options.merge!(args[:primero_module])
    end

    primero_module = create(:primero_module, module_options)
    roles = args[:roles] || create(:role)
    user_group = args[:user_groups] || create(:user_group)
    user_org = args[:organization] || 'agency-unicef'
    user = create(user_factory,
      password: 'password123',
      password_confirmation: 'password123',
      role_ids: [roles.id],
      module_ids: [primero_module.id],
      user_group_ids: [user_group.id],
      organization: user_org
    )

    user
  end

  def within_in_subform(subform_name, num, &block)
    within("fieldset#subform_#{subform_name}_#{num}") do
      block.call
    end
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