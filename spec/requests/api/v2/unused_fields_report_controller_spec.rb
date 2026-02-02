# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::UnusedFieldsReportController, type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/unused_fields_report/current' do
    it 'returns the current Unused Fields Report with status 200' do
      system_settings = SystemSettings.new
      system_settings.unused_fields_report_file.attach(io: StringIO.new, filename: 'unused_fields_report')
      system_settings.save!

      SystemSettings.stub(:current).and_return(system_settings)

      login_for_test(permissions: [Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])])

      get '/api/v2/unused_fields_report/current'

      expect(response).to have_http_status(200)
      expect(json['data']['unused_fields_report']).not_to be_nil
    end

    it 'returns 403 if user only have read permission' do
      login_for_test

      get '/api/v2/unused_fields_report/current'

      expect(response).to have_http_status(403)
      expect(json['errors'][0]['resource']).to eq('/api/v2/unused_fields_report/current')
      expect(json['errors'][0]['message']).to eq('Forbidden')
    end
  end
end
