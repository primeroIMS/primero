class UserMailer < ActionMailer::Base
  def welcome(user)
    @user = user
    mail(:to => user.email,
         :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
         :subject => "#{user.full_name} - First time Login")
  end
end
