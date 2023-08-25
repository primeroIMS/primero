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

  def manager_approval_response(record_id, approved, approval_type, manager_user_name)
    @child = Child.find_by(id: record_id) || (return log_not_found('Case', record_id))
    @owner = @child.owner || (return log_not_found('User', @child.owned_by))
    return unless assert_notifications_enabled(@owner)

    load_manager_approval_request(approved, approval_type, manager_user_name)
    mail(to: @owner.email,
         subject: t('email_notification.approval_response_subject', id: @child.short_id, locale: @locale_email))
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

  def manager_approval_message
    t('approvals.status.approved', locale: @locale_email)
  end

  def manager_rejected_message
    t('approvals.status.rejected', locale: @locale_email)
  end

  def load_manager_approval_request(approved, approval_type, manager_user_name)
    @manager = User.find_by(user_name: manager_user_name)
    lookup_name = @manager.gbv? ? 'lookup-gbv-approval-types' : 'lookup-approval-type'
    @approval_type = Lookup.display_value(lookup_name, approval_type)
    @locale_email = @owner.locale || I18n.locale
    @approval = approved ? manager_approval_message : manager_rejected_message
  end

  def load_transition_for_email(class_transition, id)
    @transition = class_transition.find_by(id:)
    @locale_email = @transition&.transitioned_to_user&.locale || I18n.locale
  end

  def transition_subject(record)
    t(
      "email_notification.#{@transition.key}_subject",
      record_type: t("forms.record_types.#{record.class.parent_form}", locale: @locale_email),
      id: record.short_id,
      locale: @locale_email
    )
  end
end
