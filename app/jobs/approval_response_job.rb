class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, record_id, approval_type, approval, host_url, is_gbv)
    NotificationMailer.manager_approval_response(user_id, record_id, approval_type, approval, host_url, is_gbv).deliver
  end
end
