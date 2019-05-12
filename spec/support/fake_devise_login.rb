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

  def common_permitted_field_names
    @common_permitted_field_names ||= %w(name age sex protection_concerns registration_date record_sate status)
  end

  def fake_test_login(opts={})
    user = User.new(user_name: 'faketest')
    user.stub(:role).and_return(
        Role.new(
            permissions_list: [permission_case, permission_incident, permission_tracing_request],
            group_permission: Permission::ALL
        )
    )
    permitted_field_names = opts[:permitted_field_names] || common_permitted_field_names
    user.stub(:permitted_fields).and_return(permitted_field_names.map{|n| Field.new(name: n.to_s)})
    sign_in(user)
  end



end