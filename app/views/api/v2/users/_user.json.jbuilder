user_hash =  user.attributes.reject{ |k,_| User.hidden_attributes.include?(k) }
if @extended
  user_hash = user_hash.merge(
    modules: user.primero_modules.map(&:unique_id),
    agency: user.agency.try(:id),
    permissions: {
      list: user.role.permissions.map{ |p| { resource: p.resource.pluralize, actions: p.actions } },
    },
    filters: [
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map{ |record_type| { record_type.pluralize => Filter.get_filters(user, record_type) } }
     .inject(&:merge),
    list_headers: ([
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map{ |record_type| { record_type.pluralize => Header.get_headers(user, record_type) } } + [
      { reports: Header.report_headers },
      { tasks: Header.task_headers },
      { bulk_exports: Header.bulk_export_headers },
      { audit_logs:  Header.audit_log_headers },
      { agencies: Header.agency_headers },
      { users: Header.user_headers },
      { user_groups: Header.user_group_headers }
    ]).inject(&:merge),
    is_manager: user.is_manager?
  )
end

json.merge! user_hash.compact
