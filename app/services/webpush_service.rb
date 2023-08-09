# frozen_string_literal: true

# Service to send a WebPush Notification
class WebpushService
  def self.send_notifications(user, message)
    WebpushService.new.send_notifications(user, message)
  end

  def send_notifications(user, message)
    subscriptions = user_subscriptions(user)
    return if subscriptions.blank? || message.blank?

    subscriptions.each do |subscription|
      send_push(subscription, message)
    end
  end

  def send_push(subscription, message)
    return if subscription.blank?

    puts 'Sending webpush notification'
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
