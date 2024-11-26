# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe PermittedFieldService, search: true do
  let(:cp_module) do
    PrimeroModule.create!(
      primero_program: PrimeroProgram.first,
      name: 'CP Module',
      unique_id: PrimeroModule::CP,
      associated_record_types: %w[case],
      form_sections: [form]
    )
  end
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

  let(:case_risk_dashboard_role) do
    Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(resource: Permission::DASHBOARD, actions: [Permission::DASH_CASE_RISK])
      ]
    )
  end

  let(:shared_with_other_dashboard_role) do
    Role.new_with_properties(
      name: 'Test Role 2',
      unique_id: 'test-role-2',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(resource: Permission::DASHBOARD, actions: [Permission::DASH_SHARED_WITH_OTHERS])
      ]
    )
  end

  let(:shared_from_my_team_dashboard_role) do
    Role.new_with_properties(
      name: 'Test Role 3',
      unique_id: 'test-role-3',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(resource: Permission::DASHBOARD, actions: [Permission::DASH_SHARED_FROM_MY_TEAM])
      ]
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
      role:,
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

  let(:user_with_risk_level) do
    User.create!(
      full_name: 'User With Risk Level',
      user_name: 'user_with_risk_level',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'test_user_3@localhost.com',
      agency_id: agency.id,
      role: case_risk_dashboard_role,
      services: ['Test type']
    )
  end

  let(:user_with_shared_with_others) do
    User.create!(
      full_name: 'User With Shared With Others',
      user_name: 'user_with_shared_with_others',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'user_with_shared_with_others@localhost.com',
      agency_id: agency.id,
      role: shared_with_other_dashboard_role,
      services: ['Test type']
    )
  end

  let(:user_with_shared_from_my_team) do
    User.create!(
      full_name: 'User With Shared From My Team',
      user_name: 'user_with_shared_from_my_team',
      password: 'a12345632',
      password_confirmation: 'a12345632',
      email: 'user_with_shared_from_my_team@localhost.com',
      agency_id: agency.id,
      role: shared_from_my_team_dashboard_role,
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
    clean_data(PrimeroModule, PrimeroProgram, User, Agency, Role, FormSection, Field, SystemSettings)
    system_settings
    cp_module
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
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names('primeromodule-cp')

    expect(permitted_field_names.include?(field.name)).to be true
  end

  it 'returns should include fields for filters' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names

    expect((%w[sex age registration_date location_current] - permitted_field_names).empty?).to be true
  end

  it 'returns the permitted fields for id_search = true' do
    permitted_field_names = PermittedFieldService.new(
      user, Child, nil, { action_name: nil, id_search: true }
    ).permitted_field_names

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

  it 'does not return id when is an update' do
    permitted_field_names = PermittedFieldService.new(user, Child).permitted_field_names(PrimeroModule::CP, false, true)

    expect(permitted_field_names.include?('id')).to be false
  end

  after(:each) { clean_data(User, Agency, Role, FormSection, Field) }

  it 'returns the reporting_location field permitted' do
    permitted_reporting_location_field = PermittedFieldService.new(user, Child).permitted_reporting_location_field.first
    reporting_location_config = system_settings.reporting_location_config

    expect(permitted_reporting_location_field).to eq(reporting_location_config.field_key)
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
    permitted_reporting_location_field = PermittedFieldService.new(
      user_with_reporting_location, Child
    ).permitted_reporting_location_field.first
    reporting_location_config = system_settings.reporting_location_config

    expect(permitted_reporting_location_field).to eq(reporting_location_config.field_key)
  end

  it 'return the risk_level field permitted for a role with a case_risk permission in dashboard' do
    permitted_field_names = PermittedFieldService.new(user_with_risk_level, Child).permitted_field_names

    expect(permitted_field_names).to include('risk_level')
  end

  it 'returns the transfer_status field permitted for a role with a shared_with_other permission in dashboard' do
    permitted_field_names = PermittedFieldService.new(user_with_shared_with_others, Child).permitted_field_names

    expect(permitted_field_names).to include('transfer_status')
  end

  it 'returns the transfer_status field permitted for a role with a shared_from_my_team permission in dashboard' do
    permitted_field_names = PermittedFieldService.new(user_with_shared_from_my_team, Child).permitted_field_names

    expect(permitted_field_names).to include('transfer_status')
  end

  describe 'MRM - Vioaltions forms and fields' do
    let(:mrm_form) do
      FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'incident', form_group_id: 'm', fields: [mrm_field])
    end
    let(:mrm_module) do
      PrimeroModule.create!(
        primero_program: PrimeroProgram.first,
        name: 'MRM Module',
        unique_id: PrimeroModule::MRM,
        associated_record_types: ['incident'],
        form_sections: [mrm_form],
        roles: [mrm_role]
      )
    end
    let(:mrm_field) do
      Field.create!(
        name: 'mrm_field',
        display_name: 'mrm field',
        type: Field::TALLY_FIELD
      )
    end
    let(:mrm_role) do
      Role.new_with_properties(
        name: 'Test Role 1',
        unique_id: 'test-role-1',
        group_permission: Permission::SELF,
        permissions: [
          Permission.new(
            resource: Permission::INCIDENT,
            actions: [Permission::READ, Permission::CREATE, Permission::WRITE]
          )
        ],
        form_section_read_write: { form.unique_id => 'rw' }
      )
    end
    let(:mrm_agency) do
      Agency.create!(
        name: 'Test Agency',
        agency_code: 'TA',
        services: ['Test type']
      )
    end
    let(:mrm_user) do
      User.create!(
        full_name: 'Test User 2',
        user_name: 'test_user_2',
        password: 'a12345632',
        password_confirmation: 'a12345632',
        email: 'test_user_2@localhost.com',
        agency_id: mrm_agency.id,
        role: mrm_role
      )
    end
    before(:each) do
      clean_data(PrimeroModule, User, Agency, Role, FormSection, Field, SystemSettings)
      mrm_form
      mrm_role.save!
      mrm_module
      mrm_user
    end
    it 'returns Violations fields if user has permission' do
      permitted_field_names = PermittedFieldService.new(mrm_user, Incident).permitted_field_names(PrimeroModule::MRM)
      expect(permitted_field_names.include?('mrm_field')).to be true
    end
  end

  describe 'Permitted Fields for Multiple Roles' do
    before(:each) do
      clean_data(PrimeroModule, User, Agency, Role, FormSection, Field, SystemSettings)
      primero_module_cp
      form_a
      form_b
      role_a.save!
      role_b.save!
      test_user
    end

    let(:form_a) do
      FormSection.create!(
        unique_id: 'a', name: 'A', parent_form: 'case', form_group_id: 'm', fields: [
          Field.create!(name: 'field_a', display_name: 'A1', type: Field::TEXT_FIELD)
        ]
      )
    end
    let(:form_b) do
      FormSection.create!(
        unique_id: 'b', name: 'B', parent_form: 'case', form_group_id: 'm', fields: [
          Field.create!(name: 'field_b', display_name: 'b1', type: Field::TEXT_FIELD)
        ]
      )
    end
    let(:primero_module_cp) do
      PrimeroModule.create!(
        primero_program: PrimeroProgram.first,
        name: 'PrimeroModule',
        unique_id: PrimeroModule::CP,
        associated_record_types: ['case'],
        form_sections: [form_a, form_b]
      )
    end
    let(:role_a) do
      Role.new_with_properties(
        name: 'Test Role A',
        unique_id: 'test-role-a',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::CREATE, Permission::WRITE]
          )
        ],
        form_section_read_write: { form_a.unique_id => 'rw' }
      )
    end
    let(:role_b) do
      Role.new_with_properties(
        name: 'Test Role B',
        unique_id: 'test-role-b',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::CREATE, Permission::WRITE]
          )
        ],
        form_section_read_write: { form_b.unique_id => 'r' }
      )
    end
    let(:test_user) do
      user = User.new(
        full_name: 'Test User 2',
        user_name: 'test_user_2',
        password: 'a12345632',
        password_confirmation: 'a12345632',
        email: 'test_user_2@localhost.com',
        role: role_a
      )
      user.save!(validate: false)
      user
    end

    it 'returns the permitted fields for the roles' do
      permitted_field_names = PermittedFieldService.new(test_user, Child).permitted_field_names(
        PrimeroModule::CP, false, false, [role_a, role_b]
      )

      expect(permitted_field_names).to include('field_a', 'field_b')
    end
  end

  describe 'permitted_attachment_fields' do
    before(:each) do
      clean_data(PrimeroModule, User, Agency, Role, FormSection, Field, SystemSettings)
    end

    let(:primero_module_cp) do
      PrimeroModule.create!(
        primero_program: PrimeroProgram.first,
        name: 'PrimeroModule',
        unique_id: PrimeroModule::CP,
        associated_record_types: ['case'],
        form_sections: []
      )
    end

    let(:permitted_preview_role) do
      Role.new_with_properties(
        name: 'Permitted Attachments',
        unique_id: 'permitted_attachment_fields',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::SEARCH_OWNED_BY_OTHERS, Permission::DISPLAY_VIEW_PAGE]
          )
        ]
      )
    end

    let(:permitted_view_photo_role) do
      Role.new_with_properties(
        name: 'Permitted View Photo',
        unique_id: 'permitted_view_photo_role',
        group_permission: Permission::SELF,
        modules: [primero_module_cp],
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::VIEW_PHOTO]
          )
        ]
      )
    end

    let(:preview_user) do
      user = User.new(
        full_name: 'Preview User',
        user_name: 'preview_user',
        password: 'a12345632',
        password_confirmation: 'a12345632',
        email: 'preview_user@localhost.com',
        role: permitted_preview_role
      )
      user.save(validate: false)
      user
    end

    it 'returns the audio/photos fields' do
      permitted_field_names = PermittedFieldService.new(preview_user, Child).permitted_field_names

      expect(permitted_field_names).to include('photos', 'recorded_audio')
    end

    it 'returns the photo field' do
      preview_user.role = permitted_view_photo_role
      preview_user.save(validate: false)

      permitted_field_names = PermittedFieldService.new(preview_user, Child).permitted_field_names

      expect(permitted_field_names).to include('photo')
    end
  end

  after(:each) { clean_data(PrimeroProgram, User, Agency, Role, FormSection, Field, SystemSettings) }
end
