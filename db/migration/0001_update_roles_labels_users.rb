# JIRA PRIMERO-266
#  modify RapidFTR roles to be more generic.

#Update the old_label with new_label if found.
def update_permission_label(role, old_label, new_label)
  index = role.permissions.index(old_label)
  if index
    role.permissions[index] = new_label 
    role.save!
  end
  index
end

#Rename the role if found.
def rename_role(old_role, new_rol_name)
  role = Role.find_by_name(old_role)
  if role
    role.name = new_rol_name
    role.save!
  end
  role
end

#Update permission for the role_name if found.
def update_permissions(role_name, permissions)
  role = Role.find_by_name(role_name)
  if role
      role.permissions = permissions
      role.save!
  end
  role
end

#Iterate roles to update labels.
Role.all.all.each do |role|
  [ {:old => "Register Child", :new => "Create Records"},
    {:old => "Edit Child", :new => "Edit Records"},
    {:old => "View And Search Child", :new => "View And Search Records"},
    {:old => "Register Incident", :new => "Create Incidents"},
    {:old => "Edit Incident", :new => "Edit Incidents"},
    {:old => "View And Search Incident", :new => "View And Search Incidents"},
    {:old => "Create Enquiry", :new => "Create Enquires"},
    {:old => "Update Enquiry", :new => "Edit Enquires"},
    {:old => "View and Download Reports", :new => "View Reports"},
    {:old => "Users for synchronisation", :new => "Manage System Users"},
    {:old => "Manage Replications", :new => "Manage Device Replication"},
    {:old => "System Settings", :new => "Manage Contact Information"}
  ].each do |label|
    puts "Role: '#{role.name}' Renamed permission '#{label[:old]}' to '#{label[:new]}'" if update_permission_label(role, label[:old], label[:new])
  end
end

#Rename rol.
[ {:old => "Registration Officer", :new => "Manager"},
  {:old => "Child Protection Specialist", :new => "Worker: Cases"},
  {:old => "Mrm Worker", :new => "Worker: Incidents"},
  {:old => "Senior Official", :new => "View Reports"},
  {:old => "Field Level Admin", :new => "Office Admin"}
].each do |role|
  puts "Renamed role '#{role[:old]}' to '#{role[:new]}'" if rename_role(role[:old], role[:new])
end

#Update the permission of roles
[ {:role_name => "Registration Worker", :permissions => [Permission::CHILDREN[:view_and_search],
                                                         Permission::CHILDREN[:register],
                                                         Permission::CHILDREN[:edit],
                                                         Permission::ENQUIRIES[:create],
                                                         Permission::ENQUIRIES[:update]]},
  {:role_name => "Manager", :permissions => [Permission::CHILDREN[:view_and_search],
                                             Permission::CHILDREN[:register],
                                             Permission::CHILDREN[:edit],
                                             Permission::CHILDREN[:export_photowall],
                                             Permission::CHILDREN[:export_csv],
                                             Permission::CHILDREN[:export_pdf],
                                             Permission::CHILDREN[:export_cpims],
                                             Permission::REPORTS[:view],
                                             Permission::ENQUIRIES[:create],
                                             Permission::ENQUIRIES[:update]]},
  {:role_name => "Worker: Cases", :permissions => [Permission::CHILDREN[:view_and_search],
                                            Permission::CHILDREN[:register],
                                            Permission::CHILDREN[:edit],
                                            Permission::CHILDREN[:export_photowall],
                                            Permission::CHILDREN[:export_csv],
                                            Permission::CHILDREN[:export_pdf],
                                            Permission::CHILDREN[:export_cpims],
                                            Permission::REPORTS[:view]]},
 {:role_name => "Worker: Incidents", :permissions => [Permission::INCIDENTS[:view_and_search],
                                              Permission::INCIDENTS[:register],
                                              Permission::INCIDENTS[:edit],
                                              Permission::INCIDENTS[:export_csv],
                                              Permission::INCIDENTS[:export_pdf],
                                              Permission::REPORTS[:view]]},
  {:role_name => "Office Admin", :permissions => [Permission::USERS[:create_and_edit],
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
                                                  Permission::ENQUIRIES[:update]]},
  {:role_name => "System Admin", :permissions => [Permission::USERS[:create_and_edit],
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
                                                  Permission::DEVICES[:replications]]}
].each do |role|
  puts "Updated permissions for role '#{role[:role_name]}'" if update_permissions(role[:role_name], role[:permissions])
end
