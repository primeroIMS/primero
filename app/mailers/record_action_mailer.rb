# frozen_string_literal: true

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

  def transfer_request(transfer_request_id)
    load_transition_for_email(TransferRequest, transfer_request_id)
    return log_not_found('Transfer Request Transition', transfer_request_id) unless @transition
    return unless assert_notifications_enabled(@transition&.transitioned_to_user)

    mail(
      to: @transition&.transitioned_to_user&.email,
      subject: t('email_notification.transfer_request_subject'),
      locale: @locale_email
    )
  end

  def alert_notify(alert_notification)
    @alert_notification = alert_notification
    @user = @alert_notification.user
    @locale_email = @alert_notification.locale
    @record = @alert_notification.record
    return unless assert_notifications_enabled(@alert_notification.user)
    return if @alert_notification.user == @alert_notification.record.last_updated_by

    Rails.logger.info("Sending alert notification to #{@user.user_name}")

    mail(to: @user.email, subject: @alert_notification.subject, locale: @locale_email)
  end

  private

  def log_not_found(type, id)
    Rails.logger.error(
      "Mail not sent. #{type.capitalize} #{id} not found."
    )
  end

  def assert_notifications_enabled(user)
    return true if user&.emailable?

    Rails.logger.info("Mail not sent. Mail notifications disabled for #{user&.user_name || 'nil user'}")

    false
  end

  def load_transition_for_email(class_transition, id)
    @transition = class_transition.find_by(id:)
    @locale_email = @transition&.transitioned_to_user&.locale || I18n.locale
  end
end
