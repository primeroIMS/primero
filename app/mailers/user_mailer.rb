class UserMailer < ApplicationMailer
  def welcome(user_id, host_url)
    @user = User.find_by(id: user_id)
    if @user.present?
      @url = host_url
      @system_settings ||= SystemSettings.current
      mail(
        to: @user.email,
        subject: I18n.t('user.welcome_email.subject', host_url, @user.full_name)
      )
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end
end
