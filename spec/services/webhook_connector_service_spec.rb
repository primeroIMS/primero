# frozen_string_literal: true

require 'rails_helper'

describe WebhookConnectorService do
  before { clean_data(Webhook) }
  let(:webhook1) { Webhook.create!(events: %w[case.create], url: 'https://x.y/1', role_unique_id: 'role1') }
  let(:webhook2) do
    Webhook.create!(
      events: %w[case.create incident.update], url: 'https://x.y/2', role_unique_id: 'role2'
    )
  end
  let(:connector1) { double('ApiConnector::WebhookConnector') }
  let(:service) do
    WebhookConnectorService.new.tap do |s|
      s.connectors = { webhook1.id => connector1 }
    end
  end

  describe 'get' do
    it 'fetches an existing connector if it is already instantiated for this webhook' do
      expect(service.get(webhook1)).to eq(connector1)
    end

    it 'build a new connector if one does not exist for this webhook' do
      connector2 = service.get(webhook2)
      expect(connector2.webhook_url).to eq(webhook2.url)
      expect(connector2.role_unique_id).to eq(webhook2.role_unique_id)
    end
  end
end
