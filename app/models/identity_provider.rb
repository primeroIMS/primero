# frozen_string_literal: true

require 'net/http'

# Encapsulates the configuration for an external identity provider that issues JWT tokens.
# If an identity provider is federated behind a service like Azure B2C,
# Primero still needs to know about it. In the case where we have federation,
# the client_id, authorization_url, and verification_url may be the same across multiple IDPs,
# but we still expect the issuer field (corresponding to the JWT iss claim) to be different for each provider.
class IdentityProvider < ApplicationRecord
  JWKS_LIFESPAN = 12.hours

  store_accessor :configuration,
                 :client_id, :authorization_url, :identity_scope,
                 :verification_url, :issuer, :user_domain

  class << self
    # Identity providers are set at deployment-time. They should not change.
    # We want to cache them since they are accessed on each HTTP request.
    # Make sure to recreate Primero processes if the IPDs ever change.
    def identity_providers
      @identity_providers ||= IdentityProvider.all.to_a
    end

    def jwks(rebuild = false)
      Rails.cache.fetch('identity_provider/jwks', expires_in: JWKS_LIFESPAN, force: rebuild) do
        { keys: rebuild_jwks }.with_indifferent_access
      end
    end

    def rebuild_jwks
      jwk_urls = identity_providers.map(&:verification_url).uniq
      jwk_urls.map { |url| fetch_jwks(url) }.flatten
    end

    def fetch_jwks(url)
      uri = URI(url)
      response = Net::HTTP.get(uri)
      json = JSON.parse(response)
      json['keys'] || []
    rescue StandardError
      # Net:HTTP has upwards of 50 different ways of breaking, and frankly we don't care.
      # If we can't fetch a valid JWKS from a url then so be it.
      []
    end
  end

  def identity_sync_connector
    connector_type = configuration['identity_sync_connector']
    return unless connector_type

    "IdentitySync::#{connector_type}".constantize
  rescue NameError
    nil
  end

  def sync_identity?
    configuration['identity_sync_connector'].present?
  end
end