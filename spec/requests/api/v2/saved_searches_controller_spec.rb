require 'rails_helper'

describe Api::V2::SavedSearchesController, type: :request do

  before :each do
    [SavedSearch, FormSection, Role, Agency, User, PrimeroModule, PrimeroProgram].each(&:destroy_all)

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

    @saved_search1 = SavedSearch.create!(
                      name: 'saved_search_1',
                      record_type: "case",
                      primero_modules: [@cp],
                      filters: [{
                        name:  "flag",
                        value: ["single", "flag"]
                      }],
                      user: @user_1
                    )
    @saved_search2 = SavedSearch.create!(
                      name: 'saved_search_2',
                      record_type: "case",
                      primero_modules: [@cp],
                      filters: [{
                        name:  "mobile",
                        value: ["single", "true"]
                      }],
                      user: @user_1
                    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/saved_searches' do

    it 'lists the saved searches and accompanying metadata' do
      sign_in(@user_1)
      get '/api/v2/saved_searches'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['metadata']['total']).to eq(2)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

  end

  describe 'POST /api/v2/saved_searches' do
    it 'creates a new saved search with 200 and returns it as JSON' do
      login_for_test
      params = {
        "data" => {
          "name" => "Search 1",
          "record_type" => "case",
          "module_ids" => ["primeromodule-cp"],
          "filters" => [
            {"name" =>  "flag", "value" => ["single", "flag"] }
          ]
        }
      }

      post '/api/v2/saved_searches', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(json['data']['filters']).to eq(params['data']['filters'])
      expect(SavedSearch.find_by(id: json['data']['id'])).not_to be_nil

    end
  end

  describe 'DELETE /api/v2/saved_searches/:id' do
    it 'successfully deletes a saved search with a code of 200' do
      sign_in(@user_1)

      delete "/api/v2/saved_searches/#{@saved_search1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@saved_search1.id)

      saved_search = SavedSearch.find_by(id: @saved_search1.id)
      expect(saved_search).to be_nil
    end

    it 'returns a 403 when the user is not the owner of the saved search' do
      login_for_test

      delete "/api/v2/saved_searches/#{@saved_search1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/saved_searches/#{@saved_search1.id}")
    end

    it "returns a 404 when trying to delete a saved search with a non-existant id" do
      login_for_test

      delete "/api/v2/saved_searches/thisdoesntexist"

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/saved_searches/thisdoesntexist")
    end
  end

  after :each do
    [SavedSearch, FormSection, Role, Agency, User, PrimeroModule, PrimeroProgram].each(&:destroy_all)
  end
end