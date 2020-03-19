# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ContactInformationController, type: :request do
  before :each do
    clean_data(SystemSettings, ContactInformation)
    @contact_info = ContactInformation.create(
      name: 'Test contact info',
      organization: 'UNICEF',
      phone: '+1 234 5678 9000',
      location: 'Location',
      other_information: 'Other info',
      support_forum: 'https://community.primero.org/',
      email: 'contact@primero.org',
      position: 'Case worker'
    )
    @system_settings = SystemSettings.create(
      default_locale: 'en',
      case_code_separator: '-',
      primero_version: '2.0.0',
      age_ranges: {
        'primero' => ['0 - 5', '6 - 11', '12 - 17', '18+'],
        'unhcr' => ['0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+']
      },
      primary_age_range: 'primero',
      location_limit_for_api: 150,
      welcome_email_text: 'Welcome to Primero'
    )
    SystemSettings.current(true)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/contact_information' do
    it 'list contact information' do
      get '/api/v2/contact_information'
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq(@contact_info.name)
      expect(json['data']['organization']).to eq(@contact_info.organization)
      expect(json['data']['support_forum']).to eq(@contact_info.support_forum)
      expect(json['data']['system_version']).to eq(@system_settings.primero_version)
    end
  end

  describe 'PATCH /api/v2/contact_information' do
    it 'updates the current contact_information with 200' do
      params = {
        data: {
          name: 'name_test',
          organization: 'organization_test',
          phone: 'phone_test',
          location: 'location_test',
          other_information: 'other_information_test',
          support_forum: 'support_forum_test',
          email: 'email_test',
          position: 'position_test'
        }
      }
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::SYSTEM, actions: [Permission::MANAGE])
        ]
      )
      patch '/api/v2/contact_information', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@contact_info.id)
      expect(json['data'].except('id')).to eq(params[:data].stringify_keys)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test

      patch '/api/v2/contact_information', params: {}
      expect(response).to have_http_status(403)
      expect(json['errors'].count).to eq(1)
      expect(json['errors'][0]['message']).to eq('Forbidden')
      expect(json['errors'][0]['resource']).to eq('/api/v2/contact_information')
    end
  end
end
