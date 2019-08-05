puts 'Migrating (i18n): Roles'

include MigrationHelper

Role.all.each do |role|
  changed = false
  role.permissions_list.each do |permission|
    if permission.actions.include?("write") && !permission.actions.include?("create")
      permission.actions.push("create")
      changed = true
    end
  end

  resources = role.permissions_list.map{|pl| pl.resource}
  if resources.include?('user') && resources.exclude?('agency')
    agency_resource = role.permissions_list.select{|pl| pl.resource == 'user'}.first.dup
    agency_resource.resource = 'agency'
    role.permissions_list << agency_resource
    changed = true
  end
  if resources.include?('user') && resources.exclude?('user_group')
    user_group_resource = role.permissions_list.select{|pl| pl.resource == 'user'}.first.dup
    user_group_resource.resource = 'user_group'
    role.permissions_list << user_group_resource
    changed = true
  end

  role.save! if changed
end