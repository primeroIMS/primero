require 'rails_helper'

describe Api::V2::RolesController, type: :request do

  before :each do
    Role.destroy_all
    permissions_test = [
      Permission.new(
        resource: Permission::ROLE,
        actions: [
          Permission::EXPORT_PDF,
          Permission::CREATE
        ],
        role_ids: [
          'role-cp-case-worker',
          'role-cp-manager'
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
    @role_01 = Role.new({
      unique_id: 'role_test_01',
      name: 'name_test_01',
      description: 'description_test_01',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: permissions_test
    })
    @role_02 = Role.new({
      unique_id: 'role_test_02',
      name: 'name_test_02',
      description: 'description_test_02',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: permissions_test
    })
    @role_03 = Role.new({
      unique_id: 'role_test_03',
      name: 'name_test_03',
      description: 'description_test_03',
      group_permission: 'all',
      referral: false,
      transfer: false,
      is_manager: true,
      permissions: permissions_test
    })
    @role_01.save!
    @role_02.save!
    @role_03.save!

  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/roles' do
    it 'list the roles' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })

      get '/api/v2/roles'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].first['name']).to eq('name_test_01')
      expect(json['data'].first['permissions']).to eq(@role_01.permissions.map{|pr| pr.to_h})
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      get '/api/v2/roles'
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'GET /api/v2/roles/:id' do
    it 'fetches the correct role with code 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/roles/#{@role_02.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq('name_test_02')
      expect(json['data']['permissions']).to eq(@role_02.permissions.map{|pr| pr.to_h})
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/roles/#{@role_02.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_02.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })

      get '/api/v2/roles/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/roles' do
    it 'creates a new role and returns 200 and json' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })
      params = {
        data: {
          unique_id: 'role-cp-administrator-00',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          permissions: [
            {
              'resource' => 'case',
              'actions' => [
                'read',
                'write'
              ]
            }
          ]
        }
      }

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq(params[:data][:name])
      expect(json['data']['permissions']).to eq(params[:data][:permissions])
    end

    it 'Error 409 same uniq_id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })
      params = {
        data: {
          unique_id: 'role_test_01',
          name: 'CP Administrator 00',
          description: 'Administrator_description',
          group_permission: 'all',
          referral: false,
          transfer: false,
          is_manager: true,
          permissions: [
            {
              'resource' => 'case',
              'actions' => [
                'read',
                'write'
              ]
            }
          ]
        }
      }

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Conflict: A record with this id already exists')
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
    end

    it 'Error 422 save without permissions' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })
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
      expect(json['errors'].first['message']).to eq(['Please select at least one permission'])
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })
      params = {}

      post '/api/v2/roles', params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'PATCH /api/v2/roles/:id' do
    it 'updates an existing role with 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })
      params = {
        'data' => {
          'id' => @role_01.id,
          'unique_id' => 'role_test_01',
          'name' => 'CP Administrator 00',
          'description' => 'Administrator_description',
          'group_permission' => 'all',
          'referral' => false,
          'transfer' => false,
          'is_manager' => true,
          'permissions' => [
            {
              'resource' => 'case',
              'actions' => [
                'read',
                'write'
              ]
            }
          ]
        }
      }

      patch "/api/v2/roles/#{@role_01.id}", params: params
      expect(response).to have_http_status(200)
      expect(json).to eq(params)
    end

    it 'updates an non-existing role' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })
      params = {}

      patch '/api/v2/roles/thisdoesntexist', params: params
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })
      params = {}

      patch "/api/v2/roles/#{@role_01.id}", params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_01.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/roles/:id' do
    it 'successfully deletes a role with a code of 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })

      delete "/api/v2/roles/#{@role_01.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@role_01.id)
      expect(Role.find_by(id: @role_01.id)).to be nil
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      delete "/api/v2/roles/#{@role_01.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/roles/#{@role_01.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to delete a role with a non-existant id' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ]
      })

      delete '/api/v2/roles/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/roles/thisdoesntexist')
    end
  end

  after :each do
    Role.destroy_all
  end

end