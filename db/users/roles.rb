def create_or_update_role(role_hash)
  role_id = Role.id_from_name role_hash[:name]
  role = Role.get role_id

  if role.nil?
    puts "Creating role #{role_id}"
    Role.create! role_hash
  else
    puts "Updating role #{role_id}"
    role.update_attributes role_hash
  end

end

cp_caseworker_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG,
      Permission::SYNC_MOBILE
    ]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [
      Permission::READ,
      Permission::WRITE,
      Permission::FLAG
    ]
  )
]

create_or_update_role(
  :name => "CP Case Worker",
  :permissions_list => cp_caseworker_permissions
)

superuser_permissions = [
  Permission.new(
    :resource => Permission::CASE,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::INCIDENT,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::TRACING_REQUEST,
    :actions => [Permission::MANAGE]
  ),
  Permission.new(
    :resource => Permission::USER,
    :actions => [Permission::MANAGE]
  )
]

create_or_update_role(
  :name => "Superuser",
  :permissions_list => superuser_permissions
)

