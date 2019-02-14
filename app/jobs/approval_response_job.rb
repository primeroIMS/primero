class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, case_id, approval_type, approval, host_url, is_gbv)
    NotificationMailer.manager_approval_response(user_id, case_id, approval_type, approval, host_url, is_gbv).deliver
  end
end
