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

  describe '.beanstalkd_accessible?' do
    before do
      @original_queue = Rails.configuration.active_job[:queue_adapter]
      Rails.configuration.active_job[:queue_adapter] = :backburner
    end

    it 'returns false if Beanstalkd is not connected' do
      # Backburner::Connection.new(Backburner.configuration.beanstalk_url)
      expect(HealthCheckService.beanstalkd_accessible?).to be_falsey
    end

    after do
      Rails.configuration.active_job[:queue_adapter] = @original_queue
    end
  end
end
