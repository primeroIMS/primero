Role.create!(
  :name => "registration worker",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit]
  ]
)

Role.create!(
  :name => "registration officer",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::CHILDREN[:export],
    Permission::REPORTS[:view]
  ]
)

Role.create!(
  :name => "child protection specialist",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::CHILDREN[:export],
    Permission::REPORTS[:view],
    Permission::USERS[:view]
  ]
)

Role.create!(
  :name => "senior official",
  :permissions => [Permission::REPORTS[:view]])

Role.create!(
  :name => "field level admin",
  :permissions => [
    Permission::USERS[:create_and_edit],
    Permission::USERS[:view],
    Permission::USERS[:destroy],
    Permission::USERS[:disable],
    Permission::ROLES[:view],
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:export],
    Permission::REPORTS[:view]
  ]
)

Role.create!(
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
    Permission::DEVICES[:blacklist],
    Permission::DEVICES[:replications]
  ]
)
