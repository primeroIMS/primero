class MailJob < ActiveJob::Base
  queue_as :mailer

  def perform(user_id, host_url, opts={})
    UserMailer.welcome(user_id, host_url).deliver
  end

end