# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::RegistriesController, type: :request do
  before do
    clean_data(Registry)
    @registry1 = Registry.create!(registry_type: Registry::REGISTRY_TYPE_FARMER)
    @registry2 = Registry.create!(registry_type: Registry::REGISTRY_TYPE_INDIVIDUAL)
    @registry3 = Registry.create!(registry_type: Registry::REGISTRY_TYPE_INDIVIDUAL)
    @registry4 = Registry.create!(registry_type: Registry::REGISTRY_TYPE_FOSTER_CARE)
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/registry_records', search: true do
    it 'lists registries and accompanying metadata' do
      expected_registry_types = [Registry::REGISTRY_TYPE_FARMER, Registry::REGISTRY_TYPE_INDIVIDUAL,
                                 Registry::REGISTRY_TYPE_INDIVIDUAL, Registry::REGISTRY_TYPE_FOSTER_CARE]
      login_for_test
      get '/api/v2/registry_records'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map { |c| c['registry_type'] }).to match_array(expected_registry_types)
      expect(json['metadata']['total']).to eq(4)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    context 'when a registry_type is passed in' do
      it 'lists registries only for that registry_type' do
        expected_registry_types = [Registry::REGISTRY_TYPE_INDIVIDUAL, Registry::REGISTRY_TYPE_INDIVIDUAL]
        login_for_test
        get '/api/v2/registry_records?registry_type=individual'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(2)
        expect(json['data'].map { |c| c['registry_type'] }).to match_array(expected_registry_types)
        expect(json['metadata']['total']).to eq(2)
        expect(json['metadata']['per']).to eq(20)
        expect(json['metadata']['page']).to eq(1)
      end
    end

    context 'when user is unauthorized' do
      it 'refuses unauthorized access' do
        login_for_test(permissions: [])
        get '/api/v2/registry_records'

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq('/api/v2/registry_records')
      end
    end
  end

  describe 'GET /api/v2/tracing_requests/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test
      get "/api/v2/registry_records/#{@registry1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@registry1.id)
    end
  end

  describe 'POST /api/v2/registry_records' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = { data: { registry_type: Registry::REGISTRY_TYPE_FOSTER_CARE } }
      post '/api/v2/registry_records', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['registry_type']).to eq(Registry::REGISTRY_TYPE_FOSTER_CARE)
      expect(Registry.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'PATCH /api/v2/registry_records/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { registry_type:  Registry::REGISTRY_TYPE_FOSTER_CARE} }
      patch "/api/v2/registry_records/#{@registry1.id}", params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@registry1.id)

      updated_registry = Registry.find_by(id: @registry1.id)
      expect(updated_registry.data['registry_type']).to eq(Registry::REGISTRY_TYPE_FOSTER_CARE)
    end
  end

  # In Primero, we don't actually delete records.  We disable them
  describe 'DELETE /api/v2/registry_records/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REGISTRY, actions: [Permission::ENABLE_DISABLE_RECORD])
        ]
      )
      delete "/api/v2/registry_records/#{@registry1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@registry1.id)

      updated_registry = Registry.find_by(id: @registry1.id)
      expect(updated_registry.record_state).to be false
    end
  end

  after do
    clean_data(Registry)
  end
end
