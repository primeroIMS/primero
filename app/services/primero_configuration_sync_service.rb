# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Write to another instance of Primero.
# Expect the following environment variables to be set:
# PRIMERO_PROMOTE_CONFIG_PROD_HOST, PRIMERO_PROMOTE_CONFIG_PROD_PORT, PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH
# The basic auth variable must be in the format username:password
class PrimeroConfigurationSyncService
  ENV_PREFIX = 'PRIMERO_PROMOTE_CONFIG_PROD_'

  attr_accessor :connector, :connectors

  class << self
    def instance
      @instance ||= build.freeze
    end

    def build
      new.tap do |s|
        s.connectors = ApiConnector::PrimeroConfigurationConnector.build_connectors(prefix: ENV_PREFIX)
      end
    end

    def sync!(record)
      instance.sync!(record)
    end
  end

  def sync!(record)
    connectors.each do |connector|
      Rails.logger.info("[sync][config]['host'] #{connector.connection.options['host']}")
      sync_response = connector.sync(record)

      Rails.logger.info("[sync][response][status] #{sync_response[:status]}")
    rescue StandardError => e
      puts e
      next
    end
  end
end
