class UserMailer < ActionMailer::Base
  def welcome(user_id, host_url)
    @user = User.get(user_id)
    if @user.present?
      @url = host_url
      mail(:to => @user.email,
           :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
           :subject => "#{@user.full_name} - First time Login")
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end
end
