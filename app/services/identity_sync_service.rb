# frozen_string_literal: true

# Publish creation or changes to Primero users to external systems.
# This is used by the UNICEF SaaS Azure Active Directory, but can be used for MDM,
# or other case management system integrations.
# The underlying connectors are configured via consistently named environment variables.
# The pattern is PRIMERO_IDENTITY_SYNC_<CONNECTOR_ID>_<PROPERTY>.
# Common properties are: HOST, PORT, TLS (client|truthy|falsey), TLS_CLIENT_KEY, TLS_CLIENT_CERT
class IdentitySyncService
  include Singleton

  attr_accessor :connectors

  class << self
    def instance
      @instance ||= build.freeze
    end

    def build
      instance = new
      instance.connectors = []
      IdentityProvider.all.each do |provider|
        connector_class = provider.identity_sync_connector
        next unless connector_class

        instance.connectors << connector_class.build_from_env
      end
      instance
    end

    def sync!(user, connector_id = nil)
      instance.sync!(user, connector_id)
    end
  end

  def sync!(user, connector_id = nil)
    connectors = connectors.select { |c| c.id == connector_id } if connector_id
    # TODO: This needs to be a deep merge
    updates = connectors.reduce({}) do |aggregate, connector|
      update = connector.sync(user)
      aggregate.merge(update)
    end
    user.update_attributes!(updates) if updates.present?
  end
end