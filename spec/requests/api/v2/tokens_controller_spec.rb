# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::TokensController, type: :request do
  include ActiveJob::TestHelper

  before :all do
    user_name = 'tokenstestuser'
    password = 'tokenstestuser0'
    @user = User.new(user_name:, password:, password_confirmation: password)
    @user.save(validate: false)
    @params = { user: { user_name:, password: } }
  end

  describe 'POST /api/v2/tokens' do
    let(:json) { JSON.parse(response.body) }

    it 'returns users with valid credentials' do
      post '/api/v2/tokens', params: @params

      expect(response).to have_http_status(200)
      expect(json['id']).to be_present
      expect(json['user_name']).to be_present
    end

    it 'returns nothing for invalid credentials' do
      post '/api/v2/tokens', params: { user: { user_name: @user.user_name, password: 'incorrect' } }
      expect(response.status).to eq 401
    end

    it 'enqueues an audit log job that records the login attempt' do
      metadata = {
        user_name: @user.user_name, remote_ip: '127.0.0.1', agency_id: nil, role_id: nil, http_method: 'POST',
        record_ids: []
      }
      post '/api/v2/tokens', params: @params
      expect(AuditLogJob).to have_been_enqueued
        .with(
          record_type: 'User',
          record_id: @user.id,
          action: 'login',
          user_id: @user.id,
          resource_url: request.url,
          metadata:
        )
    end

    context 'external identity enabled' do
      before(:each) do
        @use_identity_provider = Rails.configuration.x.idp.use_identity_provider
        @idp_user = User.new(user_name: idp_user_name)
        @idp_user.save(validate: false)
        @non_idp_user = User.new(user_name: non_idp_user_name, password:, password_confirmation: password)
        @non_idp_user.save(validate: false)
        Rails.configuration.x.idp.use_identity_provider = true
      end
      let(:non_idp_user_name) { 'non_idp_user' }
      let(:password) { 'tokenstestuser0' }
      let(:idp_user_name) { 'idp_user' }
      let(:token) { instance_double('IdpToken', valid?: true, user: @idp_user) }

      it 'returns the user id and token when signing in with a valid bearer token' do
        allow(IdpToken).to receive(:build).and_return(token)
        post '/api/v2/tokens', headers: { 'Authorization' => 'Bearer VALIDTOKEN' }

        expect(response).to have_http_status(200)
        expect(json['id']).to eq(@idp_user.id)
        expect(json['token']).to eq('VALIDTOKEN')
      end

      it 'returns a 401 when attempting to log in with a valid non-idp user and password' do
        post '/api/v2/tokens', params: { user: { user_name: non_idp_user_name, password: } }
        expect(response).to have_http_status(401)
      end

      it 'returns a 401 when got JWT exception' do
        headers = {
          'HTTP_AUTHORIZATION' => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' \
                                  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' \
                                  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }

        post('/api/v2/tokens', headers:)

        expect(response).to have_http_status(401)
      end

      after(:each) do
        @idp_user.destroy
        @non_idp_user.destroy
        Rails.configuration.x.idp.use_identity_provider = @use_identity_provider
      end
    end

    context 'incorrect failed attempts' do
      before(:each) do
        @user_name2 = 'tokenstestuser2'
        @password2 = 'tokenstestuser0'
        @user2 = User.new(user_name: @user_name2, password: @password2, password_confirmation: @password2)
        @user2.save(validate: false)
      end

      it 'locks a user after 6 failed attempts' do
        params = { user: { user_name: @user_name2, password: 'wrong!' } }
        6.times { post '/api/v2/tokens', params: }

        expect(response).to have_http_status(401)
        expect(@user2.reload.access_locked?).to be_truthy
        expect(json['error']).to be_present
      end
    end

    it 'throttles requests after 6 attempts per minute per user name' do
      params = { user: { user_name: @user.user_name, password: 'wrong!' } }
      7.times { post '/api/v2/tokens', params: }

      expect(response).to have_http_status(429)
    end
  end

  describe 'DELETE /api/v2/tokens' do
    it 'revokes the user session' do
      delete '/api/v2/tokens'

      # delete url
      expect(response).to have_http_status(200)
    end
  end

  after :each do
    clear_performed_jobs
    clear_enqueued_jobs
  end

  after :all do
    clean_data(User)
  end

  def decode_jwt(token)
    Warden::JWTAuth::TokenDecoder.new.call(token)
  end
end
