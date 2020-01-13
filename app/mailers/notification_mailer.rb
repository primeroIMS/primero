# frozen_string_literal: true

# Sends email notifications for Approval requests and responses,
# Transition notification, and Transfer Requests.
# TODO: Break up into separate mailers.
class NotificationMailer < ApplicationMailer
  helper :application

  def manager_approval_request(user_id, manager_id, record_id, approval_type)
    @user = User.find_by(id: user_id) || (return log_not_found('User', user_id))
    @manager = User.find_by(id: manager_id) || (return log_not_found('Manager user', manager_id))
    @child = Child.find_by(id: record_id) || (return log_not_found('Case', record_id))
    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)
    return log_not_found('Lookup', 'lookup-approval-type') unless @approval_type

    mail(to: @manager.email, subject: t('email_notification.approval_request_subject', id: @child.short_id))
  end

  def manager_approval_response(manager_id, record_id, approval_type, approval, is_gbv)
    @child = Child.find_by(id: record_id) || (return log_not_found('Case', record_id))
    @owner = @child.owner || (return log_not_found('User', @child.owned_by))
    return unless assert_notifications_enabled(@owner)

    @manager = User.find_by(id: manager_id)
    lookup_name = is_gbv ? 'lookup-gbv-approval-types' : 'lookup-approval-type'
    @approval_type = Lookup.display_value(lookup_name, approval_type)
    @approval = approval == 'true' ? t('approvals.status.approved') : t('approvals.status.rejected')

    mail(to: @owner.email, subject: t('email_notification.approval_response_subject', id: @child.short_id))
  end

  def transition_notify(transition_id)
    @transition = Transition.find_by(id: transition_id)
    return log_not_found('Transition', transition_id) unless @transition
    return unless assert_notifications_enabled(@transition&.transitioned_to_user)

    record = @transition&.record
    mail(
      to: @transition&.transitioned_to_user&.email,
      subject: t(
        "email_notification.#{@transition.key}_subject",
        record_type: t("forms.record_types.#{record.class.parent_form}"),
        id: record.short_id
      )
    )
  end

  def transfer_request(transfer_request_id)
    @transition = TransferRequest.find_by(id: transfer_request_id)
    return log_not_found('Transfer Request Transition', transfer_request_id) unless @transition
    return unless assert_notifications_enabled(@transition&.transitioned_to_user)

    mail(
      to: @transition&.transitioned_to_user&.email,
      subject: t('email_notification.transfer_request_subject')
    )
  end

  private

  def log_not_found(type, id)
    Rails.logger.error(
      "Mail not sent. #{type.capitalize} #{id} not found."
    )
  end

  def assert_notifications_enabled(user)
    (user&.email && user&.send_mail) ||
      Rails.logger.info(
        "Mail not sent. Notifications disabled for #{user&.user_name || 'nil user'}"
      )
  end
end
