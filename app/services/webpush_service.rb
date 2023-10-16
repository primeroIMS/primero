# frozen_string_literal: true

# Service to send a WebPush Notification
class WebpushService
  MAX_ATTEMPTS = 3

  def self.send_notifications(user, message)
    WebpushService.new.send_notifications(user, message)
  end

  def send_notifications(user, message)
    subscriptions = user_subscriptions(user)
    return if subscriptions.blank? || message.blank?

    subscriptions.each do |subscription|
      if subscription.expired?
        Rails.logger.info('Notification not sent. Subscription expired')
        next
      end

      handle_send_push(subscription, message)
    end
  end

  # rubocop:disable Metrics/MethodLength
  def handle_send_push(subscription, message)
    attempts = 0

    while attempts < MAX_ATTEMPTS
      begin
        send_push(subscription, message)
        return
      rescue WebPush::ConfigurationError, WebPush::ResponseError, WebPush::InvalidSubscription,
             WebPush::ExpiredSubscription, WebPush::Unauthorized, WebPush::PayloadTooLarge,
             WebPush::TooManyRequests, WebPush::PushServiceError => e
        attempts += 1
        Rails.logger.debug("Webpush not sent. Attempt ##{attempts}. Error: #{e.message}")
      end
    end

    Rails.logger.info("Failure to send message. Disabling WebPush subscription #{subscription.id}.")
    subscription.disable!
  end
  # rubocop:enable Metrics/MethodLength

  def send_push(subscription, message)
    return if subscription.blank?

    Rails.logger.info('Sending webpush notification')
    WebPush.payload_send(
      **build_payload(message, subscription)
    )
  end

  private

  def user_subscriptions(user)
    # This generate a new query to webpush_subscriptions.
    # But this is require to check if user can receive_webpush notifications
    user&.webpush_subscriptions&.enabled
  end

  def build_payload(message, subscription)
    build_message(message)
      .merge(subscription.metadata)
      .merge(vapid_metadata)
  end

  def build_message(message)
    {
      message: JSON.generate(message)
    }
  end

  def vapid_metadata
    {
      vapid: {
        subject: Rails.configuration.x.webpush.contact,
        public_key: Rails.configuration.x.webpush.vapid_public,
        private_key: Rails.configuration.x.webpush.vapid_private
      }
    }
  end
end
