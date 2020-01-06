class MailJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, host_url, opts = {})
    UserMailer.welcome(user_id, host_url).deliver_later
  end

end