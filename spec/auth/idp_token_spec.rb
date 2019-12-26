require 'rails_helper'

describe IdpToken do

  before do
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
    @rsa_private = OpenSSL::PKey::RSA.generate 2048
    @rsa_public = @rsa_private.public_key
    @jwk = JWT::JWK.new(@rsa_private)
    @jwks = { keys: [@jwk.export] }
    @header = { kid: @jwk.kid }
    @payload = { aud: '123', iss: 'https://primeroims.org', emails: ['test@primero.org'] }
    @valid_token = JWT.encode @payload, @rsa_private, 'RS256', @header
    @invalid_token = JWT.encode @payload, OpenSSL::PKey::RSA.generate(2048), 'RS256', @header
  end

  describe '.decode' do
    it 'decodes a valid JWT token' do
      decoded_token = IdpToken.decode(@valid_token, [@idp], @jwks)
      expect(decoded_token.size).to eq(2)
      expect(decoded_token[0]['aud']).to eq('123')
    end

    it 'fails to decode a tampered JWT token' do
      expect do
        IdpToken.decode(@invalid_token, [@idp], @jwks)
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

  describe '.user' do
    it 'extrapolates a real Primero user from the JWT token based on the email and issuer' do
      allow(IdentityProvider).to receive(:jwks).and_return(@jwks)
      user = IdpToken.build(@valid_token).user

      expect(user.user_name).to eq('test@primero.org')
    end
  end

  after :each do
    clean_data(User, IdentityProvider)
  end

end