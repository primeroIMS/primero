# frozen_string_literal: true

# WebpushNotifier class for RecordActions
class RecordActionWebpushNotifier
  include ApplicationHelper

  def self.transition_notify(transition_notification)
    RecordActionWebpushNotifier.new.transition_notify(transition_notification)
  end

  def transition_notify(transition_notification)
    return if transition_notification.transition.nil?
    return unless webpush_notifications_enabled?(transition_notification&.transitioned_to)

    WebpushService.send_notifications(
      transition_notification&.transitioned_to,
      message_structure(transition_notification.transition)
    )
  end

  def message_structure(transition)
    {
      title: I18n.t("webpush_notification.#{transition.key}.title"),
      body: I18n.t("webpush_notification.#{transition.key}.body"),
      action_label: I18n.t('webpush_notification.action_label'),
      link: url_for_v2(transition.record)
    }
  end

  private

  def webpush_notifications_enabled?(user)
    return true if user&.receive_webpush?

    Rails.logger.info("Webpush not sent. Webpush notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end

  def root_url
    "#{host_url}/"
  end
end
