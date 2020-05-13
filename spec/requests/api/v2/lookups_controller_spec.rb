# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::LookupsController, type: :request do
  before :each do
    Field.destroy_all
    Lookup.destroy_all

    @lookup_yes_no = Lookup.create!(
      unique_id: 'lookup-yes-no',
      name_i18n: { en: 'Yes / No' },
      lookup_values_i18n: {
        en: [
          { id: 'true', display_text: 'Yes' },
          { id: 'false', display_text: 'No' }
        ]
      }
    )

    @lookup_sex = Lookup.create!(
      unique_id: 'lookup-sex',
      name_i18n: { en: 'Sex' },
      lookup_values_i18n: {
        en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ]
      }
    )

    @lookup_country = Lookup.create!(
      unique_id: 'lookup-country',
      name_i18n: { en: 'Country' },
      lookup_values_i18n: {
        en: [
          { id: 'country1', display_text: 'Country 1' },
          { id: 'country2', display_text: 'Country 2' }
        ]
      }
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/lookups' do
    it 'list the lookups' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::READ])
        ]
      )

      get '/api/v2/lookups'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(3)
      expect(json['data'].map { |c| c['unique_id'] }).to include(@lookup_yes_no.unique_id, @lookup_sex.unique_id)
    end
  end

  describe 'GET /api/v2/lookups/:id' do
    it 'fetches the correct lookup with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::READ])
        ]
      )

      get "/api/v2/lookups/#{@lookup_yes_no.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@lookup_yes_no.id)
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test

      get "/api/v2/lookups/#{@lookup_yes_no.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/lookups/#{@lookup_yes_no.id}")
    end

    it 'returns a 404 when trying to fetch a lookup with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/lookups/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/lookups' do
    it 'creates a new lookup and returns 200 and json' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])]
      )

      params = {
        data: {
          unique_id: 'lookup-api-created',
          name: {
            en: 'Lookup Created By Api',
            es: 'Lookup Creado Por Api'
          },
          values: [
            { 'id' => 'Option_1', 'display_text' => { 'en' => 'option 1', 'es' => 'opcion 1' } },
            { 'id' => 'Option_2', 'display_text' => { 'en' => 'option 2', 'es' => 'opcion 2' } },
            { 'id' => 'Option_3', 'display_text' => { 'en' => 'option 3', 'es' => 'opcion 3' } }
          ]
        }
      }

      post '/api/v2/lookups', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      lookup_api_created = Lookup.find_by(id: json['data']['id'])
      expect(lookup_api_created).not_to be_nil
      expect(lookup_api_created.name_en).to eq(params[:data][:name][:en])
      expect(lookup_api_created.name_es).to eq(params[:data][:name][:es])
      expect(lookup_api_created.lookup_values_en.size).to eq(3)
      expect(lookup_api_created.lookup_values_es.size).to eq(3)
    end

    it "returns 403 if user isn't authorized to create lookup" do
      login_for_test

      unique_id = 'lookup-api-2'

      params = {
        data: {
          unique_id: unique_id,
          name: {
            en: 'Lookup API 2'
          },
          values: {
            en: [
              { id: 'option_1', display_text: 'Option 1' }
            ]
          }
        }
      }

      post '/api/v2/lookups', params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups')
      expect(Lookup.find_by(unique_id: unique_id)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @lookup_yes_no.id,
          unique_id: 'lookup-yes-no-duplicated',
          name: {
            en: 'Lookup Yes / No'
          },
          values: {
            en: [
              { id: 'yes', display_text: 'Yes' },
              { id: 'no', display_text: 'No' }
            ]
          }
        }
      }
      post '/api/v2/lookups', params: params

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups')
    end

    it 'returns a 422 if the lookup is invalid' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = { data: { name: { en: '' }, values: { en: [] } } }

      post '/api/v2/lookups', params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups')
      expect(json['errors'][0]['detail']).to eq('name')
    end
  end

  describe 'PATCH /api/v2/lookups/:id' do
    it 'updates an existing record with 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])]
      )

      params = {
        data: {
          values: [
            {
              'id': 'country3',
              'display_text': {
                'en': 'Country 3',
                'fr': '',
                'es': ''
              }
            }
          ]
        }
      }

      patch "/api/v2/lookups/#{@lookup_country.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@lookup_country.id)
      expect(@lookup_country.reload.lookup_values_en.size).to eq(3)
      expect(@lookup_country.lookup_values.map { |value| value['id'] }).to include('country3')
    end

    it 'updates translations for an existing lookup with 200' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])]
      )

      params = {
        'data' => {
          'values' => [
            {
              'id' => 'country1',
              'display_text' => {
                'en' => '',
                'fr' => '',
                'es' => 'País 1'
              }
            },
            {
              'id' => 'country2',
              'display_text' => {
                'en' => '',
                'fr' => '',
                'es' => 'País 2'
              }
            }
          ]
        }
      }

      patch "/api/v2/lookups/#{@lookup_country.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@lookup_country.id)
      expect(@lookup_country.reload.lookup_values_es.size).to eq(2)
      expect(@lookup_country.reload.lookup_values_en.size).to eq(2)
    end

    it 'Should delete a lookup value' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])]
      )
      params = {
        'data' => {
          'values' => [
            {
              'id' => 'country1',
              '_delete' => true
            }
          ]
        }
      }
      patch "/api/v2/lookups/#{@lookup_country.id}", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['values'].count).to eq(1)
      expect(@lookup_country.reload.lookup_values_en.size).to eq(1)
      expect(json['data']['values'][0]['id']).to eq('country2')
    end

    it "returns 403 if user isn't authorized to update lookups" do
      login_for_test(permissions: [])
      params = {
        data: {
          values: {
            en: [
              { id: 'country3', display_text: 'Country 3' }
            ]
          }
        }
      }
      patch "/api/v2/lookups/#{@lookup_country.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/lookups/#{@lookup_country.id}")
    end

    it 'returns a 404 when trying to update a lookup with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          values: {
            en: [
              { id: 'country3', display_text: 'Country 3' }
            ]
          }
        }
      }
      patch '/api/v2/lookups/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups/thisdoesntexist')
    end

    it 'returns a 422 if the case lookup is invalid' do
      login_for_test(
        permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])]
      )

      params = {
        data: { name: { en: '' } }
      }

      patch "/api/v2/lookups/#{@lookup_country.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/lookups/#{@lookup_country.id}")
      expect(json['errors'][0]['detail']).to eq('name')
    end
  end

  describe 'DELETE /api/v2/lookups/:id' do
    it 'successfully deletes a lookup with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/lookups/#{@lookup_yes_no.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@lookup_yes_no.id)
    end

    it "returns 403 if user isn't authorized to delete lookups" do
      login_for_test
      delete "/api/v2/lookups/#{@lookup_yes_no.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/lookups/#{@lookup_yes_no.id}")
    end

    it 'returns a 404 when trying to delete a lookup with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete '/api/v2/lookups/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/lookups/thisdoesntexist')
    end
  end
end
