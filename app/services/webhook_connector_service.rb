# frozen_string_literal: true

# Produce singleton webhook connectors given a webhook.
# TODO: In the future we could be more efficient by creating a webhook connector for each destination host
class WebhookConnectorService
  attr_accessor :connectors

  class << self
    def instance
      @instance ||= build.freeze
    end

    def build
      new.tap do |service|
        service.connectors = {}
      end
    end

    def get(webhook)
      instance.get(webhook)
    end
  end

  def get(webhook)
    connector = connectors[webhook.id]
    return connector if connector

    options = {
      'webhook_url' => webhook.url,
      'webhook_role_unique_id' => webhook.role_unique_id
    }
    options = options.merge(webhook.auth_type => webhook.auth_secret) if webhook.auth_type.present?
    connectors[webhook.id] = ApiConnector::WebhookConnector.new(options)
  end
end
