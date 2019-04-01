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
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'Superuser').first.id
  ],
  'module_ids' => PrimeroModule.by_name.all.map(&:id),
  'user_groups' => UserGroup.all,
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_admin_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP Administrator',
  'email' => 'primero_admin_cp@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'CP Administrator').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP Worker',
  'email' => 'primero_cp@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'CP Case Worker').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
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
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'CP Manager').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV Worker',
  'email' => 'primero_gbv@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'GBV Social Worker').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
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
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'GBV Manager').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_ftr_manager',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'FTR Manager',
  'email' => 'primero_ftr_manager@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'FTR Manager').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero FTR')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_user_mgr_cp',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'CP User Manager',
  'email' => 'primero_user_mgr_cp@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'CP User Manager').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_user_mgr_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV User Manager',
  'email' => 'primero_user_mgr_gbv@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'role_ids' => [
    Role.by_name(key: 'GBV User Manager').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'agency_user_admin',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'Agency User Administrator',
  'email' => 'agency_user_admin_cp@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'code' => 'UNICEF/AGENCY_USER_ADMIN_CP',
  'role_ids' => [
    Role.by_name(key: 'Agency User Administrator').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'primero_system_admin_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV System Administrator',
  'email' => 'primero_system_admin_gbv@primero.com',
  'disabled' => 'false',
  'organization' => 'agency-unicef',
  'code' => 'UNICEF/GBV_SYSTEM_ADMINISTRATOR',
  'role_ids' => [
    Role.by_name(key: 'GBV System Administrator').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'is_manager' => true,
  'locale' => Primero::Application::LOCALE_ENGLISH
)

create_or_update_user(
  'user_name' => 'agency_user_admin_gbv',
  'password' => 'primer0!',
  'password_confirmation' => 'primer0!',
  'full_name' => 'GBV Agency User Administrator',
  'email' => 'agency_user_admin_gbv@primero.com',
  'disabled' => 'false',
  'organization' => unicef.id,
  'code' => 'UNICEF/AGENCY_USER_ADMIN_GBV',
  'role_ids' => [
    Role.by_name(key: 'GBV Agency User Administrator').first.id
  ],
  'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
  'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
  'is_manager' => true,
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
    'organization' => 'agency-unicef',
    'role_ids' => [
      Role.by_name(key: 'CP Case Worker').first.id
    ],
    'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
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
    'organization' => 'agency-unicef',
    'role_ids' => [
      Role.by_name(key: 'CP Manager').first.id
    ],
    'module_ids' => [PrimeroModule.by_name(key: 'CP').first.id],
    'user_groups' => [UserGroup.find_by(name: 'Primero CP')],
    'is_manager' => true,
    'locale' => Primero::Application::LOCALE_ARABIC
  )

  create_or_update_user(
    'user_name' => 'primero_gbv_ar',
    'password' => 'primer0!',
    'password_confirmation' => 'primer0!',
    'full_name' => 'GBV Worker AR',
    'email' => 'primero_gbv_ar@primero.com',
    'disabled' => 'false',
    'organization' => 'agency-unicef',
    'role_ids' => [
      Role.by_name(key: 'GBV Social Worker').first.id
    ],
    'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
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
    'organization' => 'agency-unicef',
    'role_ids' => [
      Role.by_name(key: 'GBV Manager').first.id
    ],
    'module_ids' => [PrimeroModule.by_name(key: 'GBV').first.id],
    'user_groups' => [UserGroup.find_by(name: 'Primero GBV')],
    'is_manager' => true,

    'locale' => Primero::Application::LOCALE_ARABIC
  )
end
