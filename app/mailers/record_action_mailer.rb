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

  def alert_notify(alert_id, user_id)
    load_alert_for_email(alert_id, user_id)
    return unless assert_notifications_enabled(@user)
    return if @user == @record.last_updated_by

    Rails.logger.info("Sending alert notification to #{@user.user_name}")
    mail(to: @user.email, subject: alert_subject(@record))
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

  def load_alert_for_email(alert_id, user_id)
    @alert = Alert.find_by(id: alert_id)
    @record = @alert.record || (return log_not_found('Record', @alert.record_id))
    @user = User.find_by(id: user_id) || (return log_not_found('User', user_id))
    @locale_email = @user.locale || I18n.locale
    @form_section = FormSection.find_by(unique_id: @alert.form_sidebar_id)
    @form_section_name_translated = I18n.with_locale(@locale_email) { @form_section&.name }
    @record_type_translated = t("forms.record_types.#{@record.class.parent_form}", locale: @locale_email)
  end

  def alert_subject(record)
    t(
      'email_notification.alert_subject',
      record_type: @record_type_translated,
      id: record.short_id,
      form_name: @form_section_name_translated,
      locale: @locale_email
    )
  end
end
