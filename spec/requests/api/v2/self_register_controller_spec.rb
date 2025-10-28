# frozen_string_literal: true

# Copyright (c) 2014 - 2025rspe UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::SelfRegisterController, type: :request do
  before :each do
    clean_data(User, Role, Agency, SystemSettings, UserGroup)

    agency = Agency.create!(
      unique_id: 'agency_1',
      agency_code: 'agency1',
      order: 1,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      services: %w[services_a services_b],
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
      description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )

    Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::CASE,
          actions: [Permission::MANAGE]
        )
      ]
    )

    UserGroup.create!(name: 'Group1')

    @system_settings = SystemSettings.create(
      registration_streams: [
        {
          unique_id: 'primero',
          role: 'test-role-1',
          user_category: 'tier-1',
          user_groups: ['Group1'],
          agency: agency.unique_id
        }
      ]
    )

    @params = {
      full_name: 'Test User 1',
      user_name: 'test_user_1',
      email: 'test_user_1@localhost.com',
      locale: 'en',
      data_processing_consent_provided: true,
      registration_stream: 'primero'
    }
  end

  let(:json) { JSON.parse(response.body) }

  describe 'POST /api/v2/users/self-register' do
    it 'creates a new user' do
      Primero::Application.config.allow_self_registration = true
      post '/api/v2/users/self-register', params: { user: @params }, as: :json
      expect(response).to have_http_status(201)
      expect(User.find_by(user_name: 'test_user_1').self_registered).to eq(true)
    end

    it 'returns 422 if user_name or email is not unique' do
      Primero::Application.config.allow_self_registration = true
      post '/api/v2/users/self-register', params: { user: @params }, as: :json
      post '/api/v2/users/self-register', params: { user: @params }, as: :json
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/self-register')
      expect(json['errors'][0]['detail']).to eq('user_name')
      expect(json['errors'][0]['message']).to eq(['errors.models.user.user_name_uniqueness'])
      expect(json['errors'][1]['resource']).to eq('/api/v2/users/self-register')
      expect(json['errors'][1]['detail']).to eq('email')
      expect(json['errors'][1]['message']).to eq(['errors.models.user.email_uniqueness'])
      expect(response).to have_http_status(422)
    end

    it 'returns 422 if params are missing' do
      Primero::Application.config.allow_self_registration = true
      post '/api/v2/users/self-register', params: { user: @params.except(:user_name) }, as: :json
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/self-register')
      expect(json['errors'][0]['detail']).to eq('user_name')
      expect(json['errors'][0]['message']).to eq(["can't be blank", 'errors.models.user.user_name'])
      expect(response).to have_http_status(422)
    end

    it 'returns 422 if data_processing_consent_provided is false' do
      Primero::Application.config.allow_self_registration = true
      post '/api/v2/users/self-register', params: { user: @params.merge(data_processing_consent_provided: false) },
                                          as: :json
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/self-register')
      expect(json['errors'][0]['detail']).to eq('data_processing_consent_provided_on')
      expect(json['errors'][0]['message']).to eq(['errors.models.user.data_processing_consent_provided_on'])
      expect(response).to have_http_status(422)
    end

    it 'returns 403 if self registration is not allowed' do
      Primero::Application.config.allow_self_registration = false
      post '/api/v2/users/self-register', params: { user: @params }, as: :json

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/users/self-register')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end

  after :each do
    clean_data(User, Role, Agency, SystemSettings, UserGroup)
  end
end
