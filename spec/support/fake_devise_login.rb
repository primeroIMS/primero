module FakeDeviseLogin

  def permission_case
    @permission_case ||= Permission.new(:resource => Permission::CASE,
                                        :actions => [Permission::READ, Permission::WRITE, Permission::CREATE])
  end

  def permission_incident
    @permission_incident ||= Permission.new(:resource => Permission::INCIDENT,
                                            :actions => [Permission::READ, Permission::WRITE, Permission::CREATE])
  end

  def permission_tracing_request
    @permission_tracing_request ||= Permission.new(:resource => Permission::TRACING_REQUEST,
                                                   :actions => [Permission::READ, Permission::WRITE, Permission::CREATE])
  end

  def permission_flag_record
    @permission_flag_record = [
      Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]),
      Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]),
      Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG])
    ]
  end



  def common_permitted_field_names
    @common_permitted_field_names ||= %w(
      name age sex protection_concerns registration_date record_sate status family_details
      description incident_date
      inquiry_date relation_name relation
     )
  end

  def fake_user_name ; 'faketest' ; end

  def fake_user_id ; nil ; end

  def login_for_test(opts={})
    user = User.new(user_name: 'faketest')
    permissions = opts[:permissions] || [permission_case, permission_incident, permission_tracing_request]
    group_permission = opts[:group_permission] || Permission::ALL
    role = Role.new(
      permissions: permissions,
      group_permission: group_permission,
      form_sections: opts[:form_sections] || []
    )
    role.stub(:modules).and_return(opts[:modules] || [])
    user.stub(:role).and_return(role)
    permitted_field_names = opts[:permitted_field_names] || common_permitted_field_names
    user.stub(:permitted_field_names_from_forms).and_return(permitted_field_names)
    sign_in(user)
  end

end
