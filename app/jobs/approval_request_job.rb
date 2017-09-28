class ApprovalRequestJob < ActiveJob::Base
  queue_as :mailer

  def perform(user_id, case_id, approval_type)
    NotificationMailer.manager_approval_request(user_id, case_id, approval_type).deliver
  end
end