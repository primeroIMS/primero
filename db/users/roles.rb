Role.create!(
  :name => "registration worker",
  :permissions => [
    Permission::CHILDREN[:view_and_search],
    Permission::CHILDREN[:register],
    Permission::CHILDREN[:edit],
    Permission::ENQUIRIES[:create],
    Permission::ENQUIRIES[:update]
  ]
)

Role.create!(
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

Role.create!(
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

Role.create!(
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

Role.create!(
  :name => "view reports",
  :permissions => [Permission::REPORTS[:view]])

Role.create!(
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
    Permission::DEVICES[:black_list],
    Permission::DEVICES[:replications]
  ]
)
