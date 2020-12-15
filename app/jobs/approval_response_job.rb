# frozen_string_literal: true

# Job to send an email when an approval response has been granted
class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approved, approval_type, approved_by)
    NotificationMailer.manager_approval_response(record_id, approved, approval_type, approved_by).deliver_now
  end
end
