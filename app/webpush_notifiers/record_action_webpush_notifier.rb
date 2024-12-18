# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# WebpushNotifier class for RecordActions
class RecordActionWebpushNotifier
  include ApplicationHelper

  def self.transition_notify(transition_notification)
    RecordActionWebpushNotifier.new.transition_notify(transition_notification)
  end

  def self.manager_approval_request(approval_notification)
    RecordActionWebpushNotifier.new.manager_approval_request(approval_notification)
  end

  def self.manager_approval_response(approval_notification)
    RecordActionWebpushNotifier.new.manager_approval_response(approval_notification)
  end

  def self.alert_notify(alert_notification)
    RecordActionWebpushNotifier.new.alert_notify(alert_notification)
  end

  def self.transfer_request(transfer_request_notification)
    RecordActionWebpushNotifier.new.transfer_request(transfer_request_notification)
  end

  def transition_notify(transition_notification)
    return if transition_notification.transition.nil?
    return unless webpush_notifications_enabled?(
      transition_notification&.transitioned_to, Transition::NOTIFICATION_ACTION
    )

    WebpushService.send_notifications(
      transition_notification&.transitioned_to,
      message_structure(transition_notification.transition)
    )
  end

  def manager_approval_request(approval_notification)
    return unless approval_notification.send_notification?
    return unless webpush_notifications_enabled?(approval_notification.manager, Approval::NOTIFICATION_ACTIONS_REQUEST)

    WebpushService.send_notifications(
      approval_notification.manager,
      message_structure(approval_notification).merge(
        body: I18n.t(
          "webpush_notification.#{approval_notification.key}.body", type: approval_notification&.approval_type
        )
      )
    )
  end

  def manager_approval_response(approval_notification)
    return unless approval_notification.send_notification?
    return unless webpush_notifications_enabled?(approval_notification.owner, Approval::NOTIFICATION_ACTIONS_RESPONSE)

    WebpushService.send_notifications(
      approval_notification.owner,
      message_structure(approval_notification)
    )
  end

  def transfer_request(transfer_request_notification)
    return if transfer_request_notification.transition.nil?
    return unless webpush_notifications_enabled?(
      transfer_request_notification&.transitioned_to, Transfer::NOTIFICATION_ACTION
    )

    WebpushService.send_notifications(
      transfer_request_notification&.transitioned_to,
      message_structure(transfer_request_notification.transition)
    )
  end

  def alert_notify(alert_notification)
    return unless alert_notification.send_notification?
    return unless webpush_notifications_enabled?(alert_notification.user)

    WebpushService.send_notifications(
      alert_notification.user,
      message_structure(alert_notification)
    )
  end

  def icon
    Rails.application.routes.url_helpers.rails_blob_path(Theme.current.logo_pictorial_144, only_path: true).to_s
  rescue ActionController::UrlGenerationError
    ''
  end

  def message_structure(record_action_notification)
    {
      title: I18n.t("webpush_notification.#{record_action_notification.key}.title"),
      body: I18n.t(
        "webpush_notification.#{record_action_notification.key}.body",
        type: record_action_notification&.type
      ),
      action_label: I18n.t('webpush_notification.action_label'),
      icon:,
      link: url_for_v2(record_action_notification.record)
    }
  end

  private

  def webpush_notifications_enabled?(user, action = nil)
    web_push_enabled? && user_web_push_enabled?(user, action)
  end

  def user_web_push_enabled?(user, action)
    return true if user&.receive_webpush? && (action.nil? || user&.specific_notification?('receive_webpush', action))

    Rails.logger.info("Webpush not sent. Webpush notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end

  def web_push_enabled?
    return true if Rails.configuration.x.webpush.enabled

    Rails.logger.info('Webpush notification disabled!!!')

    false
  end

  def root_url
    "#{host_url}/"
  end
end
