# frozen_string_literal: true

require 'rails_helper'

describe ApplicationApiController, type: :request do
  before(:each) do
    clean_data(SystemSettings)
    SystemSettings.create!
  end

  describe 'Configuration update lock' do
    before(:each) { SystemSettings.lock_for_configuration_update }
    let(:json) { JSON.parse(response.body) }

    it 'the APIs respond with a 503 code' do
      %w[agencies cases system_settings].each do |resource|
        login_for_test
        get "/api/v2/#{resource}"

        expect(response).to have_http_status(503)
      end
    end

    it 'the APIs respond with a 200 code when unlocked' do
      SystemSettings.unlock_after_configuration_update
      %w[cases system_settings].each do |resource|
        login_for_test

        get "/api/v2/#{resource}"
        expect(response).to have_http_status(200)
      end
    end

    it 'the APIs respond with an expected error code when unlocked' do
      SystemSettings.unlock_after_configuration_update
      login_for_test

      get '/api/v2/agencies'
      expect(response).to have_http_status(403)
    end

    it 'the error response describes the reason and provides a retry time' do
      login_for_test
      get '/api/v2/agencies'

      expect(response).to have_http_status(503)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['message']).to eq('Service Unavailable')
      expect(json['errors'][0]['detail']).to eq('Retry-After: 60')
      expect(response.headers['Retry-After']).to eq('60')
    end
  end
end
