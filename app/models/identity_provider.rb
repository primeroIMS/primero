# frozen_string_literal: true

require 'net/http'

class IdentityProvider < ApplicationRecord
  JWKS_LIFESPAN = 12.hours

  store_accessor :configuration,
    :client_id, :authorization_url, :identity_scope, :verification_url, :issuer

  class << self

    # Identity providers are set at deployment-time. They should not change.
    # We want to cache them since they are used on each HTTP request.
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
      json['keys']
    rescue
      []
    end

  end

end