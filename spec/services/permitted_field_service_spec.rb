# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService, search: true do
  let(:form) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
  let(:field) { Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form.id) }
  let(:role) do
    Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::INCIDENT_FROM_CASE]
        )
      ],
      form_section_read_write: { form.unique_id => 'rw' }
    )
  end
  let(:dashboard_role) do
    Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_APPROVALS_ASSESSMENT,
            Permission::DASH_APPROVALS_CASE_PLAN,
            Permission::DASH_APPROVALS_CLOSURE
          ]
        )
      ],
      form_section_read_write: { form.unique_id => 'rw' }
    )
  end
  let(:pending_dashboard_role) do
    Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(
          resource: Permission::DASHBOARD,
          actions: [
            Permission::DASH_APPROVALS_ASSESSMENT_PENDING,
            Permission::DASH_APPROVALS_CASE_PLAN_PENDING,
            Permission::DASH_APPROVALS_CLOSURE_PENDING
          ]
        )
      ],
      form_section_read_write: { form.unique_id => 'rw' }
    )
  end
  let(:agency) do
    Agency.create!(
      name: 'Test Agency',
      agency_code: 'TA',
      services: ['Test type']
    )
  end
  let(:user) do
    User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_1@localhost.com',
      agency_id: agency.id,
      role: role,
      services: ['Test type']
    )
  end

  let(:approvals_user) do
    User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_2@localhost.com',
      agency_id: agency.id,
      role: dashboard_role,
      services: ['Test type']
    )
  end

  let(:pending_approvals_user) do
    User.create!(
      full_name: 'Test User 3',
      user_name: 'test_user_3',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_3@localhost.com',
      agency_id: agency.id,
      role: pending_dashboard_role,
      services: ['Test type']
    )
  end

  let(:system_settings) do
    SystemSettings.create(
      default_locale: 'en',
      reporting_location_config: {
        field_key: 'owned_by_location',
        admin_level: 1,
        admin_level_map: {
          '0' => ['country'],
          '1' => ['region'],
          '2' => ['city']
        }
      }
    )
  end

  before(:each) do
    clean_data(Agency, Role, User, FormSection, Field, SystemSettings)
    system_settings
    form
    field
    role.save!
    agency
    user
  end

  it 'returns the incident_case_id if a user has the incident_from_case permission' do
    permitted_field_names = PermittedFieldService.new(user, Incident).permitted_field_names

    expect(permitted_field_names.include?('incident_case_id')).to be true
  end

  it 'returns the formsection permitted' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names

    expect(permitted_field_names.include?(field.name)).to be true
  end

  it 'returns should include fields for filters' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names

    expect((%w[sex age registration_date location_current] - permitted_field_names).empty?).to be true
  end


  it 'returns the permitted fields for id_search = true' do
    permitted_field_names = PermittedFieldService.new(user, Child, nil, true).permitted_field_names

    expect((PermittedFieldService::ID_SEARCH_FIELDS - permitted_field_names).empty?).to be true
  end

  it 'returns the approval field for the corresponding dashboard' do
    permitted_field_names = PermittedFieldService.new(approvals_user, Child).permitted_field_names
    approval_field_names = %w[approval_status_assessment approval_status_case_plan approval_status_closure]

    expect((approval_field_names - permitted_field_names).empty?).to be true
  end

  it 'returns the approval field for the corresponding pending dashboards' do
    permitted_field_names = PermittedFieldService.new(pending_approvals_user, Child).permitted_field_names
    approval_field_names = %w[approval_status_assessment approval_status_case_plan approval_status_closure]

    expect((approval_field_names - permitted_field_names).empty?).to be true
  end

  after(:each) { clean_data(Agency, Role, User, FormSection, Field) }

  it 'returns the reporting_location field permitted' do
    permitted_reporting_location_field = PermittedFieldService.new(user, Child).permitted_reporting_location_field.first
    reporting_location_config = system_settings.reporting_location_config

    expect(permitted_reporting_location_field).to eq(
      "#{reporting_location_config.field_key}#{reporting_location_config.admin_level}"
    )
  end

  it 'returns the reporting_location field permitted for a role with a reporting_location_level set' do
    role_with_reporting_location = Role.create!(
      name: 'Test Role 2',
      unique_id: 'test-role-2',
      reporting_location_level: 2,
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::INCIDENT_FROM_CASE]
        )
      ]
    )

    user_with_reporting_location = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user@localhost.com',
      agency_id: agency.id,
      role: role_with_reporting_location
    )
    permitted_reporting_location_field = PermittedFieldService.new(user_with_reporting_location, Child)
                                                              .permitted_reporting_location_field.first
    reporting_location_config = system_settings.reporting_location_config

    expect(permitted_reporting_location_field).to eq(
      "#{reporting_location_config.field_key}#{role_with_reporting_location.reporting_location_level}"
    )
  end
  after(:each) { clean_data(Agency, Role, User, FormSection, Field, SystemSettings) }
end
