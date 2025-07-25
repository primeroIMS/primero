# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe IdpToken do
  before do
    clean_data(User, IdentityProvider)
    @idp = IdentityProvider.create!(
      name: 'primero',
      unique_id: 'primeroims',
      provider_type: 'b2c',
      configuration: {
        client_id: '123',
        issuer: 'https://primeroims.org',
        verification_url: 'https://primeroims.org/verify'
      }
    )
    @user = User.new(
      user_name: 'test@primero.org',
      identity_provider: @idp
    )
    @user.save(validate: false)
    @user2 = User.new(
      user_name: 'UserTest@primero.org',
      identity_provider: @idp
    )
    @user2.save(validate: false)
    @rsa_private = OpenSSL::PKey::RSA.generate 2048
    @rsa_public = @rsa_private.public_key
    @jwk = JWT::JWK.new(@rsa_private)
    @jwks = { keys: [@jwk.export] }
    @header = { kid: @jwk.kid }
    @payload = { aud: '123', iss: 'https://primeroims.org', emails: ['test@primero.org'], nonce: 'abc123' }
    @payload_capital_letters = { aud: '123', iss: 'https://primeroims.org', emails: ['UserTest@primero.org'] }
    @valid_token = valid_token @payload
    @valid_token_capital_letters = JWT.encode @payload_capital_letters, @rsa_private, 'RS256', @header
    @invalid_token = JWT.encode @payload, OpenSSL::PKey::RSA.generate(2048), 'RS256', @header
  end

  describe '.decode_with_jwks' do
    it 'decodes a valid JWT token' do
      decoded_token = IdpToken.decode_with_jwks(@valid_token, [@idp], @jwks)
      expect(decoded_token.size).to eq(2)
      expect(decoded_token[0]['aud']).to eq('123')
    end

    it 'fails to decode a tampered JWT token' do
      expect do
        IdpToken.decode_with_jwks(@invalid_token, [@idp], @jwks)
      end.to raise_error(JWT::VerificationError)
    end
  end

  describe '.build' do
    it 'builds a valid JWT token from a decodable string' do
      allow(IdentityProvider).to receive(:jwks).and_return(@jwks)
      token = IdpToken.build(@valid_token)
      expect(token.valid?).to be_truthy
    end

    it "attempts to rebuild the JWKS for all of Primero's identity providers if it's missing a valid key" do
      stale_jwks = { keys: [JWT::JWK.new(OpenSSL::PKey::RSA.generate(2048)).export] }
      allow(IdentityProvider).to receive(:jwks).and_return(stale_jwks).and_return(@jwks)

      token = IdpToken.build(@valid_token)
      expect(token.valid?).to be_truthy
    end
  end

  describe '.user_name' do
    before :each do
      allow(IdentityProvider).to receive(:jwks).and_return(@jwks)
    end

    it 'safe navigation when email/emails undefined' do
      token = valid_token({ aud: '123', iss: 'https://primeroims.org' })
      user_name = IdpToken.build(token).user_name

      expect(user_name).to eq(nil)
    end

    it 'return email when emails not present' do
      token = valid_token({ aud: '123', iss: 'https://primeroims.org', email: 'test@primero.org' })
      user_name = IdpToken.build(token).user_name

      expect(user_name).to eq('test@primero.org')
    end

    it 'returns first email from array' do
      token = valid_token({ aud: '123', iss: 'https://primeroims.org', emails: ['test@primero.org'] })
      user_name = IdpToken.build(token).user_name

      expect(user_name).to eq('test@primero.org')
    end
  end

  describe '.user' do
    it 'extrapolates a real Primero user from the JWT token based on the email and issuer' do
      allow(IdentityProvider).to receive(:jwks).and_return(@jwks)
      user = IdpToken.build(@valid_token).user

      expect(user.user_name).to eq('test@primero.org')
    end
    context 'when email has capital letters' do
      it 'return the primero user' do
        allow(IdentityProvider).to receive(:jwks).and_return(@jwks)
        user = IdpToken.build(@valid_token_capital_letters).user

        expect(user.user_name).to eq('usertest@primero.org')
      end
    end
  end

  describe '.unique_id' do
    let(:token_with_nonce) { IdpToken.new.tap { |t| t.payload = { 'nonce' => 'nonce' } } }
    let(:token_with_jti_nonce) { IdpToken.new.tap { |t| t.payload = { 'nonce' => 'nonce', 'jti' => 'jti' } } }

    it 'uses the nonce when the jti claim is blank' do
      expect(token_with_nonce.unique_id).to eq('nonce')
    end

    it 'uses the jti when present' do
      expect(token_with_jti_nonce.unique_id).to eq('jti')
    end
  end

  describe '.activate!' do
    before(:each) { allow(IdentityProvider).to receive(:jwks).and_return(@jwks) }
    let(:token) { IdpToken.build(@valid_token) }

    it "creates an associated session with this token's unique id as the session_id" do
      token.activate!
      expect(token.session.session_id) == token.unique_id
    end
  end

  after :each do
    clean_data(User, IdentityProvider)
    Session.delete_all
  end

  private

  def valid_token(payload)
    JWT.encode payload, @rsa_private, 'RS256', @header
  end
end
