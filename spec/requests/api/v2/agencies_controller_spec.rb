# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::AgenciesController, type: :request do
  before :each do
    clean_data(Role, User, Agency)
    @role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )
    @agency_a = Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      services: %w[services_a services_b],
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    @agency_b = Agency.create!(
      unique_id: 'agency_2',
      agency_code: 'agency2',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: true,
      services: %w[services_a services_b],
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency_id: @agency_a.id,
      role: @role
    )
    @user_b = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: 'test_user_2@localhost.com',
      agency_id: @agency_a.id,
      role: @role
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/agencies' do
    it 'list the agencies' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/agencies'
      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(2)
      expect(json['data'][0]['unique_id']).to eq(@agency_a.unique_id)
      expect(json['data'][0]['name']).to eq(FieldI18nService.fill_with_locales(@agency_a.name_i18n))
    end

    it 'list the agencies with page and per' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/agencies?per=1&page=2'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['unique_id']).to eq(@agency_b.unique_id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/agencies'
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'GET /api/v2/agencies/:id' do
    it 'fetches the correct agency with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/agencies/#{@agency_b.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(@agency_b.unique_id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/agencies/#{@agency_b.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/agencies/#{@agency_b.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/agencies/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/agencies' do
    it 'creates a new agency and returns 200 and json' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'agency_test00',
          agency_code: 'a00052',
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            en: 'Deploy',
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }

      post '/api/v2/agencies', params: params
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(params[:data][:unique_id])
      expect(json['data']['name']['en']).to eq(params[:data][:name][:en])
      expect(json['data']['name']['es']).to eq(params[:data][:name][:es])
    end

    it 'Error 409 same id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @agency_a.id,
          unique_id: 'agency_test00',
          agency_code: 'a00052',
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            en: 'Deploy',
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }

      post '/api/v2/agencies', params: params
      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Conflict: A record with this id already exists')
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies')
    end

    it 'Error 422 save without unique_id and agency_code' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            en: 'Deploy',
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }

      post '/api/v2/agencies', params: params
      expect(json['errors'].map { |error| error['status'] }).to eq([422, 422])
      expect(json['errors'].size).to eq(2)
      expect(json['errors'].map { |error| error['detail'] }).to eq(%w[unique_id agency_code])
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'agency_test00',
          agency_code: 'a00052',
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            en: 'Deploy',
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }

      post '/api/v2/agencies', params: params
      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Forbidden')
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies')
    end

    it 'Error 422 save name without english translation' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'agency_test00',
          agency_code: 'a00052',
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }

      post '/api/v2/agencies', params: params
      expect(json['errors'][0]['status']).to eq(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['detail']).to eq('name')
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies')
    end
  end

  describe 'PATCH /api/v2/agencies/:id' do
    it 'updates an existing agency with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @agency_a.id,
          unique_id: 'agency_test00',
          agency_code: 'a00052',
          order: 5,
          telephone: '87452168',
          services: %w[services],
          logo_enabled: true,
          disabled: true,
          name: {
            en: 'Deploy',
            es: 'Desplegar'
          },
          description: {
            en: 'Deploy',
            es: 'Desplegar'
          }
        }
      }
      name_i18n = FieldI18nService.fill_with_locales(params[:data][:name]).deep_stringify_keys
      description_i18n = FieldI18nService.fill_with_locales(params[:data][:description]).deep_stringify_keys

      patch "/api/v2/agencies/#{@agency_a.id}", params: params
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(params[:data][:unique_id])
      expect(json['data']['agency_code']).to eq(params[:data][:agency_code])
      expect(json['data']['name']).to eq(name_i18n)
      expect(json['data']['description']).to eq(description_i18n)
    end

    it 'updates an non-existing agency' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch '/api/v2/agencies/thisdoesntexist', params: params
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies/thisdoesntexist')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch "/api/v2/agencies/#{@agency_a.id}", params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/agencies/#{@agency_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/agencies/:id' do
    it 'successfully disable an agency with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/agencies/#{@agency_a.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@agency_a.id)
      expect(Agency.find_by(id: @agency_a.id).disabled).to be true
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/agencies/#{@agency_a.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/agencies/#{@agency_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to delete a agency with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::AGENCY, actions: [Permission::MANAGE])
        ]
      )

      delete '/api/v2/agencies/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/agencies/thisdoesntexist')
    end
  end

  after :each do
    clean_data(Role, User, Agency)
  end
end
