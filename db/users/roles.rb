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


create_or_update_role(
  :name => "CP Case Worker",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE,
    Permission::TRACING_REQUEST
  ]
)

create_or_update_role(
  :name => "CP Manager",
  :permissions => [
    Permission::READ,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::CASE,
    Permission::TRACING_REQUEST,
    Permission::USER,
    Permission::GROUP
  ]
)

create_or_update_role(
  :name => "GBV Social Worker",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE,
    Permission::INCIDENT
  ]
)

create_or_update_role(
  :name => "GBV Manager",
  :permissions => [
    Permission::READ,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::CASE,
    Permission::INCIDENT,
    Permission::USER,
    Permission::GROUP
  ]
)

create_or_update_role(
  :name => "MRM Worker", #TODO: Is there a better name?
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::INCIDENT
  ]
)

create_or_update_role(
  :name => "MRM Manager",
  :permissions => [
    Permission::READ,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::INCIDENT,
    Permission::USER,
    Permission::GROUP
  ]
)

create_or_update_role(
  :name => "Superuser",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::CASE,
    Permission::INCIDENT,
    Permission::TRACING_REQUEST,
    Permission::USER,
    Permission::METADATA,
    Permission::SYSTEM,
    Permission::IMPORT,
    Permission::ALL
  ]
)

