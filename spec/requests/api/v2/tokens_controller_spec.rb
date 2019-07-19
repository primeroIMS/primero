require 'rails_helper'
require 'devise/jwt/test_helpers'

describe Api::V2::TokensController, type: :request do

  before :all do
    user_name = 'tokenstestuser'
    password = 'tokenstestuser0'
    @user = User.new(user_name: user_name, password: password, password_confirmation: password)
    @user.save(validate: false)
    @params = { user: { user_name: user_name, password: password } }
  end

  describe 'POST /api/v2/tokens' do

    let(:authorization_token) { response.headers['Authorization'].split(' ')[1] }
    let(:json) { JSON.parse(response.body) }
    let(:jwt_header) { decode_jwt(authorization_token) }

    it 'generates a new JWT token for valid credentials' do
      post '/api/v2/tokens', params: @params

      expect(response).to have_http_status(200)
      expect(authorization_token).to be_present
      expect(json['user_name']).to be_present
      expect(json['token']).to be_present
      expect(json['token']).to eq(authorization_token)
      expect(jwt_header['sub']).to be_present
    end

    it 'returns nothing for invalid credentials' do
      post '/api/v2/tokens', params: { user: { user_name: @user.user_name, password: 'incorrect' } }
      expect(response.status).to eq 401
    end

  end

  describe 'DELETE /api/v2/tokens' do

    it 'revokes the current token' do
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
      auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, @user)

      delete '/api/v2/tokens', headers: auth_headers

      # delete url
      expect(response).to have_http_status(200)
    end

  end

  after :all do
    @user.destroy
  end

  def decode_jwt(token)
    Warden::JWTAuth::TokenDecoder.new.call(token)
  end



end