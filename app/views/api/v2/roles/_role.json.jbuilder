# frozen_string_literal: true

json.id role.id
json.unique_id role.unique_id
json.name role.name
json.description role.description
json.group_permission role.group_permission
json.referral role.referral
json.transfer role.transfer
json.is_manager role.is_manager
json.module_unique_ids role.module_unique_ids
json.form_section_unique_ids role.form_section_unique_ids
json.permissions Permission::PermissionSerializer.dump(role.permissions)
