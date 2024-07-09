# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Validate basic Primero health: in this case being able to access core dependencies
class HealthCheckService
  BACKENDS = %w[database solr server api].freeze
  class << self
    def healthy?(backend = nil)
      return send("#{backend}_accessible?") if BACKENDS.include?(backend)

      database_accessible? && solr_accessible?
    end

    def server_accessible?
      true
    end

    def database_accessible?
      ActiveRecord::Base.connection.execute('SELECT 1;')
    rescue ActiveRecord::StatementInvalid, PG::ConnectionBad, ActiveRecord::ConnectionNotEstablished
      false
    end

    def solr_accessible?
      return true unless Rails.configuration.solr_enabled

      Sunspot.session.session.rsolr_connection.head('admin/ping').response[:status] == 200
    rescue RSolr::Error::ConnectionRefused
      false
    end

    def api_accessible?
      !SystemSettings.locked_for_configuration_update?
    end
  end
end
