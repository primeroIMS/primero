# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Abstract superclass for user identity connectors
class ApiConnector::AbstractConnector
  RETRY_DELAY = 5 # Retry every 5 seconds
  RETRY_LIMIT = 3 #  Attempt limit
  attr_accessor :connection

  def self.build_from_env(options = {})
    prefix = options[:prefix] || default_env_prefix
    config = ENV.select { |key, _| key.start_with?(prefix) }
                .transform_keys { |key| key.delete_prefix(prefix).downcase }
                .with_indifferent_access
    new(config)
  end

  def self.id
    raise NotImplementedError
  end

  def id
    self.class.id
  end

  def self.default_env_prefix
    "PRIMERO_CONNECT_API_#{id.upcase}_"
  end

  def initialize(options = {})
    default_headers = {
      'Content-Type' => 'application/json',
      'cache-control' => 'no-cache'
    }
    self.connection = ApiConnector::Connection.new(options.deep_merge('default_headers' => default_headers))
  end

  def sync(record)
    return {} unless syncable?(record)

    if new?(record)
      create(record)
    elsif relevant_updates?(record)
      update(record)
    else
      {}
    end
  end

  def fetch(_record)
    raise NotImplementedError
  end

  def create(_record)
    raise NotImplementedError
  end

  def update(_record)
    raise NotImplementedError
  end

  def syncable?(_record)
    raise NotImplementedError
  end

  def new?(_record)
    raise NotImplementedError
  end

  def relevant_updates?(_record)
    true
  end

  def with_retry(retry_limit = RETRY_LIMIT, retry_delay = RETRY_DELAY)
    retry_limit.times do |attempt|
      return yield
    rescue Faraday::ConnectionFailed,
           Faraday::TimeoutError,
           Faraday::SSLError => e
      raise e if attempt == retry_limit - 1

      sleep(retry_delay)
      Rails.logger.warn('Conenction Failed, Retrying.')
    end
  end
end
