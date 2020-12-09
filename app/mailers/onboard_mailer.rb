# frozen_string_literal: true

# Sends out a welcome email to an onboard admin
class OnboardMailer < ApplicationMailer
  def onboard(user_id)
    @user = User.find(user_id)
    mail(
      to: @user.email,
      subject: I18n.t('user.onboard_email.subject', system: SystemSettings.current.system_name, locale: @user.locale)
    )
  end
end
