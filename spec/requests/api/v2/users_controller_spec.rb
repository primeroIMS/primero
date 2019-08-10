require 'rails_helper'

describe Api::V2::UsersController, type: :request do
  before :each do
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
    @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')

    User.create!(
      full_name: "Test User 1",
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: "test_user_1@localhost.com",
      agency_id: @agency1.id,
      role: @role,
      primero_modules: [@cp]
    )

    User.create!(
      full_name: "Test User 2",
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: "test_user_2@localhost.com",
      agency_id: @agency1.id,
      role: @role,
      primero_modules: [@cp]
    )

    User.create!(
      full_name: "Test User 3",
      user_name: 'test_user_3',
      password: 'c12345678',
      password_confirmation: 'c12345678',
      email: "test@localhost.com",
      agency_id: @agency2.id,
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