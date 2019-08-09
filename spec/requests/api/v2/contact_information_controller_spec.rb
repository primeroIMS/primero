require 'rails_helper'

describe Api::V2::ContactInformationController, type: :request do
  before :each do
    ContactInformation.destroy_all
    SystemSettings.destroy_all
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
      age_ranges: {'primero' => ['0 - 5', '6 - 11', '12 - 17', '18+'], 'unhcr' => ['0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+']},
      primary_age_range: 'primero',
      location_limit_for_api: 150,
      welcome_email_text: 'Welcome to Primero')
  end
 
  let(:json) { JSON.parse(response.body) }
 
  describe "GET /api/v2/contact_information" do
    it 'list contact information' do
      get '/api/v2/contact_information'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(9)
      expect(json['data']['name']).to eq( @contact_info.name)
      expect(json['data']['organization']).to eq( @contact_info.organization)
      expect(json['data']['support_forum']).to eq( @contact_info.support_forum)
      expect(json['data']['system_version']).to eq(@system_settings.primero_version)
    end
  end

end
