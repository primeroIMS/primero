# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ReportsController, type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/managed_report' do
    it 'list the managed_report' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::VIOLATION_REPORT])
        ]
      )

      get '/api/v2/managed_reports'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(1)
    end

    it 'returns an empty managed_report set if no explicit managed_report authorization' do
      login_for_test(permissions: [])

      get '/api/v2/managed_reports'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(0)
    end
  end

  describe 'GET /api/v2/managed_reports/:id', search: true do
    it 'fetch the correct managed_report with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::VIOLATION_REPORT])
        ]
      )

      get '/api/v2/managed_reports/violations_report'

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq('violations_report')
      expect(json['data'].keys).to match_array(%w[id name description module_id subreports])
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])

      get '/api/v2/managed_reports/violations_report'

      expect(response).to have_http_status(403)
    end

    it 'returns a 422 when trying to fetch a report with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::VIOLATION_REPORT])
        ]
      )
      get '/api/v2/managed_reports/thisdoesntexist'

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/managed_reports/thisdoesntexist')
    end
  end
end
