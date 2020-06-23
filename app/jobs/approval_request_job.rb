# frozen_string_literal: true

# Job to send out emails for requests for approval
class ApprovalRequestJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approval_type, manager_id)
    return unless SystemSettings.current.notification_email_enabled

    NotificationMailer.manager_approval_request(record_id, approval_type, manager_id).deliver_now
  end
end
