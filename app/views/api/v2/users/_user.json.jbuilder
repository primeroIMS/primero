user_hash =  user.attributes.reject{ |k,_| User.hidden_attributes.include?(k) }
if @extended
  user_hash = user_hash.merge({ 
    modules: user.modules.map(&:id),
    agency: user.agency.try(:id),
    permissions: {
      list: user.role.permissions.map{ |p| { resource: p.resource, actions: p.actions } },
    },
    filters: [
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map{ |record_type| { record_type => Filter.get_filters(user, record_type, @lookups, @locations, @reporting_locations, @system) } },
    list_headers: [
      Child.parent_form,
      Incident.parent_form,
      TracingRequest.parent_form
    ].map{ |record_type| { record_type => Header.get_headers(user, record_type) } } + [
      { report: Header.report_headers },
      { task: Header.task_headers },
      { bulk_export: Header.bulk_export_headers },
      { audit_log:  Header.audit_log_headers },
      { agency: Header.agency_headers },
      { user: Header.user_headers },
      { user_group: Header.user_group_headers }
    ],
    is_manager: user.is_manager?
  })
end
json.merge! user_hash.compact!
