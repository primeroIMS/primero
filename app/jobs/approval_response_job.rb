class ApprovalResponseJob < ActiveJob::Base
  queue_as :mailer

  def perform(user_id, case_id, approval_type, approval)
    NotificationMailer.manager_approval_response(user_id, case_id, approval_type, approval).deliver
  end
end