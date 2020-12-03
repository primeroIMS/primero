# frozen_string_literal: true

# Helpers for request specs that require a logged in user.
module FakeDeviseLogin
  def permission_case
    @permission_case ||= Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  def permission_incident
    @permission_incident ||= Permission.new(
      resource: Permission::INCIDENT,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  def permission_tracing_request
    @permission_tracing_request ||= Permission.new(
      resource: Permission::TRACING_REQUEST,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  def permission_potential_match
    @permission_potential_match ||= Permission.new(
      resource: Permission::POTENTIAL_MATCH,
      actions: [Permission::READ]
    )
  end

  def permission_flag_record
    actions = [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]
    @permission_flag_record = [
      Permission.new(resource: Permission::CASE, actions: actions),
      Permission.new(resource: Permission::TRACING_REQUEST, actions: actions),
      Permission.new(resource: Permission::INCIDENT, actions: actions)
    ]
  end

  def common_permitted_field_names
    @common_permitted_field_names ||= %w[
      name age sex protection_concerns registration_date record_sate status family_details
      description incident_date date_of_birth
      inquiry_date relation_name relation tracing_request_subform_section
    ]
  end

  def fake_role(opts = {})
    permissions = opts[:permissions] || [permission_case, permission_incident, permission_tracing_request]
    group_permission = opts[:group_permission] || Permission::ALL
    role = Role.new(
      permissions: permissions,
      group_permission: group_permission,
      form_sections: opts[:form_sections] || []
    )
    role.stub(:modules).and_return(opts[:modules] || [])
    role
  end

  def fake_user_name
    'faketest'
  end

  def fake_user_id
    nil
  end

  def fake_user(opts = {})
    user_name = opts[:user_name] || fake_user_name
    agency_id = opts[:agency_id]
    user_group_ids = opts[:user_group_ids] || []
    user = User.new(user_name: user_name, user_group_ids: user_group_ids, agency_id: agency_id)
    user.stub(:role).and_return(fake_role(opts))
    permitted_field_names = opts[:permitted_field_names] || common_permitted_field_names
    user.stub(:permitted_field_names_from_forms).and_return(permitted_field_names)
    user
  end

  def login_for_test(opts = {})
    sign_in(fake_user(opts))
  end
end
