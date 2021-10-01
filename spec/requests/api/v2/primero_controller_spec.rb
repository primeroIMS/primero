# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::PrimeroController, type: :request do
  before :each do
    clean_data(Agency)
    @agency1 = Agency.new(
      name: 'irc', agency_code: '12345', logo_icon: logo, logo_full: logo,
      logo_enabled: true
    )
    @agency1.save!
    Agency.create!(name: 'unicef', agency_code: '23456')
    @agency2 = Agency.create!(
      unique_id: 'agency_2',
      agency_code: 'agency2',
      order: 2,
      telephone: '12565742',
      logo_enabled: false,
      disabled: false,
      pdf_logo_option: true,
      logo_icon: logo,
      logo_full: logo,
      name_i18n: { en: 'Nationality', es: 'Nacionalidad' }
    )
    I18n.available_locales = %i[en ar fr es]
  end

  after(:each) { clean_data(Agency) }

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/primero' do
    before { get '/api/v2/primero' }

    it 'displays public information without authentication' do
      expect(response).to have_http_status(200)
      expect(json['data']['sandbox_ui']).to eq(false)
      expect(json['data']['config_ui']).to eq('full')
      expect(json['data']['locales']).to contain_exactly('en', 'ar', 'fr', 'es')
    end

    it 'lists only the agencies with logos' do
      expect(json['data']['agencies'].size).to eq(1)
      expect(json['data']['agencies'][0]['name']).to eq(@agency1.name)
    end

    it 'lists only the agencies with logos options' do
      expect(json['data']['agencies_logo_options'].size).to eq(1)
      expect(json['data']['agencies_logo_options'][0]['name']).to eq(@agency2.name)
    end
  end
end
