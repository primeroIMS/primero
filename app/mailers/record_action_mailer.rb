# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Sends email notifications for Approval requests and responses,
# Transition notification, and Transfer Requests.
# TODO: Break up into separate mailers.
class RecordActionMailer < ApplicationMailer
  helper :application

  def manager_approval_request(approval_notification)
    @approval_notification = approval_notification

    return unless @approval_notification.send_notification?
    return unless assert_notifications_enabled(@approval_notification.manager, Approval::NOTIFICATION_ACTIONS_REQUEST)

    mail(to: @approval_notification.manager.email, subject: @approval_notification.subject)
  end

  def manager_approval_response(approval_notification)
    @approval_notification = approval_notification

    return unless @approval_notification.send_notification?
    return unless assert_notifications_enabled(@approval_notification.owner, Approval::NOTIFICATION_ACTIONS_RESPONSE)

    mail(to: @approval_notification.owner.email, subject: @approval_notification.subject)
  end

  def transition_notify(transition_notification)
    @transition_notification = transition_notification

    return if @transition_notification.transition.nil?
    return unless assert_notifications_enabled(
      @transition_notification.transitioned_to, Transition::NOTIFICATION_ACTION
    )

    mail(to: @transition_notification&.transitioned_to&.email, subject: transition_notification.subject)
  end

  def transfer_request(transfer_request_notification)
    @transfer_request_notification = transfer_request_notification

    return if @transfer_request_notification.transition.nil?
    return unless assert_notifications_enabled(
      @transfer_request_notification.transitioned_to, Transfer::NOTIFICATION_ACTION
    )

    mail(to: @transfer_request_notification&.transitioned_to&.email, subject: @transfer_request_notification.subject)
  end

  def alert_notify(alert_notification)
    @alert_notification = alert_notification
    return unless assert_notifications_enabled(@alert_notification.user)
    return if @alert_notification.user == @alert_notification.record.last_updated_by

    Rails.logger.info("Sending alert notification to #{@alert_notification.user.user_name}")

    mail(to: @alert_notification.user.email, subject: @alert_notification.subject, locale: @alert_notification.locale)
  end

  private

  def assert_notifications_enabled(user, action = nil)
    return true if user&.emailable? && (action.nil? || user&.specific_notification?('send_mail', action))

    Rails.logger.info("Mail not sent. Mail notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end
end
