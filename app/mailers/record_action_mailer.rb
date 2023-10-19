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
    return unless assert_notifications_enabled(@approval_notification.manager)

    mail(to: @approval_notification.manager.email, subject: @approval_notification.subject)
  end

  def manager_approval_response(approval_notification)
    @approval_notification = approval_notification

    return unless @approval_notification.send_notification?
    return unless assert_notifications_enabled(@approval_notification.owner)

    mail(to: @approval_notification.owner.email, subject: @approval_notification.subject)
  end

  def transition_notify(transition_notification)
    @transition_notification = transition_notification

    return if @transition_notification.transition.nil?
    return unless assert_notifications_enabled(@transition_notification.transitioned_to)

    mail(to: @transition_notification&.transitioned_to&.email, subject: transition_notification.subject)
  end

  def transfer_request(transfer_request_notification)
    @transfer_request_notification = transfer_request_notification

    return if @transfer_request_notification.transition.nil?
    return unless assert_notifications_enabled(@transfer_request_notification.transitioned_to)

    mail(to: @transfer_request_notification&.transitioned_to&.email, subject: @transfer_request_notification.subject)
  end

  private

  def assert_notifications_enabled(user)
    return true if user&.emailable?

    Rails.logger.info("Mail not sent. Mail notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end
end
