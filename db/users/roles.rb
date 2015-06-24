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

export_permissions = [
  Permission::EXPORT_LIST_VIEW,
  Permission::EXPORT_CSV,
  Permission::EXPORT_EXCEL,
  Permission::EXPORT_JSON,
  Permission::EXPORT_PHOTO_WALL,
  Permission::EXPORT_PDF,
  Permission::EXPORT_UNHCR,
  Permission::EXPORT_CASE_PDF,
  Permission::EXPORT_MRM_VIOLATION_XLS,
  Permission::EXPORT_INCIDENT_RECORDER
]

create_or_update_role(
  :name => "CP Case Worker",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE,
    Permission::TRACING_REQUEST
  ] + export_permissions
)

create_or_update_role(
  :name => "CP Manager",
  :permissions => [
    Permission::READ,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::REPORT_CREATE,
    Permission::CONSENT_OVERRIDE,
    Permission::CASE,
    Permission::TRACING_REQUEST,
    Permission::REPORT,
    Permission::USER,
    Permission::GROUP,
    Permission::EXPORT_CUSTOM
  ] + export_permissions
)

create_or_update_role(
  :name => "GBV Social Worker",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE,
    Permission::INCIDENT
  ] + export_permissions
)

create_or_update_role(
  :name => "GBV Manager",
  :permissions => [
    Permission::READ,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::REPORT_CREATE,
    Permission::CONSENT_OVERRIDE,
    Permission::CASE,
    Permission::INCIDENT,
    Permission::REPORT,
    Permission::USER,
    Permission::GROUP,
    Permission::EXPORT_CUSTOM
  ] + export_permissions
)

# create_or_update_role(
#   :name => "MRM Worker", #TODO: Is there a better name?
#   :permissions => [
#     Permission::READ,
#     Permission::WRITE,
#     Permission::FLAG,
#     Permission::INCIDENT
#   ] + export_permissions
# )

# create_or_update_role(
#   :name => "MRM Manager",
#   :permissions => [
#     Permission::READ,
#     Permission::FLAG,
#     Permission::ASSIGN,
#     Permission::REPORT_CREATE,
#     Permission::CONSENT_OVERRIDE,
#     Permission::INCIDENT,
#     Permission::USER,
#     Permission::GROUP,
#     Permission::REPORT,
#     Permission::EXPORT_CUSTOM
# ] + export_permissions
# )

create_or_update_role(
  :name => "Referral",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE
  ] + export_permissions,
  :referral => true
)

create_or_update_role(
  :name => "Transfer",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::CASE
  ] + export_permissions,
  :transfer => true
)

create_or_update_role(
  :name => "Superuser",
  :permissions => [
    Permission::READ,
    Permission::WRITE,
    Permission::FLAG,
    Permission::ASSIGN,
    Permission::REPORT_CREATE,
    Permission::CONSENT_OVERRIDE,
    Permission::CASE,
    Permission::INCIDENT,
    Permission::TRACING_REQUEST,
    Permission::USER,
    Permission::METADATA,
    Permission::SYSTEM,
    Permission::IMPORT,
    Permission::REPORT,
    Permission::REFERRAL,
    Permission::TRANSFER,
    Permission::ALL,
    Permission::EXPORT_CUSTOM
  ] + export_permissions
)

