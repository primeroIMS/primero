# frozen_string_literal: true

require 'rails_helper'

describe Webhook do
  before(:each) { clean_data(Webhook) }

  describe 'auth_secret' do
    let(:secret_encrypted) { 'secret_encrypted' }
    let(:secret) { 'secret' }
    let(:webhook) do
      Webhook.create!(
        events: %w[case.create], url: 'https://sample.com/inbox/1', role_unique_id: 'role-test',
        auth_secret: secret
      )
    end

    before(:each) do
      allow(EncryptionService).to receive(:encrypt).with(secret).and_return(secret_encrypted)
      allow(EncryptionService).to receive(:decrypt).with(secret_encrypted).and_return(secret)
    end

    it 'encrypts the auth secret before saving' do
      expect(webhook.auth_secret_encrypted).to eq(secret_encrypted)
    end

    it 'decrypts the auth secret from the database' do
      webhook_reloaded = Webhook.find(webhook.id)
      expect(webhook_reloaded.auth_secret).to eq(secret)
    end
  end

  describe 'webhooks_for' do
    let(:record) { Child.new }
    let(:webhook1) { Webhook.create!(events: %w[case.create], url: 'https://x.y/1', role_unique_id: 'role') }
    let(:webhook2) do
      Webhook.create!(events: %w[case.create incident.update], url: 'https://x.y/2', role_unique_id: 'role')
    end
    let(:webhook3) do
      Webhook.create!(events: %w[case.update incident.create], url: 'https://x.y/3', role_unique_id: 'role')
    end

    it 'fetches all webhooks for a specific record action' do
      webhook1 && webhook2 && webhook3
      expect(Webhook.webhooks_for(record, 'create')).to contain_exactly(webhook1, webhook2)
    end
  end
end
