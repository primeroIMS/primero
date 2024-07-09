# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::WebpushSubscriptionsController, type: :request do
  before(:each) do
    clean_data(WebpushSubscription, User, Agency, Role)
    Rails.configuration.x.webpush.enabled = true
    Rails.configuration.x.webpush.vapid_public = 'vapic_public_key_123!'
    allow(ENV).to receive(:fetch)
    allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
  end
  let(:agency) { Agency.create!(name: 'Agency 1', agency_code: 'agency1') }
  let(:role) do
    Role.create_or_update!(name: 'Test Role 1', unique_id: 'test-role-1', permissions: { system: ['manage'] })
  end
  let(:user1) do
    User.create!(
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_1@localhost.com',
      agency:,
      role:
    )
  end
  let(:user2) do
    User.create!(
      full_name: 'Test User 2',
      user_name: 'test_user_2',
      password: 'a12345678',
      password_confirmation: 'a12345678',
      email: 'test_user_2@localhost.com',
      agency:,
      role:
    )
  end
  let(:webpush_subscription1) { WebpushSubscription.create!(notification_url: 'https://ab2ca2bac', auth: 'some-auth', p256dh: 'some-p256dh', user: user1, updated_at: DateTime.now - 1.minute) }

  let(:webpush_subscription2) { WebpushSubscription.create!(notification_url: 'https://notification2.url', auth: '2nd-auth', p256dh: '2nd-p256dh', user: user2) }
  let(:webpush_subscription3) { WebpushSubscription.create!(notification_url: 'https://notification3.url', auth: '3rd-auth', p256dh: '3rd-p256dh', user: user1) }
  let(:webpush_subscription4) { WebpushSubscription.create!(notification_url: 'https://notification3.url', auth: '3rd-auth', p256dh: '3rd-p256dh', user: user1, disabled: true) }
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/webpush/subscriptions' do
    before(:each) do
      webpush_subscription1
      webpush_subscription2
      webpush_subscription3
    end

    context 'when notification_url is not a params' do
      it 'list webpush_subscriptions of current user' do
        login_for_test(user_name: user1.user_name, id: user1.id)
        get '/api/v2/webpush/subscriptions'

        expect(response).to have_http_status(200)
        expect(json['data'].count).to eq(2)
        expect(json['data'].map { |subscriptions| subscriptions['id'] })
          .to match_array([webpush_subscription1.id, webpush_subscription3.id])
      end
    end

    context 'when notification_url is a params' do
      it 'list webpush_subscriptions of current user and notification_url' do
        login_for_test(user_name: user1.user_name, id: user1.id)
        params = {
          notification_url: 'https://notification3.url'
        }
        get('/api/v2/webpush/subscriptions', params:)

        expect(response).to have_http_status(200)
        expect(json['data'].count).to eq(1)
        expect(json['data'].map { |subscriptions| subscriptions['id'] })
          .to match_array([webpush_subscription3.id])
      end
    end

    context 'when webpush is not enabled' do
      before(:each) do
        Rails.configuration.x.webpush.enabled = false
      end

      it 'returns 404' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: 'https://random.url',
            disabled: false
          }
        }

        get('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(404)
        expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions')
        expect(json['errors'][0]['detail']).to eq('Errors::WebpushNotEnabled')
        expect(json['errors'][0]['message']).to eq('Not Found')
      end
    end
  end

  describe 'POST /api/v2/webpush/subscriptions' do
    context 'when all required params are present' do
      it 'creates a new WebpushSubscription and returns 200 and json' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: 'https://sample.com/this/endpoint',
            auth: 'auth from rspec',
            p256dh: 'p256dh from rspec'
          }
        }

        post('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(200)
        expect(json['data']['user_id']).to eq(user1.id)
        expect(json['data']['disabled']).to be_falsey
        expect(json['data']['notification_url']).to eq(params[:data][:notification_url])
      end
    end

    context 'when notification_url already exist' do
      it 'update the WebpushSubscription that match' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: webpush_subscription1.notification_url,
            auth: 'auth from rspec',
            p256dh: 'p256dh from rspec'
          }
        }

        post('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(webpush_subscription1.id)
        expect(json['data']['user_id']).to eq(user1.id)
        expect(json['data']['disabled']).to eq(webpush_subscription1.disabled)
        expect(Time.zone.parse(json['data']['updated_at']).to_s).not_to eq(webpush_subscription1.updated_at.to_s)
      end
    end

    context 'when notification_url is not present in params' do
      it 'returns 422' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            auth: 'auth from rspec',
            p256dh: 'p256dh from rspec'
          }
        }

        post('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(422)
        expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions')
        expect(json['errors'][0]['detail']).to eq('notification_url')
        expect(json['errors'][0]['message'][0]).to eq('errors.models.webpush_subscription.notification_url_present')
      end
    end

    context 'when auth is not present in params' do
      it 'returns 422' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: 'https://sample.com/this/endpoint',
            p256dh: 'p256dh from rspec'
          }
        }

        post('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(422)
        expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions')
        expect(json['errors'][0]['detail']).to eq('auth')
        expect(json['errors'][0]['message'][0]).to eq('errors.models.webpush_subscription.auth_present')
      end
    end

    context 'when p256dh is not present in params' do
      it 'returns 422' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: 'https://sample.com/this/endpoint',
            auth: 'auth from rspec'
          }
        }

        post('/api/v2/webpush/subscriptions', params:)
        expect(response).to have_http_status(422)
        expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions')
        expect(json['errors'][0]['detail']).to eq('p256dh')
        expect(json['errors'][0]['message'][0]).to eq('errors.models.webpush_subscription.p256dh_present')
      end
    end
  end

  describe 'PATCH /api/v2/webpush/subscriptions/current' do
    context 'when notification_url exist for the current user' do
      it 'update updated_at' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: webpush_subscription1.notification_url,
            auth: 'auth from rspec',
            p256dh: 'p256dh from rspec'
          }
        }

        patch('/api/v2/webpush/subscriptions/current', params:)
        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(webpush_subscription1.id)
        expect(json['data']['user_id']).to eq(user1.id)
        expect(json['data']['disabled']).to eq(webpush_subscription1.disabled)
        expect(Time.zone.parse(json['data']['updated_at']).to_s).not_to eq(webpush_subscription1.updated_at.to_s)
      end
    end

    context 'disable params is present' do
      it 'update disable' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: webpush_subscription1.notification_url,
            disabled: true
          }
        }

        patch('/api/v2/webpush/subscriptions/current', params:, as: :json)
        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(webpush_subscription1.id)
        expect(json['data']['user_id']).to eq(user1.id)
        expect(json['data']['disabled']).not_to eq(webpush_subscription1.disabled)
        expect(Time.zone.parse(json['data']['updated_at']).to_s).not_to eq(webpush_subscription1.updated_at.to_s)
      end

      context 'when subscription is already disabled' do
        it 'should return RecordNotFound' do
          login_for_test(user_name: user1.user_name, id: user1.id)

          params = {
            data: {
              notification_url: webpush_subscription4.notification_url,
              disabled: false
            }
          }

          patch('/api/v2/webpush/subscriptions/current', params:)
          expect(response).to have_http_status(404)
          expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions/current')
          expect(json['errors'][0]['detail']).to eq('ActiveRecord::RecordNotFound')
          expect(json['errors'][0]['message']).to eq('Not Found')
        end
      end
    end

    context 'when webpush_subscriptions does not exist with that notification_url' do
      it 'returns 404' do
        login_for_test(user_name: user1.user_name, id: user1.id)

        params = {
          data: {
            notification_url: 'https://random.url',
            disabled: false
          }
        }

        patch('/api/v2/webpush/subscriptions/current', params:)
        expect(response).to have_http_status(404)
        expect(json['errors'][0]['resource']).to eq('/api/v2/webpush/subscriptions/current')
        expect(json['errors'][0]['detail']).to eq('ActiveRecord::RecordNotFound')
        expect(json['errors'][0]['message']).to eq('Not Found')
      end
    end
  end

  after(:each) do
    clean_data(WebpushSubscription, User, Agency, Role)
    EncryptionService.instance_variable_set(:@instance, nil)
  end
end
