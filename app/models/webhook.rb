# frozen_string_literal: true

# Registers a record event webhook
class Webhook < ApplicationRecord
  CREATE = 'create'
  UPDATE = 'update'
  POST = 'post'
  API_KEY = 'api_key'
  BASIC_AUTH = 'basic_auth'

  validates  :events, :url, :role_unique_id, presence: true

  def self.webhooks_for(record, action)
    event = "#{record.class.parent_form}.#{action}"
    where('events @> :event', event: event.to_json)
  end

  # TODO: This can be multithreaded and async
  def post(record)
    connector.update(record)
  end

  def auth_secret
    return unless auth_secret_encrypted.present?

    EncryptionService.decrypt(auth_secret_encrypted)
  end

  def auth_secret=(secret)
    return unless secret.present?

    self.auth_secret_encrypted = EncryptionService.encrypt(secret)
  end

  def connector
    @connector ||= WebhookConnectorService.get(self)
  end
end
