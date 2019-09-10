require 'rails_helper'

describe Api::V2::SavedSearchesController, type: :request do

  before :each do
    SavedSearch.destroy_all

    @saved_search1 = SavedSearch.create!(
                      name: 'saved_search_1',
                      record_type: "case",
                      module_ids: ["primeromodule-cp"],
                      filters: {
                        name:  "flag",
                        value: ["single", "flag"]
                      },
                      user_name: 'faketest'
                    )
    @saved_search2 = SavedSearch.create!(
                      name: 'saved_search_2',
                      record_type: "case",
                      module_ids: ["primeromodule-cp", "primeromodule-gbv"],
                      filters: {
                        name:  "mobile",
                        value: ["single", "true"]
                      },
                      user_name: 'otheruser'
                    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/saved_searches' do

    it 'lists the saved searches and accompanying metadata' do
      login_for_test
      get '/api/v2/saved_searches'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['metadata']['total']).to eq(1)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

  end

  describe 'POST /api/v2/saved_searches' do
    it 'creates a new saved search with 200 and returns it as JSON' do
      login_for_test
      params = {
        "data": {
          "name": "Search 1",
          "record_type": "case",
          "module_ids": ["primeromodule-cp"],
          "filters": {
            "name":  "flag",
            "value": ["single", "flag"]
          }
        }
      }

      post '/api/v2/saved_searches', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      expect(SavedSearch.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'DELETE /api/v2/saved_searches/:id' do
    it 'successfully deletes a saved search with a code of 200' do
      login_for_test

      delete "/api/v2/saved_searches/#{@saved_search1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@saved_search1.id)

      saved_search = SavedSearch.find_by(id: @saved_search1.id)
      expect(saved_search).to be_nil
    end

    it "returns a 404 when trying to delete a saved search with a non-existant id" do
      login_for_test

      delete "/api/v2/saved_searches/thisdoesntexist"

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/saved_searches/thisdoesntexist")
    end
  end
end