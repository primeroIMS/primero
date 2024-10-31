# frozen_string_literal: true

class SendRapidproMessagesJob < ApplicationJob
  queue_as :mailer
  def perform(message_id)
    message = Message.find(message_id)
    recipients = message.recipients
    valid_urns = recipients.where.not(rapidpro_urn: nil).where.not(rapidpro_urn: '')
    connector = RapidproConnectorService.instance
    connector.send_message_bulk(valid_urns, message.body)
  end
end
