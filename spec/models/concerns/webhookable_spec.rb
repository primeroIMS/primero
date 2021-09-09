# frozen_string_literal: true

require 'rails_helper'

describe Webhookable do
  before(:each) { clean_data(AuditLog, Child) }
  let(:case_record) { Child.create!(name: 'Test', age: 12, sex: 'male') }
  let(:webhook_url) { 'https://example.com/inbox/abc123' }

  describe '.log_sync_status' do
    it 'logs a synced status' do
      expect(AuditLog.count.zero?).to be_truthy
      case_record.update(mark_synced: true, mark_synced_url: webhook_url)

      expect(case_record.data['mark_synced']).to be_nil
      expect(AuditLog.count).to eq(1)
      send_log = AuditLog.first
      expect(send_log.resource_url).to eq(webhook_url)
      expect(send_log.webhook_status).to eq(AuditLog::SYNCED)
    end

    it 'logs a not_found status' do
      expect(AuditLog.count.zero?).to be_truthy
      case_record.update(mark_synced_status: 'not_found', mark_synced: true, mark_synced_url: webhook_url)

      expect(case_record.data['mark_synced']).to be_nil
      expect(case_record.data['mark_synced_status']).to be_nil
      expect(AuditLog.count).to eq(1)
      send_log = AuditLog.first
      expect(send_log.resource_url).to eq(webhook_url)
      expect(send_log.webhook_status).to eq(AuditLog::NOT_FOUND)
    end

    it 'logs a failed status' do
      expect(AuditLog.count.zero?).to be_truthy
      case_record.update(mark_synced_status: 'failed', mark_synced: true, mark_synced_url: webhook_url)

      expect(case_record.data['mark_synced']).to be_nil
      expect(case_record.data['mark_synced_status']).to be_nil
      expect(AuditLog.count).to eq(1)
      send_log = AuditLog.first
      expect(send_log.resource_url).to eq(webhook_url)
      expect(send_log.webhook_status).to eq(AuditLog::FAILED)
    end

    it 'if no attributes are being set there is not AuditLog entry' do
      expect(AuditLog.count.zero?).to be_truthy
      case_record.update(name: 'Another name')
      expect(AuditLog.count.zero?).to be_truthy
    end
  end

  describe 'webhook statuses' do
    let(:webhook_url2) { "#{webhook_url}2" }
    let(:timestamp1) { DateTime.new(2021, 1, 29, 1, 2, 0) }
    let(:timestamp2) { DateTime.new(2021, 1, 29, 1, 3, 0) }
    let(:timestamp3) { DateTime.new(2021, 1, 29, 1, 4, 0) }

    before(:each) do
      AuditLog.create(
        record: case_record, resource_url: webhook_url, action: AuditLog::WEBHOOK,
        webhook_status: AuditLog::SENT, timestamp: timestamp1
      )
      AuditLog.create(
        record: case_record, resource_url: webhook_url, action: AuditLog::WEBHOOK,
        webhook_status: AuditLog::SYNCED, timestamp: timestamp2
      )
      AuditLog.create(
        record: case_record, resource_url: webhook_url2, action: AuditLog::WEBHOOK,
        webhook_status: AuditLog::SENT, timestamp: timestamp3
      )
    end

    describe '.webhook_status' do
      it 'displays the status of the latest transaction for every webhook' do
        webhook_status = case_record.webhook_status
        expect(webhook_status.keys).to match_array([webhook_url, webhook_url2])
        expect(webhook_status[webhook_url][:status]).to eq(AuditLog::SYNCED)
        expect(webhook_status[webhook_url][:timestamp]).to eq(timestamp2)
        expect(webhook_status[webhook_url2][:status]).to eq(AuditLog::SENT)
      end
    end

    describe '.synced_at' do
      it 'displays the timestamp of the latest webhook synced transaction' do
        expect(case_record.synced_at).to eq(timestamp2)
      end
    end

    describe '.sync_status' do
      let(:timestamp4) { DateTime.new(2021, 1, 29, 1, 5, 0) }

      it 'displays the status of the latest webhook synced transaction' do
        expect(case_record.sync_status).to eq(AuditLog::SENT)
      end

      it 'displays a "sending" status of the latest transaction without a real destination' do
        AuditLog.create(
          record: case_record, action: AuditLog::WEBHOOK, destination: AuditLog::WEBHOOK,
          webhook_status: AuditLog::SENDING, timestamp: timestamp4
        )
        expect(case_record.sync_status).to eq(AuditLog::SENDING)
      end
    end
  end
end
