# frozen_string_literal: true

# Abstract superclass for user identity connectors
class IdentitySync::AbstractConnector
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
    return {} unless syncable?(user)

    if new?(user)
      create(user)
    elsif relevant_updates?(user)
      update(user)
    else
      {}
    end
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

  def syncable?(user)
    # Only if the user's IDP is configured to sync with this connector
    identity_sync_connector = user&.identity_provider&.configuration&.dig('identity_sync_connector')
    identity_sync_connector == self.class.name.demodulize
  end

  def new?(user)
    sync_metadata = user&.identity_provider_sync&.dig(id)
    !sync_metadata&.dig('synced_on')
  end

  def relevant_updates?(_user)
    true
  end
end