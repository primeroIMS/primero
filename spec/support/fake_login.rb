module FakeLogin
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


  def fake_login user = User.new(:user_name => 'fakeuser', :role_ids => ["abcd"])
    session = Session.new :user_name => user.user_name
  	session.save

    user.stub(:id => "1234") unless user.try(:id)
    User.stub(:find).with(user.id).and_return(user)

    @controller.stub(:current_session).and_return(session)
    Role.stub(:get).with("abcd").and_return(Role.new(:name => "default",
                                                     :permissions => [permission_case,
                                                                      permission_incident,
                                                                      permission_tracing_request]))
    User.stub(:find_by_user_name).with(user.user_name).and_return(user)
    session
  end

  def fake_admin_login user = User.new(:user_name => 'fakeadmin')
    user.stub(:roles).and_return([Role.new(permissions: Permission.all_available, group_permission: Permission::ALL)])
    fake_login user
  end

  def fake_field_admin_login
    user = User.new(:user_name => 'fakefieldadmin')
    user.stub(:roles).and_return([Role.new(:permissions => [permission_case,
                                                            permission_incident,
                                                            permission_tracing_request])])
    fake_login user
  end

  def fake_field_worker_login
    user = User.new(:user_name => 'fakefieldworker')
    user.stub(:roles).and_return([Role.new(:permissions => [permission_case,
                                                            permission_incident,
                                                            permission_tracing_request])])
    fake_login user
  end

  def fake_mrm_admin_login
    user = User.new(:user_name => 'fakemrmadmin')
    user.stub(:roles).and_return([Role.new(:permissions => [permission_incident])])
    fake_login user
  end

  def fake_mrm_worker_login
    user = User.new(:user_name => 'fakemrmworker')
    user.stub(:roles).and_return([Role.new(:permissions => [permission_incident])])
    fake_login user
  end

  def fake_login_as(resource = nil, actions = [], group_permission = Permission::SELF, user_group_ids = [])
    permission_list = (resource.blank? || actions.blank?) ? Permission.all_available :
                                                            [Permission.new(resource: resource, actions: actions)]
    user = User.new(:user_name => 'fakelimited', :user_group_ids => user_group_ids)
    user.stub(:roles).and_return([Role.new(permissions: permission_list, group_permission: group_permission)])
    fake_login user
  end

  def fake_login_with_permissions(permission_list = Permission.all_available, group_permission = Permission::SELF)
    fake_login_with_user_and_permissions(User.new(:user_name => 'fakelimited'), permission_list, group_permission)
  end

  def fake_login_with_user_and_permissions(user, permission_list = Permission.all_available, group_permission = Permission::SELF)
    user.stub(:roles).and_return([Role.new(permissions: permission_list, group_permission: group_permission)])
    fake_login user
  end

end
