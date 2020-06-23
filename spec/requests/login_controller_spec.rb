# frozen_string_literal: true

require 'rails_helper'

# TODO: Temporarily skipping this test until we sort out the b2c redirects
xdescribe LoginController, type: :request do
  describe 'B2C redirect page' do
    before do
      @idp = IdentityProvider.create(
        provider_type: 'b2c',
        client_id: 'abc123',
        authorization_url: 'https://sample.com/authorization_url'
      )
      get '/login/b2c'
    end

    it 'renders the B2C identity template' do
      expect(response).to render_template('login/b2c')
      expect(response).to render_template('layouts/identity')
    end

    it 'returns the B2C identity provider params' do
      expect(response.body).to include("providerType: 'b2c'")
      expect(response.body).to include("providerClientId: '#{@idp.client_id}'")
      expect(response.body).to include("authorizationUrl: '#{@idp.authorization_url}'")
    end
  end

  describe 'Invalid identity page' do
    before { get '/login/foo' }

    it 'returns a 404 for an unknown identity provider' do
      expect(response).to have_http_status(404)
    end

    it 'renders a 404 Not Found' do
      expect(response.body).to include('404 Not Found')
    end
  end

  after :each do
    clean_data(IdentityProvider)
  end
end
