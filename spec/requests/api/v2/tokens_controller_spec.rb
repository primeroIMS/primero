# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::TokensController, type: :request do
  include ActiveJob::TestHelper

  before :all do
    clean_data(PrimeroModule, PrimeroProgram, FormSection, Role)

    user_name = 'tokenstestuser'
    password = 'tokenstestuser0'
    @user = User.new(user_name:, password:, password_confirmation: password, role: create(:role))
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

    it 'returns nothing for invalid credentials' do
      expect(AuditLogJob).to receive(:perform_later).with(hash_including(action: 'failed_login'))

      post '/api/v2/tokens', params: { user: { user_name: @user.user_name, password: 'incorrect' } }
      expect(response.status).to eq 401
    end

    it 'enqueues an audit log job that records the login attempt' do
      metadata = {
        user_name: @user.user_name, remote_ip: '127.0.0.1', agency_id: nil, role_id: @user.role_id,
        http_method: 'POST', record_ids: []
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
    it 'does not log audit entry for failures on other paths' do
      # User added a filter for '/api/v2/tokens' in warden_hooks.rb
      # failures on other paths (like dashboards) should be ignored by the hook.
      expect(AuditLogJob).not_to receive(:perform_later)

      get '/api/v2/dashboards', params: { user: { user_name: 'someuser', password: 'wrongpassword' } }
      expect(response.status).to eq 401
    end

    context 'external identity enabled' do
      before(:each) do
        Session.delete_all
        @use_identity_provider = Rails.configuration.x.idp.use_identity_provider
        @idp_user = User.new(user_name: idp_user_name, role: create(:role))
        @idp_user.save(validate: false)
        @non_idp_user = User.new(user_name: non_idp_user_name, password:, password_confirmation: password)
        @non_idp_user.save(validate: false)
        Rails.configuration.x.idp.use_identity_provider = true
      end
      let(:non_idp_user_name) { 'non_idp_user' }
      let(:password) { 'tokenstestuser0' }
      let(:idp_user_name) { 'idp_user' }
      let(:session) { Session.new(session_id: 'session123') }
      let(:token) { instance_double('IdpToken', valid?: true, user: @idp_user, session:) }

      it 'returns the user id and token when signing in with a valid bearer token' do
        allow(IdpToken).to receive(:build).and_return(token)
        post '/api/v2/tokens', headers: { 'Authorization' => 'Bearer VALIDTOKEN' }

        expect(response).to have_http_status(200)
        expect(json['id']).to eq(@idp_user.id)
        expect(json['token']).to eq('VALIDTOKEN')
      end


      it 'returns a 401 and logs failure for invalid IDP token' do
        invalid_token_string = 'INVALIDTOKEN'
        invalid_idp_token = instance_double('IdpToken', valid?: false, user_name: nil)
        allow(IdpToken).to receive(:build).with(invalid_token_string).and_return(invalid_idp_token)

        expect(AuditLogJob).to receive(:perform_later).with(
          hash_including(
            action: AuditLog::FAILED_LOGIN
          )
        )

        post '/api/v2/tokens', headers: { 'Authorization' => "Bearer #{invalid_token_string}" }

        expect(response).to have_http_status(401)
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

describe 'Rack::Attack API rate limit' do
  let(:app) { ->(_env) { [200, {}, ['OK']] } }
  let(:client) { Rack::MockRequest.new(Rack::Attack.new(app)) }
  let(:environment_variables) do
    %w[
      PRIMERO_API_RATE_LIMIT_ENABLED
      PRIMERO_API_RATE_LIMIT_REQUESTS
      PRIMERO_API_RATE_LIMIT_PERIOD
    ]
  end

  around do |example|
    original_values = ENV.to_h.slice(*environment_variables)
    environment_variables.each { |name| ENV.delete(name) }
    Rack::Attack.reset!

    example.run
  ensure
    environment_variables.each { |name| ENV.delete(name) }
    original_values.each { |name, value| ENV[name] = value }
    Rack::Attack.reset!
  end

  it 'is disabled when the enable environment variable is missing' do
    ENV['PRIMERO_API_RATE_LIMIT_REQUESTS'] = '1'

    2.times do
      expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    end
  end

  it 'uses 300 requests and 60 seconds as defaults' do
    throttle = Rack::Attack.throttles.fetch('API requests')

    expect(throttle.limit.call(nil)).to eq(300)
    expect(throttle.period.call(nil)).to eq(60)
  end

  it 'throttles API requests when enabled' do
    enable_rate_limit(requests: 2)

    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(post('/api/v2/users', session: 'session-one')).to eq(200)
    expect(get('/api/v2/cases', session: 'session-one')).to eq(429)
  end

  it 'returns a JSON error response and logs the first rejected request' do
    enable_rate_limit(requests: 1)
    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(Rails.logger).to receive(:warn).with(
      'Rate limit exceeded: throttle=API requests method=GET path=/api/v2/cases limit=1 period=60'
    ).once

    response = get_response('/api/v2/cases', session: 'session-one')
    error = JSON.parse(response.body).fetch('errors').first

    expect(response.status).to eq(429)
    expect(response.content_type).to eq('application/json; charset=utf-8')
    expect(response['retry-after'].to_i).to be_between(1, 60)
    expect(error).to eq(
      'status' => 429,
      'resource' => '/api/v2/cases',
      'message' => 'errors.api.too_many_requests'
    )

    expect(get('/api/v2/cases', session: 'session-one')).to eq(429)
  end

  it 'keeps separate limits for separate sessions' do
    enable_rate_limit(requests: 1)

    expect(get('/api/v2/cases', session: 'session-one')).to eq(200)
    expect(get('/api/v2/cases', session: 'session-two')).to eq(200)
    expect(get('/api/v2/cases', session: 'session-one')).to eq(429)
  end

  it 'keeps separate limits for separate authorization credentials' do
    enable_rate_limit(requests: 1)

    expect(get('/api/v2/cases', authorization: 'Bearer token-one')).to eq(200)
    expect(get('/api/v2/cases', authorization: 'Bearer token-two')).to eq(200)
    expect(get('/api/v2/cases', authorization: 'Bearer token-one')).to eq(429)
  end

  it 'does not throttle requests outside the API' do
    enable_rate_limit(requests: 1)

    2.times do
      expect(get('/v2/dashboards', session: 'session-one')).to eq(200)
    end
  end

  def enable_rate_limit(requests:)
    ENV['PRIMERO_API_RATE_LIMIT_ENABLED'] = 'true'
    ENV['PRIMERO_API_RATE_LIMIT_REQUESTS'] = requests.to_s
    ENV['PRIMERO_API_RATE_LIMIT_PERIOD'] = '60'
  end

  def get(path, session: nil, authorization: nil)
    get_response(path, session:, authorization:).status
  end

  def get_response(path, session: nil, authorization: nil)
    client.get(path, request_headers(session:, authorization:))
  end

  def post(path, session: nil, authorization: nil)
    client.post(path, request_headers(session:, authorization:)).status
  end

  def request_headers(session:, authorization:)
    headers = { 'REMOTE_ADDR' => '127.0.0.1' }
    headers['HTTP_COOKIE'] = "_app_session=#{session}" if session
    headers['HTTP_AUTHORIZATION'] = authorization if authorization
    headers
  end
end
