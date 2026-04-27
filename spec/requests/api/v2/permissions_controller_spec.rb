# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::PermissionsController, type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/permissions' do
    it 'lists available permissions without explicit authorization' do
      login_for_test(permissions: [])

      get '/api/v2/permissions'

      expect(response).to have_http_status(200)
      expect(json['data']['management']).to eq(Permission.management)
      expect(json['data']['resource_actions']).to eq(Permission::RESOURCE_ACTIONS)
    end
  end
end
