def create_or_update_user(user_hash)
  user = User.find_by(user_name: user_hash['user_name'])

  if user.present?
    puts "Updating user #{user.user_name}"
    user.update_attributes user_hash
  else
    puts "Creating user #{user_hash['user_name']}"
    User.create! user_hash
  end
end

unicef = Agency.find_by(agency_code: 'UNICEF')

create_or_update_user(
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

create_or_update_user(
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

create_or_update_user(
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

create_or_update_user(
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

create_or_update_user(
  'user_name' => 'primero_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV Worker',
  'email' => 'primero_gbv@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('GBV Caseworker').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_mgr_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV Manager',
  'email' => 'primero_mgr_gbv@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('GBV Manager').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
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

create_or_update_user(
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

create_or_update_user(
  'user_name' => 'primero_user_mgr_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV User Manager',
  'email' => 'primero_user_mgr_gbv@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'role_id' => Role.find_by_name('GBV User Manager').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
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

create_or_update_user(
  'user_name' => 'primero_system_admin_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV System Administrator',
  'email' => 'primero_system_admin_gbv@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'code' => 'UNICEF/GBV_SYSTEM_ADMINISTRATOR',
  'role_id' => Role.find_by_name('GBV System Administrator').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'agency_user_admin_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV Agency User Administrator',
  'email' => 'agency_user_admin_gbv@primero.com',
  'disabled' => 'false',
  'agency_id' => unicef.id,
  'code' => 'UNICEF/AGENCY_USER_ADMIN_GBV',
  'role_id' => Role.find_by_name('GBV Agency User Administrator').id,
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'locale' => Primero::Application::LOCALE_ENGLISH
)

if Primero::Application.locales.include?(Primero::Application::LOCALE_ARABIC)
  create_or_update_user(
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

  create_or_update_user(
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

  create_or_update_user(
    'user_name' => 'primero_gbv_ar',
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'GBV Worker AR',
    'email' => 'primero_gbv_ar@primero.com',
    'disabled' => 'false',
    'agency_id' => unicef.id,
    'role_id' => Role.find_by_name('GBV Social Worker').id,
    'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
    'locale' => Primero::Application::LOCALE_ARABIC
  )

  create_or_update_user(
    'user_name' => 'primero_mgr_gbv_ar',
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'GBV Manager AR',
    'email' => 'primero_mgr_gbv_ar@primero.com',
    'disabled' => 'false',
    'agency_id' => unicef.id,
    'role_id' => Role.find_by_name('GBV Manager').id,
    'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
    'locale' => Primero::Application::LOCALE_ARABIC
  )
end
