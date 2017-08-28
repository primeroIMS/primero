class UserMailer < ActionMailer::Base
  def welcome(user_id)
    @user = User.get(user_id)
    if @user.present?
      mail(:to => @user.email,
           :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
           :subject => "#{@user.full_name} - First time Login")
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end
end
