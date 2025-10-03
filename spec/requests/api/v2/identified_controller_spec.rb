# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::IdentifiedController, type: :request do
  before :each do
    clean_data(Alert, Child)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/cases/identified' do
    it 'returns the identified record for the user' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      Child.create!(data: { owned_by: 'faketest', identified_by: 'faketest' })

      get '/api/v2/cases/identified'

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to be_present
      expect(json['data']['workflow']).to eq('new')
      expect(json['data']['enabled']).to eq(true)
      expect(json['data']['status']).to eq('open')
    end

    it 'returns 403 if the user is not authorized' do
      login_for_test

      get '/api/v2/cases/identified'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end

    it 'returns 404 if identified record does not exist' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      get '/api/v2/cases/identified'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end
  end

  describe 'POST /api/v2/cases/identified' do
    let(:params) { { data: { name: 'Test', age: 12, sex: 'female' } } }

    it 'creates an identified case and returns 200' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      post '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to be_present
      expect(json['data']['name']).to eq('Test')
      expect(json['data']['age']).to eq(12)
      expect(json['data']['sex']).to eq('female')
    end

    it 'creates an identified case even if no params are passed and returns 200' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      post '/api/v2/cases/identified', as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to be_present
    end

    it 'returns 409 if an identified record already exists' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      Child.create!(data: { owned_by: 'faketest', identified_by: 'faketest' })

      post '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end

    it 'returns 403 if the user is not authorized' do
      login_for_test

      post '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end
  end

  describe 'PATCH /api/v2/cases/identified' do
    let(:params) { { data: { name: 'Identified Case Updated', age: 12, sex: 'female' } } }

    it 'updates an identified case and returns 200' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      Child.create!(data: { owned_by: 'faketest', identified_by: 'faketest' })

      patch '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to be_present
      expect(json['data']['name']).to eq('Identified Case Updated')
      expect(json['data']['age']).to eq(12)
      expect(json['data']['sex']).to eq('female')
    end

    it 'returns 404 if an identified record does not exist' do
      login_for_test(group_permission: Permission::IDENTIFIED)

      patch '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end

    it 'returns 403 if the user is not authorized' do
      login_for_test

      patch '/api/v2/cases/identified', params:, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/cases/identified')
    end
  end
end
