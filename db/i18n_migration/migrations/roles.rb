puts 'Migrating (i81n): Roles'

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
    agency_resource = role.permissions_list.select{|pl| pl.resource. == 'user'}.first.dup
    agency_resource.resource = 'agency'
    role.permissions_list << agency_resource
    changed = true
  end

  role.save! if changed
end