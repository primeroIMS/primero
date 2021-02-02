# frozen_string_literal: true

# Registers a record event webhook
class Webhook < ApplicationRecord
  CREATE = 'create'
  UPDATE = 'update'
  API_KEY = 'api_key'
  BASIC_AUTH = 'basic_auth'

  validates  :events, :url, :role_unique_id, presence: true

  # TODO: Maybe make this a singleton? Cache?
  def self.webhooks_for(record, action)
    event = "#{record.class.parent_form}.#{action}"
    where('events @> :event', event: event)
  end

  def auth_secret
    return unless auth_secret_encrypted.present?

    EncryptionService.decrypt(auth_secret_encrypted)
  end

  # TODO: This can be multithreaded and async
  def send(record)
    connector.update(record)
  end

  def auth_secret=(secret)
    return unless secret.present?

    self.auth_secret_encrypted = EncryptionService.encrypt(secret)
  end

  def connector
    # TODO: Make the connector a singleton
    return @connector if @connector

    options = {
      'webhook_url' => url,
      'webhook_role_unique_id' => 'role_unique_id'
    }
    options = options.merge(auth_type => auth_secret) if auth_type.present?
    @connector = ApiConnector::WebhookConnector.new(options)
  end
end
