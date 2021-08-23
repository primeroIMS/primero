# frozen_string_literal: true

require 'rails_helper'

describe HealthCheckService do
  describe 'database_accessible?' do
    it 'returns true if the database is connected' do
      expect(HealthCheckService.database_accessible?).to be_truthy
    end

    it 'returns false if the database is not connected' do
      allow(ActiveRecord::Base.connection).to receive(:execute).and_raise(ActiveRecord::StatementInvalid)

      expect(HealthCheckService.database_accessible?).to be_falsey
    end
  end

  describe '.solr_accessible?', search: true do
    it 'returns true if Solr is connected' do
      expect(HealthCheckService.solr_accessible?).to be_truthy
    end

    it 'returns false if Solr is not connected' do
      allow_any_instance_of(RSolr::Client).to receive(:head).and_raise(RSolr::Error::ConnectionRefused)

      expect(HealthCheckService.solr_accessible?).to be_falsey
    end
  end

  describe '.api_accessible?' do
    before do
      clean_data(SystemSettings)
      SystemSettings.create!
      SystemSettings.lock_for_configuration_update
    end

    it 'returns false if the configuration is updating' do
      expect(HealthCheckService.api_accessible?).to be_falsey
    end

    after { clean_data(SystemSettings) }
  end
end
