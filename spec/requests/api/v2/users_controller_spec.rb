require 'rails_helper'

describe Api::V2::UsersController, type: :request do
  before :each do
    SystemSettings.stub(:current).and_return(SystemSettings.new(
      primary_age_range: "primero",
      age_ranges: {
        "primero" => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
        "unhcr" => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
      }
    ))

    @program = PrimeroProgram.create!(
                 unique_id: "primeroprogram-primero",
                 name: "Primero",
                 description: "Default Primero Program"
               )

    @cp = PrimeroModule.create!(
            unique_id: 'primeromodule-cp',
            name: "CP",
            description: "Child Protection",
            associated_record_types: ["case", "tracing_request", "incident"],
            primero_program: @program,
            form_sections: [FormSection.create!(name: 'form_1')]
          )

    @gbv = PrimeroModule.create!(
             unique_id: 'primeromodule-gbv',
             name: "GBV",
             description: "Gender Based Violence",
             associated_record_types: ["case", "incident"],
             primero_program: @program,
             form_sections: [FormSection.create!(name: 'form_2')]
           )

    @role = Role.create!(
      name: 'Test Role 1',
      unique_id: "test-role-1",
      permissions: [
        Permission.new(
          :resource => Permission::CASE,
          :actions => [Permission::MANAGE]
        )
      ]
    )
    @agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @agency_2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')

    @user_1 = User.create!(
                full_name: "Test User 1",
                user_name: 'test_user_1',
                password: 'a12345678',
                password_confirmation: 'a12345678',
                email: "test_user_1@localhost.com",
                agency_id: @agency_1.id,
                role: @role,
                primero_modules: [@cp]
              )

    @user_2 = User.create!(
                full_name: "Test User 2",
                user_name: 'test_user_2',
                password: 'b12345678',
                password_confirmation: 'b12345678',
                email: "test_user_2@localhost.com",
                agency_id: @agency_1.id,
                role: @role,
                primero_modules: [@cp]
              )

    @user_3 = User.create!(
                full_name: "Test User 3",
                user_name: 'test_user_3',
                password: 'c12345678',
                password_confirmation: 'c12345678',
                email: "test@localhost.com",
                agency_id: @agency_2.id,
                role: @role,
                primero_modules: [@cp]
              )
  end

  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v2/users" do
    it "list the users" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      get '/api/v2/users'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
    end

    it "list the users of a specific agency" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/users?agency=#{@agency_1.id}"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
    end

    it "return modules, agencies, permissions, filters, headers for the extended version" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/users?extended=true"

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'][0]['agency']).to eq(@agency_1.id)
      expect(json['data'][0]['filters']).not_to be_nil
      expect(json['data'][0]['permissions']).not_to be_nil
      expect(json['data'][0]['list_headers']).not_to be_nil
    end


    it 'refuses unauthorized access' do
      # TODO: This fails because of an error in ability.rb check that file.
      login_for_test(
        permissions: [
          Permission.new(:resource => Permission::CASE, :actions => [])
        ],
        group_permission: Permission::SELF
      )

      get '/api/v2/users'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users')
    end
  end

  describe 'GET /api/v2/users/:id' do
    it 'fetches the correct user with code 200' do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::AGENCY, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::USER_GROUP, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::SYSTEM, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      })
      get "/api/v2/users/#{@user_1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_1.id)
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test
      get "/api/v2/users/#{@user_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_1.id}")
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
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test(permissions:[
        Permission.new(:resource => Permission::USER, :actions => [Permission::CREATE])
      ])
      params = { 
        data: {
          full_name: "Test User API",
          user_name: "test_user_api",
          code: "test/code",
          email: "test_user_api@localhost.com",
          agency_id: @agency_1.id,
          role_id: @role.id,
          module_ids: @cp.id,
          password_confirmation: "a12345678",
          password: "a12345678"
        }
      }

      post '/api/v2/users', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(json['data']['user_name']).to eq(params[:data][:user_name])
      expect(json['data']['agency_id']).to eq(params[:data][:agency_id])
      expect(json['data']['role_id']).to eq(params[:data][:role_id])
      expect(User.find_by(id: json['data']['id'])).not_to be_nil
    end

    describe 'empty response' do

      let(:json) { nil }

      it 'creates a new record with 204 and returns no JSON if the client generated the id' do
        login_for_test(
          permissions:[
            Permission.new(:resource => Permission::USER, :actions => [Permission::CREATE])
          ])
        id =  (rand() * 1000).to_i
        params = { 
          data: {
            id: id,
            full_name: "Test User API 2",
            user_name: "test_user_api_2",
            code: "test/code",
            email: "test_user_api@localhost.com",
            agency_id: @agency_1.id,
            role_id: @role.id,
            module_ids: @cp.id,
            password_confirmation: "a12345678",
            password: "a12345678"
          }
        }

        post '/api/v2/users', params: params

        expect(response).to have_http_status(204)
        expect(User.find_by(id: id)).not_to be_nil
      end

    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test

      id = (rand() * 1000).to_i

      params = { 
        data: {
          id: id,
          full_name: "Test User API",
          user_name: "test_user_api",
          code: "test/code",
          email: "test_user_api@localhost.com",
          agency_id: @agency_1.id,
          role_id: @role.id,
          module_ids: @cp.id,
          password_confirmation: "a12345678",
          password: "a12345678"
        }
      }

      post "/api/v2/users", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users")
      expect(User.find_by(id: id)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test(
        permissions:[
          Permission.new(:resource => Permission::USER, :actions => [Permission::CREATE])
      ])
      params = { 
        data: {
          id: @user_1.id,
          full_name: "Test User 5",
          user_name: "test_user_5",
          code: "test/code",
          email: "test_user_5@localhost.com",
          agency_id: @agency_1.id,
          role_id: @role.id,
          module_ids: @cp.id,
          password_confirmation: "a12345678",
          password: "a12345678"
        }
      }

      post "/api/v2/users", params: params

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users")
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test(
        permissions:[
          Permission.new(:resource => Permission::USER, :actions => [Permission::CREATE])
      ])
      params = { 
        data: {
          id: @user_1.id,
          full_name: "Test User 5",
          user_name: "test_user_5",
          code: "test/code",
          email: "test_user_5@localhost.com",
          agency_id: @agency_1.id,
          role_id: @role.id,
          module_ids: @cp.id
        }
      }
      post "/api/v2/users", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users")
      expect(json['errors'][0]['detail']).to eq("password")
    end
  end

  describe 'PATCH /api/v2/users/:id' do

    it 'updates an existing user with 200' do
      login_for_test(
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::AGENCY, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::USER_GROUP, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::SYSTEM, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )
      params = { 
        data: {
          full_name: "Updated User 1"
        }
      }

      patch "/api/v2/users/#{@user_1.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_1.id)

      user1 = User.find_by(id: @user_1.id)
      expect(user1.full_name).to eq('Updated User 1')
    end

    it "returns 403 if user isn't authorized to update users" do
      login_for_test
      params = { 
        data: {
          full_name: "Updated User 1"
        }
      }

      patch "/api/v2/users/#{@user_1.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_1.id}")
    end

    it "returns a 404 when trying to update a user with a non-existant id" do
      login_for_test

      params = { 
        data: {
          full_name: "Updated User 1"
        }
      }

      patch '/api/v2/users/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/thisdoesntexist')
    end

    it 'returns a 422 if the user is invalid' do
      login_for_test(
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::AGENCY, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::USER_GROUP, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::SYSTEM, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )
      params = { 
        data: {
           email: "test_user_2@localhost.com",
        }
      }

      patch "/api/v2/users/#{@user_1.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_1.id}")
      expect(json['errors'][0]['detail']).to eq('email')
    end

  end


  describe "DELETE /api/v2/users/:id" do

    it "successfully deletes a user with a code of 200" do
      login_for_test(
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::AGENCY, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::USER_GROUP, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::SYSTEM, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
        ],
        group_permission: Permission::ADMIN_ONLY
      )

      delete "/api/v2/users/#{@user_1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@user_1.id)
    end

    it "returns 403 if user isn't authorized to delete users" do
      login_for_test
      delete "/api/v2/users/#{@user_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/users/#{@user_1.id}")
    end

    it "returns a 404 when trying to delete a form with a non-existant id" do
      login_for_test(
        permissions: [
          Permission.new(:resource => Permission::USER, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::AGENCY, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::USER_GROUP, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::SYSTEM, :actions => [Permission::MANAGE]),
          Permission.new(:resource => Permission::ROLE, :actions => [Permission::MANAGE])
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
    FormSection.destroy_all
    PrimeroModule.destroy_all
    Role.destroy_all
    User.destroy_all
    Agency.destroy_all
    PrimeroProgram.destroy_all
  end

end
