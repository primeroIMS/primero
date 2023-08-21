# frozen_string_literal: true

# Job to send out emails for requests for approval
class ApprovalRequestJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approval_type, manager_id)
    approval_notification = ApprovalNotificationService.new(record_id, approval_type, manager_id)
    RecordActionMailer.manager_approval_request(approval_notification).deliver_now
    RecordActionWebpushNotifier.manager_approval_request(approval_notification)
  end
end
