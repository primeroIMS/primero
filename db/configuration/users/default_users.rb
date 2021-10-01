# frozen_string_literal: true

unicef = Agency.find_by(agency_code: 'UNICEF')

User.create_or_update!(
  'user_name' => 'primero',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'System Superuser',
  'email' => 'primero@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('Superuser').id,
  'user_groups' => UserGroup.all,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'primero_admin_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP Administrator',
  'email' => 'primero_admin_cp@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('CP Administrator').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'primero_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP Worker',
  'email' => 'primero_cp@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('CP Case Worker').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'primero_mgr_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP Manager',
  'email' => 'primero_mgr_cp@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('CP Manager').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'primero_ftr_manager',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'FTR Manager',
  'email' => 'primero_ftr_manager@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('FTR Manager').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero FTR')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'primero_user_mgr_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP User Manager',
  'email' => 'primero_user_mgr_cp@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('CP User Manager').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

User.create_or_update!(
  'user_name' => 'agency_user_admin',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'Agency User Administrator',
  'email' => 'agency_user_admin_cp@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'code' => 'UNICEF/AGENCY_USER_ADMIN_CP',
  'role_id' => Role.find_by_name('Agency User Administrator').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

if I18n.available_locales.include?(Primero::Application::LOCALE_ARABIC)
  User.create_or_update!(
    'user_name' => 'primero_cp_ar',
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'CP Worker AR',
    'email' => 'primero_cp_ar@primero.com',
    'disabled' => 'false',
    'agency_id' => unicef.id,
    'role_id' => Role.find_by_name('CP Case Worker').id,
    'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
    'locale' => Primero::Application::LOCALE_ARABIC
  )

  User.create_or_update!(
    'user_name' => 'primero_mgr_cp_ar',
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'CP Manager AR',
    'email' => 'primero_mgr_cp_ar@primero.com',
    'disabled' => 'false',
    'agency_id' => unicef.id,
    'role_id' => Role.find_by_name('CP Manager').id,
    'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
    'locale' => Primero::Application::LOCALE_ARABIC
  )
end
