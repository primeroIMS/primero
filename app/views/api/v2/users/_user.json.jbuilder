# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

user_hash = user.attributes.except(*User.hidden_attributes)
user_hash = user_hash.merge({
  agency_id: user.agency_id,
  module_unique_ids: user.module_unique_ids,
  role_unique_id: user.role.unique_id,
  role_group_permission: user.role.group_permission,
  user_group_unique_ids: user.user_group_unique_ids,
  user_groups: user.user_groups,
  identity_provider_unique_id: user.identity_provider&.unique_id,
  agency_office: user.agency_office,
  reporting_location_config: user.reporting_location_config,
  managed_report_scope: user.managed_report_scope
}.compact)

if @extended
  user_hash = user_hash.merge(
    permissions: {
      list: user.role.permissions.map do |p|
        resource = p.resource == Permission::CODE_OF_CONDUCT ? 'codes_of_conduct' : p.resource.pluralize
        { resource:, actions: p.actions }
      end
    },
    permitted_form_unique_ids: user.role.form_section_unique_ids,
    permitted_role_unique_ids: user.role.permitted_role_unique_ids,
    permitted_form: user.role.form_section_permission,
    filters: [
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form,
      RegistryRecord.parent_form,
      Family.parent_form
    ].map { |record_type| { record_type.pluralize => Filter.filters(user, record_type) } }
     .inject(&:merge),
    list_headers: ([
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form,
      RegistryRecord.parent_form,
      Family.parent_form
    ].map { |record_type| { record_type.pluralize => Header.get_headers(user, record_type) } } + [
      { reports: Header.report_headers },
      { tasks: Header.task_headers },
      { bulk_exports: Header.bulk_export_headers },
      { audit_logs: Header.audit_log_headers },
      { agencies: Header.agency_headers },
      { users: Header.user_headers },
      { user_groups: Header.user_group_headers },
      { locations: Header.locations_headers }
    ]).inject(&:merge),
    is_manager: user.manager?
  )
  if user.agency&.logo_full&.attached?
    user_hash = user_hash.merge(
      agency_logo_full: rails_blob_path(user.agency&.logo_full, only_path: true)
    )
  end

  if user.agency&.logo_icon&.attached?
    user_hash = user_hash.merge(
      agency_logo_icon: rails_blob_path(user.agency&.logo_icon, only_path: true)
    )
  end
  user_hash = user_hash.merge(
    agency_unique_id: user.agency&.unique_id,
    agency_name: user.agency&.name
  )
end

json.merge! user_hash.compact_deep
