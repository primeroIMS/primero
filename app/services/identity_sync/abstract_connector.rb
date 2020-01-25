# frozen_string_literal: true

module IdentitySync
  # Abstract superclass for user identity connectors
  class AbstractConnector
    attr_accessor :connection

    def self.build_from_env
      prefix = "PRIMERO_IDENTITY_SYNC_#{id.upcase}_"
      config = ENV.select { |key, _| key.start_with?(prefix) }
                  .transform_keys { |key| key.delete_prefix(prefix).downcase }
      new(config)
    end

    def self.id
      raise NotImplementedError
    end

    def id
      self.class.id
    end

    def initialize(options = {}); end

    def sync(user)
      return {} unless exportable?(user)

      new?(user) ? create(user) : update(user)
    end

    def fetch(_user)
      raise NotImplementedError
    end

    def create(_user)
      raise NotImplementedError
    end

    def update(_user)
      raise NotImplementedError
    end

    def exportable?(user)
      # Only if the user's IDP is configured to sync with this connector
      identity_sync_connector = user&.identity_provider&.configuration&.dig('identity_sync_connector')
      return false unless identity_sync_connector == self.class.name.demodulize

      # Only new users or users with changes on full name or status or idp
      sync_metadata = user&.identity_provider_sync&.dig(id)
      sync_metadata&.dig('perform_sync')
    end

    def new?(user)
      sync_metadata = user&.identity_provider_sync&.dig(id)
      !sync_metadata&.dig('synced_on')
    end
  end
end