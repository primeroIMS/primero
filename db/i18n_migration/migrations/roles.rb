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

  role.save! if changed
end