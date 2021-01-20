# frozen_string_literal: true

# Write to another instance of Primero.
# Expect the following environment variables to be set:
# PRIMERO_PROMOTE_CONFIG_PROD_HOST, PRIMERO_PROMOTE_CONFIG_PROD_PORT, PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH
# The basic auth variable must be in the format username:password
class PrimeroConfigurationSyncService
  ENV_PREFIX = 'PRIMERO_PROMOTE_CONFIG_PROD_'

  attr_accessor :connector

  class << self
    def instance
      @instance ||= build.freeze
    end

    def build
      new.tap do |s|
        s.connector = ApiConnector::PrimeroConfigurationConnector.build_from_env(prefix: ENV_PREFIX)
      end
    end

    def sync!(record)
      instance.sync!(record)
    end
  end

  def sync!(record)
    connector.sync(record)
  end
end
