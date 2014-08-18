def create_or_update_role(role_hash)
  role_id = Role.role_id_from_name role_hash[:name]
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
  :name => "registration worker",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::ENQUIRIES[:create],
    Permission::ENQUIRIES[:update]
  ]
)

create_or_update_role(
  :name => "manager",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::CHILDREN[:export_photowall],
    Permission::CHILDREN[:export_csv],
    Permission::CHILDREN[:export_pdf],
    Permission::CHILDREN[:export_cpims],
    Permission::REPORTS[:view],
    Permission::ENQUIRIES[:create],
    Permission::ENQUIRIES[:update]
  ]
)

create_or_update_role(
  :name => "worker: cases",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::CHILDREN[:export_photowall],
    Permission::CHILDREN[:export_csv],
    Permission::CHILDREN[:export_pdf],
    Permission::CHILDREN[:export_cpims],
    Permission::REPORTS[:view]
  ]
)

create_or_update_role(
  :name => "worker: incidents",
  :permissions => [
    Permission::INCIDENTS[:view_and_search],
    Permission::INCIDENTS[:register],
    Permission::INCIDENTS[:edit],
    Permission::INCIDENTS[:export_csv],
    Permission::INCIDENTS[:export_pdf],
    Permission::REPORTS[:view]
  ]
)

create_or_update_role(
  :name => "worker: tracing requests",
  :permissions => [
    Permission::TRACING_REQUESTS[:view_and_search],
    Permission::TRACING_REQUESTS[:register],
    Permission::TRACING_REQUESTS[:edit],
    Permission::TRACING_REQUESTS[:export_csv],
    Permission::TRACING_REQUESTS[:export_pdf],
    Permission::REPORTS[:view]
  ]
)

create_or_update_role(
  :name => "view reports",
  :permissions => [Permission::REPORTS[:view]])

create_or_update_role(
  :name => "office admin",
  :permissions => [
    Permission::USERS[:create_and_edit],
    Permission::USERS[:view],
    Permission::USERS[:destroy],
    Permission::USERS[:disable],
    Permission::ROLES[:view],
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:export_photowall],
    Permission::CHILDREN[:export_csv],
    Permission::CHILDREN[:export_pdf],
    Permission::CHILDREN[:export_cpims],
    Permission::REPORTS[:view],
    Permission::ENQUIRIES[:create],
    Permission::ENQUIRIES[:update]
  ]
)

create_or_update_role(
  :name => "system admin",
  :permissions => [
    Permission::USERS[:create_and_edit],
    Permission::USERS[:view],
    Permission::USERS[:destroy],
    Permission::USERS[:disable],
    Permission::ROLES[:create_and_edit],
    Permission::ROLES[:view],
    Permission::REPORTS[:view],
    Permission::FORMS[:manage],
    Permission::SYSTEM[:highlight_fields],
    Permission::SYSTEM[:contact_information],
    Permission::SYSTEM[:system_users],
    Permission::DEVICES[:black_list],
    Permission::DEVICES[:replications]
  ]
)
