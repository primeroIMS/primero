# frozen_string_literal: true

# Service for Notifications
class NotificationService
  include ApplicationHelper

  def self.notify_transition(transition_id)
    NotificationService.new.notify_transition(transition_id)
  end

  def notify_transition(transition_id)
    transition = TransitionNotificationService.new(transition_id).transition
    return unless webpush_notifications_enabled?(transition&.transitioned_to_user)

    WebpushService.send_notifications(transition&.transitioned_to_user, message_structure(transition))
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
