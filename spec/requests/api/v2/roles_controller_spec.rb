# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::RolesController, type: :request do
  before :each do
    clean_data(Role, FormSection, PrimeroProgram, PrimeroModule)
    program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )
    @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
    @form_section_b = FormSection.create!(unique_id: 'C', name: 'C', parent_form: 'child', form_group_id: 'k')
    @cp_a = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-a',
      name: 'CPA',
      description: 'Child Protection A',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [@form_section_a]
    )
    @cp_b = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-b',
      name: 'CPB',
      description: 'Child Protection B',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: [@form_section_b]
    )
    @permissions_test = [
      Permission.new(
        resource: Permission::ROLE,
        actions: [
          Permission::EXPORT_PDF,
          Permission::CREATE
        ],
        role_ids: %w[
          role-cp-case-worker
          role-cp-manager
        ]
      ),
      Permission.new(
        resource: Permission::USER,
        actions: [
          Permission::READ,
          Permission::WRITE,
          Permission::CREATE
        ]
      )
    ]
    @role_a = Role.new(
      unique_id: 'role_test_01',
      name: 'name_test_01',
      description: 'description_test_01',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: @permissions_test,
      form_sections: [@form_section_a],
      modules: [@cp_a]
    )
    @role_b = Role.new(
      unique_id: 'role_test_02',
      name: 'name_test_02',
      description: 'description_test_02',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: @permissions_test,
      form_sections: [@form_section_a],
      modules: [@cp_b]
    )
    @role_c = Role.new(
      unique_id: 'role_test_03',
      name: 'name_test_03',
      description: 'description_test_03',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: @permissions_test,
      form_sections: [@form_section_a],
      modules: [@cp_a]
    )
    @role_a.save!
    @role_b.save!
    @role_c.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/roles' do
    it 'list the roles' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/roles'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].first['name']).to eq('name_test_01')
      expect(json['data'].first['module_unique_ids'].first).to eq(@cp_a.unique_id)
      expect(json['data'].first['permissions']).to eq(Permission::PermissionSerializer.dump(@role_a.permissions))
      expect(json['data'].first['form_section_unique_ids'].first).to eq(@form_section_a.unique_id)
    end

    it 'list of the first 100 roles per page' do
      (1..100).each do |index|
        Role.create!(
          unique_id: "role_loop_test_#{index}",
          name: "role_loop_test_#{index}",
          description: "descriptionrole_loop_test_#{index}",
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          permissions: @permissions_test,
          form_sections: [@form_section_a]
        )
      end
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/roles'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(100)
      expect(Role.count).to eq(103)
    end

    it 'list the roles with page and per' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/roles?per=2&page=2'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'].first['unique_id']).to eq(@role_c.unique_id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/roles'
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'GET /api/v2/roles/:id' do
    it 'fetches the correct role with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/roles/#{@role_b.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq('name_test_02')
      expect(json['data']['module_unique_ids'].first).to eq(@cp_b.unique_id)
      expect(json['data']['permissions']).to eq(Permission::PermissionSerializer.dump(@role_b.permissions))
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/roles/#{@role_b.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_b.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/roles/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end

    it 'returns 403 if a user is not authorized to see a specific role' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::READ], role_ids: @role_a.unique_id)
        ]
      )

      get "/api/v2/roles/#{@role_b.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_b.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'POST /api/v2/roles' do
    it 'creates a new role and returns 200 and json' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'role-cp-administrator-00',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          module_unique_ids: [@cp_a.unique_id, @cp_b.unique_id],
          form_section_unique_ids: %w[A C],
          permissions: {
            agency: %w[
              read
              write
            ],
            role: %w[
              read
              write
            ],
            objects: {
              agency: %w[
                role-cp-case-worker
                id_2
              ],
              role: %w[
                role-cp-case-worker
                id_2
              ]
            }
          }
        }
      }

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq(params[:data][:name])
      expect(json['data']['form_section_unique_ids']).to eq(params[:data][:form_section_unique_ids])
      expect(json['data']['permissions']).to eq(params[:data][:permissions].deep_stringify_keys)
    end

    it 'Error 409 same uniq_id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'role_test_01',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          permissions: {
            agency: %w[
              read
              write
            ],
            role: %w[
              read
              write
            ],
            objects: {
              agency: %w[
                role-cp-case-worker
                id_2
              ],
              role: %w[
                role-cp-case-worker
                id_2
              ]
            }
          }
        }
      }

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Conflict: A record with this id already exists')
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
    end

    it 'Error 422 save without permissions' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'role-cp-administrator-00',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true
        }
      }

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq(['errors.models.role.permission_presence'])
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'PATCH /api/v2/roles/:id' do
    it 'updates an existing role with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @role_a.id,
          unique_id: 'role_test_01',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          form_section_unique_ids: %w[C],
          module_unique_ids: [@cp_b.unique_id],
          permissions: {
            agency: %w[
              read
              delete
            ],
            role: %w[
              delete
              read
            ],
            objects: {
              agency: %w[
                test_update_agency_00
                test_update_agency_01
              ],
              role: %w[
                test_update_role_01
                test_update_role_02
              ]
            }
          }
        }
      }

      patch "/api/v2/roles/#{@role_a.id}", params: params
      expect(response).to have_http_status(200)
      expect(json).to eq(params.deep_stringify_keys)
    end

    it 'updates an non-existing role' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch '/api/v2/roles/thisdoesntexist', params: params
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch "/api/v2/roles/#{@role_a.id}", params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns 403 if a user is not authorized to update a specific role' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::READ], role_ids: @role_a.unique_id)
        ]
      )
      params = {
        data: {
          unique_id: 'other-id',
          permissions: { agency: %w[read write], objects: { agency: ['manage'] } }
        }
      }

      patch "/api/v2/roles/#{@role_b.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_b.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/roles/:id' do
    it 'successfully deletes a role with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/roles/#{@role_a.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@role_a.id)
      expect(Role.find_by(id: @role_a.id)).to be nil
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/roles/#{@role_a.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to delete a role with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )

      delete '/api/v2/roles/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end
  end

  after :each do
    clean_data(Role, FormSection, PrimeroProgram, PrimeroModule)
  end
end
