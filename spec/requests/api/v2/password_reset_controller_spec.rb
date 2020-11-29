# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::PasswordResetController, type: :request do
  let(:user_name) { 'testuser' }
  let(:email) { 'testuser@primerodev.org' }
  let(:password) { 'passwordpassword' }
  let(:user) do
    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::READ]
        )
      ]
    )
    agency = Agency.create!(name: 'Agency test 1', agency_code: 'agencytest1')
    User.create!(
      user_name: user_name, email: email, full_name: 'test',
      password: password, password_confirmation: password,
      role: role, agency: agency
    )
  end
  let(:new_password) { 'new_passwordpassword' }

  before(:each) do
    clean_data(User, Role, Agency)
    expect(user).to be
  end
  after(:each) { clean_data(User, Role, Agency) }

  describe 'POST /api/v2/users/password-reset-request' do
    it 'sends a password reset email if the provided email matches an existing user' do
      expect(Devise::Mailer).to receive(:reset_password_instructions).and_call_original

      post '/api/v2/users/password-reset-request', params: { user: { email: email } }
      expect(response).to have_http_status(200)
    end

    it 'does not send a password email if the provided email does not match an existing user' do
      expect(Devise::Mailer).not_to receive(:reset_password_instructions)

      post '/api/v2/users/password-reset-request', params: { user: { email: "fake#{email}" } }
      expect(response).to have_http_status(200)
    end

    it 'throttles requests after 6 attempts per minute per user email' do
      params = { user: { email: email } }
      7.times { post '/api/v2/users/password-reset-request', params: params }

      expect(response).to have_http_status(429)
    end
  end

  describe 'POST /api/v2/users/:id/password-reset-request' do
    it 'sends a password reset email ifor the sepcified user' do
      expect(Devise::Mailer).to receive(:reset_password_instructions).and_call_original
      login_for_test(
        permissions: [Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])]
      )
      post "/api/v2/users/#{user.id}/password-reset-request", params: { user: { password_reset: true } }
      expect(response).to have_http_status(200)
    end

    it 'returns a 401 if the current user is not logged in' do
      expect(Devise::Mailer).not_to receive(:reset_password_instructions)
      # login_for_test(
      #   permissions: [Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])]
      # )
      post "/api/v2/users/#{user.id}/password-reset-request", params: { user: { password_reset: true } }
      expect(response).to have_http_status(401)
    end

    it 'returns a 403 if the current user is not authorized to update this user' do
      expect(Devise::Mailer).not_to receive(:reset_password_instructions)
      login_for_test(
        permissions: [Permission.new(resource: Permission::USER, actions: [Permission::READ])]
      )
      post "/api/v2/users/#{user.id}/password-reset-request", params: { user: { password_reset: true } }
      expect(response).to have_http_status(403)
    end
  end

  describe 'POST /api/v2/users/password-reset' do
    let(:reset_password_token) { user.send(:set_reset_password_token) }
    let(:authorization_token) { response.headers['Authorization'].split(' ')[1] }
    let(:token_cookie) { response.cookies['primero_token'] }
    let(:json) { JSON.parse(response.body) }

    context 'with valid token' do
      before(:each)   do
        params = {
          user: {
            password: new_password, password_confirmation: new_password,
            reset_password_token: reset_password_token
          }
        }
        post '/api/v2/users/password-reset', params: params
      end

      it 'resets the password given the right token' do
        expect(response).to have_http_status(200)
        expect(user.reload.valid_password?(new_password)).to be_truthy
      end

      it 'logs the user in' do
        expect(authorization_token).to be_present
        expect(token_cookie).to be_present
        expect(json['id']).to eq(user.id)
        expect(json['user_name']).to eq(user.user_name)
        expect(json['token']).to eq(token_cookie)
      end
    end

    context 'with invalid token' do
      it 'returns a 422 code' do
        params = {
          user: {
            password: new_password, password_confirmation: new_password,
            reset_password_token: 'faketoken'
          }
        }
        post '/api/v2/users/password-reset', params: params

        expect(response).to have_http_status(422)
        expect(user.reload.valid_password?(new_password)).to be_falsey
      end

      it 'throttles requests after 10 attempts per minute' do
        Rack::Attack.reset!
        params = {
          user: {
            password: new_password, password_confirmation: new_password,
            reset_password_token: 'faketoken'
          }
        }
        11.times { post '/api/v2/users/password-reset', params: params }

        expect(response).to have_http_status(429)
        Rack::Attack.reset!
      end
    end

    context 'with password mismatch' do
      it 'returns a 422 code' do
        params = {
          user: {
            password: new_password, password_confirmation: "#{new_password}**",
            reset_password_token: reset_password_token
          }
        }
        post '/api/v2/users/password-reset', params: params

        expect(response).to have_http_status(422)
        expect(user.reload.valid_password?(new_password)).to be_falsey
      end
    end
  end
end
