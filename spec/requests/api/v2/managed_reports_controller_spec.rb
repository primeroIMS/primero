# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::ManagedReportsController, type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/managed_report' do
    it 'list the managed_report' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions:
            [
              Permission::VIOLATION_REPORT,
              Permission::GBV_STATISTICS_REPORT
            ])
        ]
      )

      get '/api/v2/managed_reports'
      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
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
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::GBV_STATISTICS_REPORT])
        ]
      )

      get '/api/v2/managed_reports/gbv_statistics?subreport=incidents'

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq('gbv_statistics')
      expect(json['data'].keys).to match_array(%w[id name description module_id report_data subreports])
    end

    it 'fetch violations managed_report with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::VIOLATION_REPORT])
        ]
      )

      get '/api/v2/managed_reports/violations?subreport=killing'

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq('violations')
      expect(json['data'].keys).to match_array(%w[id name description module_id subreports report_data])
      expect(json['data']['report_data']['killing']['data'].keys).to match_array(
        %w[children perpetrators reporting_location attack_type received_response]
      )
      expect(json['data']['report_data']['killing']['metadata'].keys).to match_array(
        %w[lookups order table_type display_graph indicators_subcolumns indicators_rows]
      )
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])

      get '/api/v2/managed_reports/violations'

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

  describe 'GET /api/v2/managed_reports/export' do
    it 'fetch the correct export data with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::MANAGED_REPORT, actions: [Permission::GBV_STATISTICS_REPORT])
        ]
      )

      get '/api/v2/managed_reports/export?id=gbv_statistics&subreport=incidents'

      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq('success')
      expect(json['data']['export_file_url'].starts_with?('/rails/active_storage/blobs/')).to be_truthy
      expect(json['data']['export_file_url'].ends_with?(json['data']['export_file_name'])).to be_truthy

      get(json['data']['export_file_url'])

      expect(response).to have_http_status(302)
    end

    it 'refuses unauthorized access' do
      login_for_test(permissions: [])

      get '/api/v2/managed_reports/export?id=gbv_statistics&subreport=incidents'

      expect(response).to have_http_status(403)
    end
  end
end
