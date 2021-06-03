# frozen_string_literal: true

# Helpers for request specs that require a logged in user.
module FakeDeviseLogin
  COMMON_PERMITTED_FIELDS = [
    Field.new(name: 'name', type: Field::TEXT_FIELD, display_name_en: 'Name'),
    Field.new(name: 'age', type: Field::NUMERIC_FIELD, display_name_en: 'Age'),
    Field.new(name: 'sex', type: Field::SELECT_BOX, display_name_en: 'Sex'),
    Field.new(name: 'protection_concerns', type: Field::SELECT_BOX, multi_select: true, display_name_en: 'P'),
    Field.new(name: 'registration_date', type: Field::DATE_FIELD, display_name_en: 'A'),
    Field.new(name: 'record_state', type: Field::TICK_BOX, display_name_en: 'State'),
    Field.new(name: 'status', type: Field::SELECT_BOX, display_name_en: 'Status'),
    Field.new(
      name: 'family_details',
      display_name_en: 'A',
      type: Field::SUBFORM,
      subform: FormSection.new(
        fields: [
          Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
          Field.new(name: 'relation_type', type: Field::SELECT_BOX),
          Field.new(name: 'age', type: Field::NUMERIC_FIELD)
        ]
      )
    ),
    Field.new(name: 'description', type: Field::TEXT_AREA, display_name_en: 'Current Address', visible: false),
    Field.new(name: 'incident_date', type: Field::DATE_FIELD, display_name_en: 'A'),
    Field.new(name: 'date_of_birth', type: Field::DATE_FIELD, display_name_en: 'A'),
    Field.new(name: 'inquiry_date', type: Field::DATE_FIELD, display_name_en: 'A'),
    Field.new(name: 'relation_name', type: Field::TEXT_FIELD, display_name_en: 'Name'),
    Field.new(name: 'relation', type: Field::SELECT_BOX, display_name_en: 'Name'),
    Field.new(name: 'national_id_no', type: Field::TEXT_FIELD, display_name_en: 'A'),
    Field.new(
      name: 'tracing_request_subform_section',
      display_name_en: 'A',
      type: Field::SUBFORM,
      subform: FormSection.new(
        fields: [
          Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
          Field.new(name: 'relation_type', type: Field::SELECT_BOX)
        ]
      )
    )
  ].freeze

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
    COMMON_PERMITTED_FIELDS.map(&:name)
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
    if opts[:role].present?
      user.role = opts[:role]
    else
      user.stub(:role).and_return(fake_role(opts))
    end
    user
  end

  def permit_fields(opts = {})
    permitted_fields = opts[:permitted_fields] || COMMON_PERMITTED_FIELDS
    permitted_field_names = opts[:permitted_field_names] || common_permitted_field_names
    allow_any_instance_of(PermittedFormFieldsService).to(
      receive(:permitted_field_names).and_return(permitted_field_names)
    )
    allow_any_instance_of(PermittedFormFieldsService).to(
      receive(:permitted_fields).and_return(permitted_fields)
    )
  end

  def login_for_test(opts = {})
    permit_fields(opts)
    sign_in(fake_user(opts))
  end
end
