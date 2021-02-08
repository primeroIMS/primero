# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::WebhookSyncsController, type: :request do
  include ActiveJob::TestHelper

  before(:each) { clean_data(Child) }
  let(:record) { Child.create(data: { name: 'Test' }) }

  describe 'POST /api/v2/:record/:id/sync' do
    it 'triggers a webhook send job' do
      login_for_test
      post "/api/v2/cases/#{record.id}/sync"

      expect(response).to have_http_status(204)
      expect(WebhookJob).to have_been_enqueued
        .with('case', record.id, Webhook::POST)
        .at_least(:once)
    end
  end
end
