# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::WebhooksController, type: :request do
  before :each do
    clean_data(Role, User, Webhook)
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
    @webhook_a = Webhook.create!(
      unique_id: 'webhook_1',
      webhook_code: 'webhook1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      pdf_logo_option: true,
      services: %w[services_a services_b],
      name_i18n: { en: 'Webhook 1', es: 'Agencia 1' },
      description_i18n: { en: 'Webhook 1', es: 'Agencia 1' },
      logo_icon: FilesTestHelper.logo,
      logo_full: FilesTestHelper.logo,
      terms_of_use: FilesTestHelper.pdf_file
    )
    @webhook_b = Webhook.create!(
      unique_id: 'webhook_2',
      webhook_code: 'webhook_2',
      order: 1,
      telephone: '12525742',
      logo_enabled: false,
      disabled: false,
      services: %w[services_a services_b],
      name_i18n: { en: 'Webhook 2', es: 'Webhook 2' },
      description_i18n: { en: 'Webhook 2', es: 'Webhook 2' }
    )
    @webhook_c = Webhook.create!(
      unique_id: 'webhook_3',
      webhook_code: 'webhook3',
      order: 1,
      telephone: '12565742',
      logo_enabled: true,
      disabled: true,
      services: %w[services_a services_b],
      name_i18n: { en: 'Webhook 3', es: 'Webhook 3' },
      logo_icon: FilesTestHelper.logo,
      logo_full: FilesTestHelper.logo
    )
    @user_a = User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      webhook_id: @webhook_a.id,
      role: @role
    )
    @user_b = User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'b12345678',
      password_confirmation: 'b12345678',
      email: 'test_user_2@localhost.com',
      webhook_id: @webhook_a.id,
      role: @role
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/webhooks' do
    it 'list webhooks' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/webhooks'

      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(3)
      expect(json['data'][0]['unique_id']).to eq(@webhooks_a.unique_id)
      expect(json['data'][0]['name']).to eq(FieldI18nService.fill_with_locales(@webhooks_a.name_i18n))
      expect(json['data'][0]['pdf_logo_option']).to be_truthy
      expect(json['data'][0]['logo_icon']).not_to be_nil
      expect(json['data'][0]['logo_full']).not_to be_nil
      expect(json['data'][0]['terms_of_use']).not_to be_nil
      expect(json['data'][2]['logo_icon']).not_to be_nil
      expect(json['data'][2]['logo_full']).not_to be_nil
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/webhooks'
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'GET /api/v2/webhooks/:id' do
    it 'fetches the correct webhook with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/webhooks/#{@webhooks_b.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(@webhook_b.unique_id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/webhooks/#{@webhook_b.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/webhooks/#{@webhooks_b.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to fetch a record with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/webhooks/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/webhooks' do
    it 'creates a new webhook and returns 200 and json' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'webhooks_test00',
          webhook_code: 'a00052',
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

      post '/api/v2/webhooks', params: params
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(params[:data][:unique_id])
      expect(json['data']['name']['en']).to eq(params[:data][:name][:en])
      expect(json['data']['name']['es']).to eq(params[:data][:name][:es])
    end

    it 'Error 409 same id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @webhook_a.id,
          unique_id: 'webhook_test00',
          webhook_code: 'a00052',
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

      post '/api/v2/webhooks', params: params
      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Conflict: A record with this id already exists')
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          unique_id: 'webhooks_test00',
          webhook_code: 'a00052',
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

      post '/api/v2/webhooks', params: params
      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'].first['message']).to eq('Forbidden')
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks')
    end
  end

  describe 'PATCH /api/v2/webhooks/:id' do
    it 'updates an existing webhook with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: @webhook_a.id,
          unique_id: 'webhook_test00',
          webhook_code: 'a00052',
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

      patch "/api/v2/webhooks/#{@webhook_a.id}", params: params
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(params[:data][:unique_id])
      expect(json['data']['webhook_code']).to eq(params[:data][:webhook_code])
      expect(json['data']['name']).to eq(name_i18n)
      expect(json['data']['description']).to eq(description_i18n)
    end

    it 'updates an non-existing webhook' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch '/api/v2/webhooks/thisdoesntexist', params: params
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks/thisdoesntexist')
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )
      params = {}

      patch "/api/v2/webhooks/#{@webhook_a.id}", params: params
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/webhooks/#{@webhook_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  describe 'DELETE /api/v2/webhooks/:id' do
    it 'successfully disable an webhook with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/webhooks/#{@webhook_a.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@webhook_a.id)
      expect(Webhook.find_by(id: @webhook_a.id).disabled).to be true # should expect not found 
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/webhooks/#{@webhook_a.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/webhooks/#{@webhook_a.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end

    it 'returns a 404 when trying to delete a webhook with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::WEBHOOK, actions: [Permission::MANAGE])
        ]
      )

      delete '/api/v2/webhooks/thisdoesntexist'
      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/webhooks/thisdoesntexist')
    end
  end

  after :each do
    clean_data(Role, User, Webhook)
  end
end
