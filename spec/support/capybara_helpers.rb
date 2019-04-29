module CapybaraHelpers
  def pause
    $stderr.write 'Press enter to continue'
    $stdin.gets
  end

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

  def create_lookup(id, options)
    create(:lookup, id: id,
      lookup_values: options.map(&:with_indifferent_access))
  end

  def setup_user(args = {})
    create_system_setting

    form_sections = build_form(args[:form_sections])

    user_factory = args[:user].present? ? args[:user].to_sym : :user
    program = create(:primero_program)

    module_options = { program_id: program.id, form_section_ids: form_sections }

    if args[:primero_module].present?
      module_options.merge!(args[:primero_module])
    end

    manager = args[:is_manager] || false

    primero_module = PrimeroModule.find_by(unique_id: module_options[:id])
    primero_module = create(:primero_module, module_options) if primero_module.blank?
    roles = args[:roles] || create(:role)
    user_group = args[:user_groups] || create(:user_group)
    user_org = args[:organization] || 'agency-unicef'
    user_location = args[:location] || create(:location)
    user = create(user_factory,
      password: 'password123',
      password_confirmation: 'password123',
      role_ids: [roles.id],
      module_ids: [primero_module.unique_id],
      user_group_ids: [user_group.id],
      organization: user_org,
      is_manager: manager,
      location: user_location
    )

    user
  end

  def within_in_subform(subform_name, num, &block)
    within("fieldset#subform_#{subform_name}_#{num}") do
      block.call
    end
  end

  def create_session(user, password="password123")
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

  def select_from_chosen(item_text, options)
    field = find_field(options[:from], :visible => false)
    find("##{field[:id]}_chosen").click
    find("##{field[:id]}_chosen ul.chosen-results li", :text => item_text).click
  end

  def scroll_to(element)
    page.evaluate_script("window.scroll(0, $('#{element}').offset().top)")
  end

  def select_from_date_input(element, date)
    month = date.month - 1

    find("##{element}").click
    find('.datepicker--nav-title').click
    within('.datepicker--cells.datepicker--cells-months') do
      find(".datepicker--cell.datepicker--cell-month[data-month='#{month}']", match: :first).click
    end
    within('.datepicker--days.datepicker--body') do
      find(".datepicker--cell-day[data-month='#{month}']", text: date.day, match: :first).click
    end
  end

  def clean_up_objects
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Report.all.each &:destroy
    SystemSettings.all.each &:destroy
    User.all.each &:destroy
    Child.all.each &:destroy
    Lookup.all.each &:destroy
    Sunspot.commit
  end

  def search_for(query)
    fill_in 'query', with: query
    within '#search_form ' do
      find(:css, '.button').click
    end
  end
end
