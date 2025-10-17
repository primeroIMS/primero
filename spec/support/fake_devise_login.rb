# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Helpers for request specs that require a logged in user.
module FakeDeviseLogin
  FAMILY_DETAILS_FIELDS = [
    Field.new(name: 'relation_name', type: Field::TEXT_FIELD),
    Field.new(name: 'relation', type: Field::SELECT_BOX),
    Field.new(name: 'relation_type', type: Field::SELECT_BOX),
    Field.new(name: 'relation_age', type: Field::NUMERIC_FIELD),
    Field.new(name: 'relation_is_caregiver', type: Field::TICK_BOX)
  ].freeze

  COMMON_PERMITTED_FIELDS = [
    Field.new(name: 'name', type: Field::TEXT_FIELD, display_name_en: 'Name'),
    Field.new(name: 'age', type: Field::NUMERIC_FIELD, display_name_en: 'Age'),
    Field.new(name: 'sex', type: Field::SELECT_BOX, display_name_en: 'Sex'),
    Field.new(name: 'protection_concerns', type: Field::SELECT_BOX, multi_select: true, display_name_en: 'P'),
    Field.new(name: 'registration_date', type: Field::DATE_FIELD, display_name_en: 'A'),
    Field.new(name: 'record_state', type: Field::TICK_BOX, display_name_en: 'State'),
    Field.new(name: 'status', type: Field::SELECT_BOX, display_name_en: 'Status'),
    Field.new(
      name: 'family_details_section',
      display_name_en: 'A',
      type: Field::SUBFORM,
      subform: FormSection.new(fields: FAMILY_DETAILS_FIELDS)
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
    ),
    Field.new(name: 'registry_type', type: Field::TEXT_FIELD, display_name_en: 'Registry Type'),
    Field.new(name: 'family_number', type: Field::TEXT_FIELD, display_name_en: 'Family Number'),
    Field.new(name: 'family_notes', type: Field::TEXT_FIELD, display_name_en: 'Family Notes'),
    Field.new(name: 'family_size', type: Field::NUMERIC_FIELD, display_name_en: 'Family Size'),
    Field.new(
      name: 'family_members',
      display_name_en: 'Family Members',
      type: Field::SUBFORM,
      subform: FormSection.new(fields: FAMILY_DETAILS_FIELDS)
    )
  ].freeze

  SERVICE_FIELDS = [
    Field.new(
      name: 'services_section',
      display_name_en: 'A',
      type: Field::SUBFORM,
      subform: FormSection.new(
        unique_id: 'services_section', parent_form: 'case', name_en: 'services_section', is_nested: true,
        fields: [
          Field.new(name: 'service_type', type: Field::TEXT_FIELD, display_name_en: 'A'),
          Field.new(name: 'separator3', type: Field::SEPARATOR, display_name_en: 'A')
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

  def permission_registry
    @permission_registry ||= Permission.new(
      resource: Permission::REGISTRY_RECORD,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  def permission_family
    @permission_family ||= Permission.new(
      resource: Permission::FAMILY,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
  end

  def permission_flag_record
    actions = [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::FLAG]
    @permission_flag_record = [
      Permission.new(resource: Permission::CASE, actions:),
      Permission.new(resource: Permission::TRACING_REQUEST, actions:),
      Permission.new(resource: Permission::INCIDENT, actions:)
    ]
  end

  def common_permitted_field_names
    COMMON_PERMITTED_FIELDS.map(&:name)
  end

  def permissions
    [
      permission_case, permission_incident, permission_tracing_request, permission_registry, permission_family
    ]
  end

  def fake_role(opts = {})
    role_permissions = opts[:permissions] || permissions
    group_permission = opts[:group_permission] || Permission::ALL
    role = Role.new(
      permissions: role_permissions,
      group_permission:,
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
    user = User.new(user_name:, user_group_ids:, agency_id:)
    stub_role(user, opts)
    stub_user_group_unique_ids(user, opts)
    user.id = opts[:id]
    user
  end

  def stub_role(user, opts = {})
    if opts[:role].present?
      user.role = opts[:role]
    else
      user.stub(:role).and_return(fake_role(opts))
    end
  end

  def stub_user_group_unique_ids(user, opts = {})
    return unless opts[:user_group_unique_ids].present?

    user.stub(:user_group_unique_ids).and_return(opts[:user_group_unique_ids])
  end

  def permit_fields(user, opts = {})
    permitted_fields = opts[:permitted_fields] || COMMON_PERMITTED_FIELDS
    permitted_fields += SERVICE_FIELDS if user&.role&.permits?('case', Permission::SERVICES_SECTION_FROM_CASE)
    permitted_field_names = opts[:permitted_field_names] || permitted_fields.map(&:name)
    allow_any_instance_of(PermittedFormFieldsService).to(
      receive(:permitted_field_names).and_return(permitted_field_names)
    )
    allow_any_instance_of(PermittedFormFieldsService).to(
      receive(:permitted_fields).and_return(permitted_fields)
    )
  end

  def login_for_test(opts = {})
    user = fake_user(opts)
    permit_fields(user, opts)
    sign_in(user)
  end
end
