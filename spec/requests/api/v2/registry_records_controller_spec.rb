# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::RegistryRecordsController, type: :request do
  before do
    clean_data(RegistryRecord)
    @registry1 = RegistryRecord.create!(registry_type: RegistryRecord::REGISTRY_TYPE_FARMER)
    @registry2 = RegistryRecord.create!(registry_type: RegistryRecord::REGISTRY_TYPE_INDIVIDUAL)
    @registry3 = RegistryRecord.create!(registry_type: RegistryRecord::REGISTRY_TYPE_INDIVIDUAL)
    @registry4 = RegistryRecord.create!(registry_type: RegistryRecord::REGISTRY_TYPE_FOSTER_CARE)
    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/registry_records', search: true do
    it 'lists registries and accompanying metadata' do
      expected_registry_types = [RegistryRecord::REGISTRY_TYPE_FARMER, RegistryRecord::REGISTRY_TYPE_INDIVIDUAL,
                                 RegistryRecord::REGISTRY_TYPE_INDIVIDUAL, RegistryRecord::REGISTRY_TYPE_FOSTER_CARE]
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
        expected_registry_types = [RegistryRecord::REGISTRY_TYPE_INDIVIDUAL, RegistryRecord::REGISTRY_TYPE_INDIVIDUAL]
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

    context 'when the authorized user is not the record owner' do
      it 'can list all registry records' do
        login_for_test(
          permissions: [Permission.new(resource: Permission::REGISTRY_RECORD, actions: [Permission::READ])],
          group_permission: Permission::GROUP
        )
        get '/api/v2/registry_records'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(4)
        expect(json['metadata']['total']).to eq(4)
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

  describe 'GET /api/v2/registry_records/:id' do
    context 'when the authorized user has full record access scope' do
      it 'fetches the correct record with code 200' do
        login_for_test
        get "/api/v2/registry_records/#{@registry1.id}"

        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(@registry1.id)
      end

      context 'and registry name is hidden' do
        before do
          @registry1.hidden_name = true
          @registry1.save!
          login_for_test(permitted_field_names: %w[name])
        end

        it 'obfuscates the name' do
          get "/api/v2/registry_records/#{@registry1.id}"

          expect(json['data']['name']).to eq('*******')
          expect(json['data']['hidden_name']).to be true
        end
      end
    end

    context 'when the authorized user is not the record owner' do
      it 'fetches the correct record with code 200' do
        login_for_test(
          permissions: [Permission.new(resource: Permission::REGISTRY_RECORD, actions: [Permission::READ])],
          group_permission: Permission::GROUP
        )
        get "/api/v2/registry_records/#{@registry1.id}"

        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(@registry1.id)
      end
    end
  end

  describe 'POST /api/v2/registry_records' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = { data: { registry_type: RegistryRecord::REGISTRY_TYPE_FOSTER_CARE } }
      post '/api/v2/registry_records', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['registry_type']).to eq(RegistryRecord::REGISTRY_TYPE_FOSTER_CARE)
      expect(RegistryRecord.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'PATCH /api/v2/registry_records/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { registry_type: RegistryRecord::REGISTRY_TYPE_FOSTER_CARE } }
      patch "/api/v2/registry_records/#{@registry1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@registry1.id)

      updated_registry = RegistryRecord.find_by(id: @registry1.id)
      expect(updated_registry.data['registry_type']).to eq(RegistryRecord::REGISTRY_TYPE_FOSTER_CARE)
    end
  end

  # In Primero, we don't actually delete records.  We disable them
  describe 'DELETE /api/v2/registry_records/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::REGISTRY_RECORD, actions: [Permission::ENABLE_DISABLE_RECORD])
        ]
      )
      delete "/api/v2/registry_records/#{@registry1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@registry1.id)

      updated_registry = RegistryRecord.find_by(id: @registry1.id)
      expect(updated_registry.record_state).to be false
    end
  end

  after do
    clean_data(RegistryRecord)
  end
end
