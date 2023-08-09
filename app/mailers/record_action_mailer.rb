# frozen_string_literal: true

# Sends email notifications for RecordAction: Approval requests and responses,
# Transition notification, and Transfer Requests.
class RecordActionMailer < ApplicationMailer
  helper :application

  def transition_notify(transition_notification)
    @transition_notification = transition_notification

    return if @transition_notification.transition.nil?
    return unless assert_notifications_enabled(@transition_notification.transitioned_to)

    mail(to: @transition_notification&.transitioned_to&.email, subject: transition_notification.subject)
  end

  private

  def assert_notifications_enabled(user)
    return true if user&.emailable?

    Rails.logger.info("Mail not sent. Mail notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end
end
