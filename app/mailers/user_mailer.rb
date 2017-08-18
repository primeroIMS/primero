class UserMailer < ActionMailer::Base
  def welcome(user)
    @user = user
    mail(:to => user.email, :from => ENV['mailer.from.address'], :subject => "#{user.full_name} - First time Login")
  end
end
