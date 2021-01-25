# frozen_string_literal: true

require 'net/http'

# Encapsulates the configuration for an external identity provider that issues JWT tokens.
# If an identity provider is federated behind a service like Azure B2C,
# Primero still needs to know about it. In the case where we have federation,
# the client_id, authorization_url, and verification_url may be the same across multiple IDPs,
# but we still expect the issuer field (corresponding to the JWT iss claim) to be different for each provider.
class IdentityProvider < ApplicationRecord
  JWKS_LIFESPAN = 12.hours
  PRIMEROIMS = 'primeroims'
  B2C = 'b2c'

  store_accessor :configuration,
                 :client_id, :authorization_url, :identity_scope,
                 :verification_url, :issuer, :user_domain, :domain_hint

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
    return unless connector_type

    "ApiConnector::#{connector_type}".constantize
  rescue NameError
    nil
  end

  def connector_type
    configuration&.[]('identity_sync_connector')
  end

  def sync_identity?
    connector_type.present?
  end

  # Indicates if this is the default Primero SaaS identity provider.
  def primero?
    unique_id == PRIMEROIMS && domain_hint == PRIMEROIMS && provider_type == B2C
  end

  # This is used to extract the user_id from the OAuth 2 redirect
  # TODO: Only Azure B2C is currently supported.
  #       Refactor this method when we start supporting other OpenId Connect services
  def user_from_request(request)
    return unless provider_type == B2C

    token_string = request.cookies['msal.idtoken']
    return unless token_string

    token = IdpToken.build(token_string)
    user = token.user if token.valid?
    user unless user&.disabled
  end
end
