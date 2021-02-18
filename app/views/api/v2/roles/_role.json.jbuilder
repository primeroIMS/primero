# frozen_string_literal: true

json.id role.id
json.unique_id role.unique_id
json.name role.name
json.description role.description
json.group_permission role.group_permission
json.referral role.referral
json.transfer role.transfer
json.disabled role.disabled
json.is_manager role.is_manager
json.reporting_location_level role.reporting_location_level
json.module_unique_ids role.module_unique_ids
json.form_section_read_write role.form_section_permission
json.permissions Permission::PermissionSerializer.dump(role.permissions)
