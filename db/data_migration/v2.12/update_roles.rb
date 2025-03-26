# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r update_roles.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M')}]: #{message}"
  puts message
end

def grant_new_updated?(role)
  return false if role.group_permission == Permission::ALL

  role.group_permission == Permission::SELF || role.permitted_dashboard?(Permission::DASH_CASE_OVERVIEW) ||
    role.permitted_dashboard?(Permission::DASH_CASE_INCIDENT_OVERVIEW)
end

def grant_new_referrals?(role)
  return false if role.group_permission == Permission::ALL

  role.permitted_dashboard?(Permission::DASH_SHARED_WITH_ME) &&
    role.permits?(Permission::CASE, Permission::RECEIVE_REFERRAL)
end

def grant_transfers_awaiting_acceptance?(role)
  role.permitted_dashboard?(Permission::DASH_SHARED_WITH_ME) &&
    role.permits?(Permission::CASE, Permission::RECEIVE_TRANSFER)
end

save_records = ARGV[0] == 'true'

print_log('Updating roles...')

roles = Role.all.map do |role|
  grants = []
  grants << Permission::DASH_ACTION_NEEDED_NEW_UPDATED if grant_new_updated?(role)
  grants << Permission::DASH_ACTION_NEEDED_NEW_REFERRALS if grant_new_referrals?(role)
  grants << Permission::DASH_ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE if grant_transfers_awaiting_acceptance?(role)
  permission_dashboard = role.permissions.find { |permission| permission.resource == Permission::DASHBOARD }

  if grants.present? && grants.any? { |grant| (permission_dashboard&.actions || []).exclude?(grant) }
    role.permissions = role.permissions.map do |permission|
      next(permission) unless permission.resource == Permission::DASHBOARD
      next(permission) if permission.actions.all? { |action| grants.include?(action) }

      Permission.new(resource: Permission::DASHBOARD, actions: (permission.actions + grants).uniq)
    end

    if permission_dashboard.blank?
      role.permissions += [Permission.new(resource: Permission::DASHBOARD, actions: grants)]
    end
  end

  if role.super_user_role? &&
     role.permissions.none? { |permission| permission.resource == Permission::USAGE_REPORT }
    role.permissions += [Permission.new(resource: Permission::USAGE_REPORT, actions: [Permission::READ])]
  end

  role
end

if save_records
  roles.each do |role|
    next unless role.changed?

    role.save!
    print_log("Role: #{role.unique_id} saved.")
  rescue StandardError => e
    print_log("Error #{e.message} when trying to save the role: #{role.unique_id}")
  end
else
  modified_roles = roles.each_with_object([]) { |role, memo| memo << role.unique_id if role.changed? }
  if modified_roles.present?
    print_log('The following roles will  be modified:')
    print_log(modified_roles)
  else
    print_log('No roles will be modified.')
  end
end

print_log('Done.')
