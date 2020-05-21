# frozen_string_literal: true

# Validate basic Primero health: in this case being able to access core dependencies
class HealthCheckService
  BACKENDS = %w[database solr beanstalkd server].freeze
  class << self
    def healthy?(backend = nil)
      return send("#{backend}_accessible?") if BACKENDS.include?(backend)

      database_accessible? && solr_accessible? && beanstalkd_accessible?
    end

    def server_accessible?
      true
    end

    def database_accessible?
      ActiveRecord::Base.connection.execute('SELECT 1;')
    rescue ActiveRecord::StatementInvalid, PG::ConnectionBad
      false
    end

    def solr_accessible?
      Sunspot.session.session.rsolr_connection.head('admin/ping').response[:status] == 200
    rescue RSolr::Error::ConnectionRefused
      false
    end

    def beanstalkd_accessible?
      return true unless should_test_beanstalkd?

      connection = Backburner::Connection.new(Backburner.configuration.beanstalk_url)
      connection.connected?
    rescue Beaneater::NotConnected
      false
    ensure
      connection&.close
    end

    def should_test_beanstalkd?
      Rails.configuration.active_job[:queue_adapter] == :backburner
    end
  end
end
