# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Connector that sends configuration data to another instance of Primero.
# For now connection parameters for these endpoints is configured through environment variables.
# TODO: This can be refactored and merged with the PrimeroConnector.
#       The params should really be methods on the model classes
class ApiConnector::PrimeroConfigurationConnector < ApiConnector::PrimeroConnector
  RETRY_LIMIT = 3

  def new?(configuration)
    with_retry(RETRY_LIMIT) do
      status, _response = connection.get(configuration.api_path)
      status == 404
    end
  end

  # We don't actually want to update a remote configuration record, only create
  def update(_configuration)
    {}
  end

  def params(configuration)
    attributes = %w[id name description version primero_version data]
    { data: configuration.attributes.slice(*attributes) }
  end

  # TODO: This can be moved to ApiConnector::AbstractConnector.
  # TODO: Keep it here for now because it is the only place that use multiple host connections
  def self.build_connectors(options = {})
    config_connectors(options).map do |config|
      ApiConnector::PrimeroConfigurationConnector.new(config)
    end
  end

  def self.config_connectors(opts = {})
    hosts_config(opts).reduce([]) do |result, config|
      if config['basic_auth'].nil? && config['basic_auth_secret'].present?
        config['basic_auth'] = ENV.fetch(config['basic_auth_secret'], nil)
        config.delete('basic_auth_secret')
      end
      next(result) if config['basic_auth'].blank?

      result << config.with_indifferent_access
    end
  end

  def self.hosts_config(opts = {})
    (config_connector_from_env(opts) + SystemSettings.current.primero_promote_config).uniq do |config|
      config['host']
    end
  end

  def self.config_connector_from_env(options = {})
    prefix = options[:prefix] || default_env_prefix

    [ENV.select { |key, _| key.start_with?(prefix) }
        .transform_keys { |key| key.delete_prefix(prefix).downcase }
        .with_indifferent_access]
  end
end
