# frozen_string_literal: true

# Model for Webpush Subscription
class WebpushSubscription < ApplicationRecord
  validates :notification_url, presence: { message: 'errors.models.webpush_subscription.notification_url_present' },
                               format: {
                                 with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                                 message: 'errors.models.webpush_subscription.notification_url_format'
                               }
  validates :auth, presence: { message: 'errors.models.webpush_subscription.auth_present' }
  validates :p256dh, presence: { message: 'errors.models.webpush_subscription.p256dh_present' }

  belongs_to :user

  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }

  def auth
    EncryptionService.decrypt(super)
  end

  def auth=(auth_value)
    super(EncryptionService.encrypt(auth_value))
  end

  def p256dh
    EncryptionService.decrypt(super)
  end

  def p256dh=(p256dh_value)
    super(EncryptionService.encrypt(p256dh_value))
  end

  def metadata
    {
      endpoint: notification_url,
      p256dh:,
      auth:
    }
  end

  def expired?
    (Time.now - (Rails.application.config.x.webpush.pause_after || 0).minutes) >= updated_at
  end

  def disable!
    update(disabled: true)
  end

  class << self
    def permitted_api_params
      %i[disabled notification_url auth p256dh]
    end

    def list(user, params = {})
      subscriptions = user.webpush_subscriptions
      return subscriptions.where(notification_url: params[:notification_url]) if params[:notification_url].present?

      subscriptions.enabled
    end

    def current(user, params)
      subscription = user&.webpush_subscriptions
          &.find_by(notification_url: params[:notification_url])
      raise ActiveRecord::RecordNotFound if subscription&.disabled

      subscription
    end

    def current_or_new_with_user(user, params)
      webpush_subscription = WebpushSubscription.current(user, params)
      webpush_subscription = WebpushSubscription.new(params) if webpush_subscription.blank?
      webpush_subscription.user ||= user
      webpush_subscription.updated_at = DateTime.now

      webpush_subscription
    end
  end
end
