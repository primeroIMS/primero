# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::UsersController, type: :request do
  before :each do
    clean_data(
      FormSection, User, Role, PrimeroModule, Agency, PrimeroProgram, IdentityProvider, CodeOfConduct, UserGroup, AuditLog
    )

    SystemSettings.stub(:current).and_return(
      SystemSettings.new(
        primary_age_range: 'primero',
        age_ranges: {
          primero: [0..5, 6..11, 12..17, 18..AgeRange::MAX],
          unhcr: [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
        }
      )
    )

    @program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )

    @form1 = FormSection.create!(name: 'form1')
    @form2 = FormSection.create!(name: 'form2')

    @cp = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [@form1]
    )

    @gbv = PrimeroModule.create!(
      unique_id: 'primeromodule-gbv',
      name: 'GBV',
      description: 'Gender Based Violence',
      associated_record_types: %w[case incident],
      primero_program: @program,
      form_sections: [@form2]
    )

    @role_manage_user = Role.new_with_properties(
      name: 'Role Manage User',
      unique_id: 'role-manage-user',
      permissions: [
        Permission.new(
          resource: Permission::USER,
          actions: [Permission::MANAGE]
        )
      ],
      module_unique_ids: [@cp.unique_id],
      form_section_read_write: { @form1.unique_id => 'r', @form2.unique_id => 'r' }
    )
    @role_manage_user.save!

    @super_user_permissions = [
      Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::REPORT, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::INCIDENT, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE])
    ]

    @admin_user_permissions = [
      Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
      Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE])
    ]

    @super_role = Role.new_with_properties(
      name: 'Super Role',
      unique_id: 'super-role',
      permissions: @super_user_permissions,
      group_permission: Permission::ALL,
      module_unique_ids: [@cp.unique_id],
      form_section_read_write: { @form1.unique_id => 'r', @form2.unique_id => 'r' }
    )
    @super_role.save!

    @admin_role = Role.new_with_properties(
      name: 'Admin Role',
      unique_id: 'admin-role',
      permissions: @admin_user_permissions,
      group_permission: Permission::ADMIN_ONLY,
      module_unique_ids: [@cp.unique_id],
      form_section_read_write: { @form1.unique_id => 'r', @form2.unique_id => 'r' }
    )
    @admin_role.save!

    @role = Role.new_with_properties(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        ),
        Permission.new(
          resource: Permission::USER,
          actions: [Permission::READ]
        )
      ],
      group_permission: Permission::SELF,
      module_unique_ids: [@cp.unique_id],
      form_section_read_write: { @form1.unique_id => 'r', @form2.unique_id => 'r' }
    )
    @role.save!
    @agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1', logo_icon: logo,
                               logo_full: logo)
    @agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2')

    @user_group_a = UserGroup.create!(unique_id: 'user-group-1', name: 'user group 1')
    @user_group_b = UserGroup.create!(unique_id: 'user-group-2', name: 'user group 2')

    @identity_provider_a = IdentityProvider.create!(
      name: 'primero_1',
      unique_id: 'primeroims_1',
      provider_type: 'b2c_1',
      configuration: {
        client_id: '123_1',
        issuer: 'https://primeroims_1.org',
        verification_url: 'https://primeroims_1.org/verify'
      }
    )

    @identity_provider_b = IdentityProvider.create!(
      name: 'primero_2',
      unique_id: 'primeroims_2',
      provider_type: 'b2c_2',
      configuration: {
        client_id: '123_2',
        issuer: 'https://primeroims_2.org',
        verification_url: 'https://primeroims_2.org/verify'
      }
    )

    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: @agency_a.id,
      role: @role,
      identity_provider_id: @identity_provider_a.id,
      agency_office: 'my office 1',
      locale: 'en',
      services: ['service1'],
      user_groups: [@user_group_a]
    )

    @user_b = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: 'test_user_2@localhost.com',
      agency_id: @agency_a.id,
      role: @role,
      identity_provider_id: @identity_provider_a.id
    )

    @user_c = User.create!(
      full_name: 'Test User 3',
      user_name: 'test_user_3',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'test@localhost.com',
      agency_id: @agency_b.id,
      user_groups: [@user_group_b],
      role: @role
    )

    @user_d = User.create!(
      full_name: 'Test User 4',
      user_name: 'test_user_4',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'test_4@localhost.com',
      agency_id: @agency_b.id,
      role: @role_manage_user,
      identity_provider_id: @identity_provider_a.id
    )

    @admin_user_a = User.create!(
      full_name: 'Admin User A',
      user_name: 'admin_user_a',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'adminusera@localhost.com',
      agency_id: @agency_a.id,
      role: @admin_role
    )

    @admin_user_b = User.create!(
      full_name: 'Admin User B',
      user_name: 'admin_user_b',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'adminuserb@localhost.com',
      agency_id: @agency_a.id,
      user_groups: [@user_group_b],
      role: @admin_role
    )

    @super_user = User.create!(
      full_name: 'Super user',
      user_name: 'super_user',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: 'superuser@localhost.com',
      agency_id: @agency_a.id,
      role: @super_role
    )

    @code_of_conduct = CodeOfConduct.create!(
      title: 'Code of conduct test',
      content: 'Some content',
      created_by: 'test_user',
      created_on: DateTime.now
    )
  end

  let!(:audit_log) do
    AuditLog.create(
      user: @user_a, record_type: 'User', action: 'login', timestamp: DateTime.new(2015, 10, 23, 14, 54, 55)
    )
  end
  let!(:audit_log2) do
    AuditLog.create(
      user: @user_a, action: 'show', record_type: 'Child', timestamp: DateTime.new(2015, 10, 23, 14, 54, 55)
    )
  end
  let!(:audit_log3) do
    AuditLog.create(
      user: @user_a, action: 'update', record_type: 'Child', timestamp: DateTime.new(2015, 10, 23, 14, 54, 55)
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/users' do
    context 'when current_user is a super user' do
      it 'list the users' do
        login_for_test(permissions: @super_user_permissions)

        get '/api/v2/users'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(7)
        expect(json['data'].map { |user| user['identity_provider_unique_id'] }.compact).to eq(
          [@identity_provider_a.unique_id, @identity_provider_a.unique_id, @identity_provider_a.unique_id]
        )
      end

      it 'list the users of a specific agency' do
        login_for_test(permissions: @super_user_permissions)

        get "/api/v2/users?agency=#{@agency_a.id}"

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(5)
      end

      it 'return modules, agencies, permissions, filters, headers for the extended version' do
        login_for_test(permissions: @super_user_permissions)

        get '/api/v2/users?extended=true'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(7)
        expect(json['data'][0]['agency_id']).to eq(@agency_a.id)
        expect(json['data'][0]['filters']).not_to be_nil
        expect(json['data'][0]['permissions']).not_to be_nil
        expect(json['data'][0]['list_headers']).not_to be_nil
        expect(json['data'][0]['permitted_form_unique_ids']).not_to be_nil
        expect(json['data'][0]['permitted_form'].present?).to be_truthy
        expect(json['data'][0]['agency_logo_full']).not_to be_nil
        expect(json['data'][0]['agency_logo_icon']).not_to be_nil
        expect(json['data'][0]['agency_name']).to eq(@agency_a.name)
        expect(json['data'][0]['agency_unique_id']).to eq(@agency_a.unique_id)
        expect(json['metadata']['total_enabled']).to eq(7)
      end
    end

    context 'when current_user is admin' do
      it 'list the users who are not super users' do
        login_for_test(permissions: @admin_user_permissions, group_permission: Permission::ADMIN_ONLY)

        get '/api/v2/users'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(6)
        expect(json['data'].map { |user| user['user_name'] }).to match_array(
          %w[test_user_1 test_user_2 test_user_3 admin_user_a admin_user_b test_user_4]
        )
        expect(json['data'].map { |user| user['identity_provider_unique_id'] }.compact).to eq(
          [@identity_provider_a.unique_id, @identity_provider_a.unique_id, @identity_provider_a.unique_id]
        )
      end
    end

    context 'when current_user has agency_read permission' do
      it 'list non-admin users who are in the same agency of the current_user' do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::USER, actions: [Permission::AGENCY_READ, Permission::READ])
          ],
          agency_id: @agency_a.id
        )

        get '/api/v2/users'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(2)
        expect(json['data'].map { |user| user['user_name'] }).to match_array(%w[test_user_1 test_user_2])
        expect(json['data'].map { |user| user['identity_provider_unique_id'] }.compact).to eq(
          [@identity_provider_a.unique_id, @identity_provider_a.unique_id]
        )
        expect(json['metadata']['total_enabled']).to eq(7)
      end
    end

    context 'when current_user has group permission' do
      it 'list non-admin users who are in the same user group of the current_user' do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::USER, actions: [Permission::READ])
          ],
          group_permission: Permission::GROUP,
          user_group_ids: [@user_group_b.id]
        )

        get '/api/v2/users'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(1)
        expect(json['data'].map { |user| user['user_name'] }).to match_array(%w[test_user_3])
      end
    end

    context 'when current_user has self permission' do
      it 'list the current user only' do
        sign_in(@user_c)

        get '/api/v2/users'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(1)
        expect(json['data'].map { |user| user['user_name'] }).to match_array(%w[test_user_3])
      end
    end

    it 'refuses unauthorized access' do
      # TODO: This fails because of an error in ability.rb check that file.
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [])
        ],
        group_permission: Permission::SELF
      )

      get '/api/v2/users'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users')
    end

    it 'Searching by services and agency at the same time' do
      @user_a.update(services: ['test'])
      @role.update(
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::MANAGE, Permission::RECEIVE_REFERRAL]
          )
        ]
      )
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])
        ]
      )

      params = {
        record_type: 'case',
        record_module_id: @cp.unique_id,
        service: 'test',
        agency: @agency_a.unique_id
      }

      get('/api/v2/users/refer-to', params:)

      expect(response).to have_http_status(200)
      expect(json['data'][0]['id']).to eq(@user_a.id)
      expect(json['data'][0]['user_name']).to eq(@user_a.user_name)
    end

    it 'Searching by username or full_name' do
      login_for_test(permissions: @admin_user_permissions, group_permission: Permission::ADMIN_ONLY)

      params = {
        query: 'Admin'
      }

      get('/api/v2/users', params:)

      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(2)
      expect(json['data'].map { |uz| uz['id'] }).to match_array([@admin_user_a.id, @admin_user_b.id])
    end

    it 'Searching by last_access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])
        ]
      )

      params = { last_access: { 'from' => '2015-10-20T00:00:00Z', 'to' => '2015-10-25T23:59:59Z' },
                 disabled: { '0' => 'false' } }

      get('/api/v2/users', params:)

      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(1)
      expect(json['data'][0]['id']).to eq(@user_a.id)
    end
  end

  describe 'GET /api/v2/users/:id' do
    it 'fetches the correct user with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )
      get "/api/v2/users/#{@user_a.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_a.id)
      expect(json['data']['identity_provider_unique_id']).to eq(@identity_provider_a.unique_id)
      expect(json['data']['user_groups'].size).to eq(1)
      expect(json['data']['last_access']).to eq(audit_log.timestamp.iso8601(3))
      expect(json['data']['last_case_viewed']).to eq(audit_log2.timestamp.iso8601(3))
      expect(json['data']['last_case_updated']).to eq(audit_log3.timestamp.iso8601(3))
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test
      get "/api/v2/users/#{@user_a.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_a.id}")
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test
      get '/api/v2/users/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/users' do
    let(:params) do
      {
        data: {
          full_name: 'Test User API',
          user_name: 'test_user_api',
          code: 'test/code',
          email: 'test_user_api@localhost.com',
          agency_id: @agency_a.id,
          role_unique_id: @role.unique_id,
          password_confirmation: 'a12345678',
          password: 'a12345678',
          user_group_unique_ids: ['user-group-1'],
          identity_provider_unique_id: @identity_provider_a.unique_id,
          location: 'TEST_LOCATION',
          phone: '867-5309',
          agency_office: 'TEST OFFICE'
        }
      }
    end

    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
        ]
      )

      post '/api/v2/users', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(json['data']['user_name']).to eq(params[:data][:user_name])
      expect(json['data']['agency_id']).to eq(params[:data][:agency_id])
      expect(json['data']['role_unique_id']).to eq(params[:data][:role_unique_id])
      expect(json['data']['user_group_unique_ids']).to eq(params[:data][:user_group_unique_ids])
      expect(User.find_by(id: json['data']['id'])).not_to be_nil
      expect(json['data']['identity_provider_unique_id']).to eq(@identity_provider_a.unique_id)
      expect(json['metadata']['total_enabled']).to eq(8)
    end

    it 'filters sensitive information from logs' do
      allow(Rails.logger).to receive(:debug).and_return(nil)

      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
        ]
      )

      post '/api/v2/users', params:, as: :json

      expect(Rails.logger).to have_received(:debug).with(/\["email", "\[FILTERED\]"\]/).twice

      %w[encrypted_password location phone code full_name agency_office].each do |fp|
        expect(Rails.logger).to have_received(:debug).with(/\["#{fp}", "\[FILTERED\]"\]/)
      end
    end

    describe 'empty response' do
      let(:json) { nil }

      it 'creates a new record with 204 and returns no JSON if the client generated the id' do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
          ]
        )
        id = (rand * 1000).to_i
        params = {
          data: {
            id:,
            full_name: 'Test User API 2',
            user_name: 'test_user_api_2',
            code: 'test/code',
            email: 'test_user_api@localhost.com',
            agency_id: @agency_a.id,
            role_unique_id: @role.unique_id,
            password_confirmation: 'a12345678',
            password: 'a12345678'
          }
        }

        post '/api/v2/users', params:, as: :json

        expect(response).to have_http_status(204)
        expect(User.find_by(id:)).not_to be_nil
      end
    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test

      params = {
        data: {
          full_name: 'Test User API',
          user_name: 'test_user_api',
          code: 'test/code',
          email: 'test_user_api@localhost.com',
          agency_id: @agency_a.id,
          role_unique_id: @role.id,
          password_confirmation: 'a12345678',
          password: 'a12345678'
        }
      }

      post('/api/v2/users', params:)

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users')
    end

    it 'returns a 409 if record already exists' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
        ]
      )
      params = {
        data: {
          id: @user_a.id,
          full_name: 'Test User 5',
          user_name: 'test_user_5',
          code: 'test/code',
          email: 'test_user_5@localhost.com',
          agency_id: @agency_a.id,
          role_unique_id: @role.unique_id,
          password_confirmation: 'a12345678',
          password: 'a12345678'
        }
      }

      post '/api/v2/users', params:, as: :json

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
        ]
      )
      params = {
        data: {
          id: @user_a.id,
          full_name: 'Test User 5',
          user_name: 'test_user_5',
          code: 'test/code',
          email: 'test_user_5@localhost.com',
          agency_id: @agency_a.id,
          role_unique_id: @role.unique_id,
          password: 'bad pw',
          password_confirmation: 'pad pw confirmation'
        }
      }
      post '/api/v2/users', params:, as: :json

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(2)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users')
      expect(json['errors'].map { |e| e['detail'] }).to contain_exactly('password', 'password_confirmation')
    end

    it 'create a new record with send_mail false' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::CREATE])
        ]
      )
      params = {
        data: {
          full_name: 'Random User',
          user_name: 'random_user',
          password: 'b12345678',
          password_confirmation: 'b12345678',
          email: 'random_user@localhost.com',
          agency_id: @agency_a.id,
          role_unique_id: @role.unique_id,
          send_mail: false
        }
      }
      post '/api/v2/users', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['user_name']).to eq(params[:data][:user_name])
      expect(json['data']['send_mail']).to eq(params[:data][:send_mail])
    end
  end

  describe 'PATCH /api/v2/users/:id' do
    it 'updates an existing user with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )
      params = {
        data: {
          full_name: 'Updated User 1',
          user_group_unique_ids: ['user-group-1'],
          identity_provider_unique_id: @identity_provider_b.unique_id,
          agency_office: nil,
          services: %w[service1 service2]
        }
      }

      patch("/api/v2/users/#{@user_a.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_a.id)
      user1 = User.find_by(id: @user_a.id)
      expect(user1.full_name).to eq('Updated User 1')
      expect(user1.user_groups.map(&:unique_id)).to eq(params[:data][:user_group_unique_ids])
      expect(user1.agency_office).to be_nil
      expect(user1.services).to eq(%w[service1 service2])
      expect(user1.identity_provider.unique_id).to eq(@identity_provider_b.unique_id)
    end

    it 'keeps user signed in when password changed' do
      sign_in(@user_d)
      params = {
        data: {
          password: 'primer0!',
          password_confirmation: 'primer0!'
        }
      }
      patch("/api/v2/users/#{@user_d.id}", params:)
      expect(response).to have_http_status(200)
      get('/api/v2/roles')
      expect(response).to have_http_status(200)
      expect(controller.current_user).to eq(@user_d)
    end

    it 'does not change logged in user session when password changed on another user' do
      sign_in(@super_user)
      params = {
        data: {
          password: 'primer0!',
          password_confirmation: 'primer0!'
        }
      }
      patch("/api/v2/users/#{@user_c.id}", params:)
      expect(response).to have_http_status(200)
      get('/api/v2/roles')
      expect(response).to have_http_status(200)
      expect(controller.current_user).to eq(@super_user)
    end

    it "returns 403 if user isn't authorized to update users" do
      login_for_test
      params = {
        data: {
          full_name: 'Updated User 1'
        }
      }

      patch("/api/v2/users/#{@user_a.id}", params:)

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_a.id}")
    end

    it 'returns a 404 when trying to update a user with a non-existant id' do
      login_for_test

      params = {
        data: {
          full_name: 'Updated User 1'
        }
      }

      patch('/api/v2/users/thisdoesntexist', params:)

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/thisdoesntexist')
    end

    it 'returns a 422 if the user is invalid' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )
      params = {
        data: {
          email: '@localhost.com'
        }
      }

      patch("/api/v2/users/#{@user_a.id}", params:)

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_a.id}")
      expect(json['errors'][0]['detail']).to eq('email')
    end

    it 'does not change certain fields if target user is the current user' do
      sign_in(@user_d)

      user_name = 'test-user-changed-4'

      params = {
        data: {
          role_unique_id: 'test-role-1',
          identity_provider_unique_id: 'primeroims_2',
          agency_id: @agency_a.id,
          user_name:
        }
      }

      patch("/api/v2/users/#{@user_d.id}", params:)

      @user_d.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_d.id)
      expect(@user_d.role.unique_id).to eq(@role_manage_user.unique_id)
      expect(@user_d.agency.unique_id).to eq(@agency_b.unique_id)
      expect(@user_d.user_name).not_to eq(user_name)
      expect(@user_d.identity_provider.unique_id).to eq(@identity_provider_a.unique_id)
    end

    it 'user accept the code of conduct' do
      sign_in(@user_c)
      params = {
        data: {
          code_of_conduct_id: @code_of_conduct.id
        }
      }

      patch "/api/v2/users/#{@user_c.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['user_name']).to eq(@user_c.user_name)
      expect(json['data']).to have_key('code_of_conduct_accepted_on')
    end
  end

  describe 'DELETE /api/v2/users/:id' do
    it 'successfully deletes a user with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )

      delete "/api/v2/users/#{@user_a.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_a.id)
    end

    it "returns 403 if user isn't authorized to delete users" do
      login_for_test
      delete "/api/v2/users/#{@user_a.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_a.id}")
    end

    it 'returns a 404 when trying to delete a form with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::USER_GROUP, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE]),
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )

      delete '/api/v2/users/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/thisdoesntexist')
    end
  end

  after :each do
    clean_data(User, FormSection, Role, PrimeroModule, Agency, PrimeroProgram, UserGroup, CodeOfConduct)
  end
end
