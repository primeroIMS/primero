# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::PrimeroController, type: :request do
  before :each do
    clean_data(Agency)
    @agency1 = Agency.new(
      name: 'irc', agency_code: '12345', logo_icon: FilesTestHelper.logo, logo_full: FilesTestHelper.logo, logo_enabled: true
    )
    @agency1.save!
    Agency.create!(name: 'unicef', agency_code: '23456')
  end

  after(:each) { clean_data(Agency) }

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/primero' do
    before { get '/api/v2/primero' }

    it 'displays public information without authentication' do
      expect(response).to have_http_status(200)
      expect(json['data']['sandbox_ui']).to eq(false)
    end

    it 'lists only the agencies with logos' do
      expect(json['data']['agencies'].size).to eq(1)
      expect(json['data']['agencies'][0]['name']).to eq(@agency1.name)
    end
  end
end
