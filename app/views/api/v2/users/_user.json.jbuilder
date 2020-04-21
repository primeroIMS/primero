user_hash = user.attributes.reject { |k, _| User.hidden_attributes.include?(k) }
user_hash = user_hash.merge({
  agency_id: user.agency_id,
  module_unique_ids: user.module_unique_ids,
  role_unique_id: user.role.unique_id,
  user_group_unique_ids: user.user_group_unique_ids,
  identity_provider_unique_id: user.identity_provider&.unique_id
}.compact)

if @extended
  user_hash = user_hash.merge(
    permissions: {
      list: user.role.permissions.map{ |p| { resource: p.resource.pluralize, actions: p.actions } },
    },
    filters: [
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map { |record_type| { record_type.pluralize => Filter.filters(user, record_type) } }
     .inject(&:merge),
    list_headers: ([
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map { |record_type| { record_type.pluralize => Header.get_headers(user, record_type) } } + [
      { reports: Header.report_headers },
      { tasks: Header.task_headers },
      { bulk_exports: Header.bulk_export_headers },
      { audit_logs: Header.audit_log_headers },
      { agencies: Header.agency_headers },
      { users: Header.user_headers },
      { user_groups: Header.user_group_headers }
    ]).inject(&:merge),
    is_manager: user.is_manager?
  )
end

json.merge! user_hash.compact_deep
