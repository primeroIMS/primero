class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approved, approval_type, approved_by)
    NotificationMailer.manager_approval_response(record_id, approved, approval_type, approved_by).deliver
  end
end
