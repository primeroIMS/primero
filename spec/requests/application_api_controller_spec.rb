# frozen_string_literal: true

require 'rails_helper'

describe ApplicationApiController, type: :request do
  before(:each) do
    clean_data(SystemSettings, CodeOfConduct)
    CodeOfConduct.create!(
      title: 'Code of conduct test',
      content: 'Some content',
      created_by: 'test_user',
      created_on: DateTime.now
    )
    SystemSettings.create!
  end

  after(:all) do
    clean_data(SystemSettings, CodeOfConduct)
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

  describe 'Default security headers on API calls' do
    it 'sets the X-Content-Type-Options: nosniff header' do
      login_for_test
      get '/api/v2/system_settings'

      expect(response.headers['X-Content-Type-Options']).to eq('nosniff')
    end
  end

  describe 'HTTP Basic Auth' do
    let(:user_name) { 'testuser' }
    let(:password) { 'testuserpassw0rd!' }
    let(:basic_auth) { Base64.encode64("#{user_name}:#{password}") }

    before(:each) do
      clean_data(User, Role)
      role = Role.new(name: 'Test Role 1', unique_id: 'test-role-1',
                      permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])])
      role.save(validate: false)
      @user = User.new(user_name: user_name, password: password, password_confirmation: password, role: role)
      @user.save(validate: false)
    end

    it 'works!' do
      get '/api/v2/cases', headers: { 'Authorization' => "Basic #{basic_auth}" }

      expect(response).to have_http_status(200)
    end

    after(:each) { clean_data(User, Role) }
  end
end
