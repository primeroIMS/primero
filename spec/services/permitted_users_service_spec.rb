# frozen_string_literal: true

require 'rails_helper'

describe PermittedUsersService do
  before :each do
    clean_data(Agency, Role, UserGroup, User, PrimeroModule)

    @super_user_permissions = [
      Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::INCIDENT, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE])
    ]

    @admin_user_permissions = [
      Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE])
    ]

    @super_role = Role.new_with_properties(
      name: 'Super Role',
      unique_id: 'super-role',
      permissions: @super_user_permissions,
      group_permission: Permission::ALL
    )
    @super_role.save(validate: false)

    @admin_role = Role.new_with_properties(
      name: 'Admin Role',
      unique_id: 'admin-role',
      permissions: @admin_user_permissions,
      group_permission: Permission::ADMIN_ONLY
    )
    @admin_role.save(validate: false)

    @agency1 = Agency.create!(name: 'Agency1', agency_code: 'A1')
    @agency2 = Agency.create!(name: 'Agency2', agency_code: 'A2')
    permission_agency_read = Permission.new(
      resource: Permission::USER, actions: [Permission::AGENCY_READ]
    )
    role_agency_read = Role.new(permissions: [permission_agency_read])
    role_agency_read.save(validate: false)

    permission_cannot = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ]
    )
    role_cannot = Role.new(permissions: [permission_cannot], group_permission: Permission::GROUP)
    role_cannot.save(validate: false)

    @group_a = UserGroup.create!(name: 'group A', unique_id: 'group-a')
    @group_b = UserGroup.create!(name: 'group B', unique_id: 'group-b')

    @user1 = User.new(user_name: 'user1', role: role_agency_read, agency: @agency1, user_groups: [@group_a])
    @user1.save(validate: false)
    @user2 = User.new(user_name: 'user2', role: role_cannot, agency: @agency1, user_groups: [@group_a])
    @user2.save(validate: false)
    @user3 = User.new(user_name: 'user3', role: role_agency_read, disabled: true,
                      agency: @agency2, user_groups: [@group_b])
    @user3.save(validate: false)
    @user4 = User.new(user_name: 'user4', role: role_cannot, agency: @agency2, user_groups: [@group_b])

    @user4.save(validate: false)
    @user = User.new(user_name: 'user5', role: role_agency_read, agency: @agency1, user_groups: [@group_a])
    @user.save(validate: false)

    @admin_user = User.create!(
      full_name: 'Admin User',
      user_name: 'admin_user',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'adminusera@localhost.com',
      agency_id: @agency1.id,
      role: @admin_role
    )

    @super_user = User.create!(
      full_name: 'Super user',
      user_name: 'super_user',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'superuser@localhost.com',
      agency_id: @agency1.id,
      role: @super_role
    )
  end

  it 'return all users' do
    users = PermittedUsersService.new(@super_user).find_permitted_users

    expect(users.dig(:users).map(&:user_name)).to match_array(%w[user1 user2 user3 user4 user5 admin_user super_user])
  end

  it 'returns all users who are not super users' do
    users = PermittedUsersService.new(@admin_user).find_permitted_users

    expect(users.dig(:users).map(&:user_name)).to match_array(%w[user1 user2 user3 user4 user5 admin_user])
  end

  it 'return users with the same agency' do
    users = PermittedUsersService.new(@user).find_permitted_users

    expect(users.dig(:users).map(&:user_name)).to match_array(%w[user1 user2 user5])
  end

  it 'return users with the same user group' do
    users = PermittedUsersService.new(@user4).find_permitted_users

    expect(users.dig(:users).map(&:user_name)).to match_array(%w[user3 user4])
  end

  it 'return users with the same agency for the specified user_group_id' do
    users = PermittedUsersService.new(@user).find_permitted_users('user_group_ids' => 'group-a')

    expect(users.dig(:users).map(&:user_name)).to match_array(%w[user1 user2 user5])
  end
end
