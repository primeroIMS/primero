# frozen_string_literal: true

# This script adds the `disable_multiple` permission to all superuser roles.
# Usage: rails r db/data_migration/v2.14/add_disable_multiple_to_superusers.rb

def print_log(message)
  puts "[#{Time.current}]: #{message}"
end

print_log('Starting data migration to add disable_multiple permission to superusers...')

role = Role.find_by(unique_id: 'role-superuser')
role_permission = role.permissions.find { |p| p.resource == Permission::USER }
role_permission.actions << Permission::DISABLE_MULTIPLE
role.save!
print_log("Added disable_multiple permission to role: #{role.name}")
