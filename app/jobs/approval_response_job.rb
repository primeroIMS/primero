class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, case_id, approval_type, approval, host_url)
    NotificationMailer.manager_approval_response(user_id, case_id, approval_type, approval, host_url).deliver_later
  end
end