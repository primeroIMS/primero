class MailJob < ActiveJob::Base
  queue_as :mail_sender

  def perform(user_id, opts={})
    UserMailer.welcome(user_id).deliver
  end

end