class ApprovalRequestJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approval_type, manager_id)
    return unless system_settings.notification_email_enabled

    NotificationMailer.manager_approval_request(record_id, approval_type, manager_id).deliver_later
  end
end
