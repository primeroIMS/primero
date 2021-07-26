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
      id: 'webhook_1',
      events: 'event_1',
      url: 'url_1',
      role_unique_id: 'role_unique_id_1',
      metadata: {
        tag: 'tag_1',
      },
    )
    @webhook_b = Webhook.create!(
      id: 'webhook_2',
      events: 'event_2',
      url: 'url_2',
      role_unique_id: 'role_unique_id_2',
      metadata: {
        tag: 'tag_2',
      },
    )
    @webhook_c = Webhook.create!(
      id: 'webhook_3',
      events: 'event_3',
      url: 'url_3',
      role_unique_id: 'role_unique_id_3',
      metadata: {
        tag: 'tag_3',
      },
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
      expect(json['data'][0]['id']).to eq(@webhook_a.id)
      expect(json['data'][0]['events']).to eq(@webhook_a.events)
      expect(json['data'][0]['url']).to eq(@webhook_a.url)
      expect(json['data'][0]['role_unique_id']).to eq(@webhook_a.role_unique_id)
      expect(json['data'][0]['metadata']).to eq('tag' => 'tag_1') 
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

      get "/api/v2/webhooks/#{@webhook_b.id}"
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@webhook_b.id)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/webhooks/#{@webhook_b.id}"
      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/webhooks/#{@webhook_b.id}")
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
          events: 'case.create',
          url: 'https://sample.com/this/endpoint',
          role_unique_id: 'fake_role_id',
          metadata: {
            tag: 'zapier'
          }
        }
      }

      post '/api/v2/webhooks', params: params
      expect(response).to have_http_status(200)
      expect(json['data']['unique_id']).to eq(params[:data][:unique_id])

    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::ROLE, actions: [Permission::MANAGE])
        ]
      )
      params = {
        data: {
          id: 'webhook_id',
          events: 'case.create',
          url: 'https://sample.com/this2/endpoint',
          role_unique_id: 'fake_role_id',
          metadata: {
            tag: 'zapier'
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
          url: 'https://sample.com/this2/endpoint',
          role_unique_id: 'fake_role_id',
          metadata: {
            tag: 'zapier'
          }
        }
      }

      patch "/api/v2/webhooks/#{@webhook_a.id}", params: params
      expect(response).to have_http_status(200)
      expect(json['data']['url']).to eq(params[:data][:url])
      expect(json['data']['role_unique_id']).to eq(params[:data][:role_unique_id])
      expect(json['data']['metadata']).to eq('tag' => 'zapier')
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
      expect(Webhook.find_by(id: @webhook_a.id).nil?).to be true 
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
