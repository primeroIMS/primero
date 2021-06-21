# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::WebhookSyncsController, type: :request do
  include ActiveJob::TestHelper

  before { clean_data(Child) }
  let(:record) { Child.create(data: { name: 'Test' }) }
  let(:json) { JSON.parse(response.body) }

  describe 'POST /api/v2/:record/:id/sync' do
    before do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SYNC_EXTERNAL])
        ]
      )
      post "/api/v2/cases/#{record.id}/sync", as: :json
    end

    it 'returns the current sync status' do
      expect(response).to have_http_status(200)
      expect(json['data']['record_id']).to eq(record.id)
      expect(json['data']['sync_status']).to eq(AuditLog::SENDING)
    end

    it 'triggers a webhook send job' do
      expect(WebhookJob).to have_been_enqueued
        .with('case', record.id, Webhook::POST)
        .at_least(:once)
    end
  end

  describe 'POST /api/v2/:record/:id' do
    let(:record) { Child.create(data: { name: 'Test' }) }
    let(:webhook_url) { 'https://example.com/inbox/abc123' }
    let(:permissions) {
      {
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::READ, Permission::CREATE,Permission::WRITE, Permission::SYNC_EXTERNAL]
          )
        ]
      }
    }
    let(:params) { { data: { mark_synced: true, mark_synced_url: webhook_url } } }

    before do
      login_for_test(
        permissions
      )
      patch "/api/v2/cases/#{record.id}", params: params, as: :json
    end

    it 'updated the sync_status' do
      login_for_test(
        permissions
      )
      get "/api/v2/cases/#{record.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['sync_status']).to eq(AuditLog::SYNCED)
    end
  end
end
