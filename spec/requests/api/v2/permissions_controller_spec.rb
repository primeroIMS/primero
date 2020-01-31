require 'rails_helper'

describe Api::V2::PermissionsController, type: :request do

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/permissions' do
    it 'lists available permissions' do
      login_for_test(permissions: [Permission.new(resource: Permission::ROLE, actions: [Permission::WRITE])])

      get '/api/v2/permissions'

      expect(response).to have_http_status(200)
      expect(json['data']['management']).to eq(Permission.management)
      expect(json['data']['resource_actions']).to eq(Permission::RESOURCE_ACTIONS)
    end

    it "get a forbidden message if the user doesn't have write permission on roles" do
      login_for_test(permissions: [])

      get '/api/v2/permissions'

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['status']).to eq(403)
      expect(json['errors'][0]['resource']).to eq("/api/v2/permissions")
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end
end