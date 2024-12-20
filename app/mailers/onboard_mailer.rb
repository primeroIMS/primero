# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Sends out a welcome email to an onboard admin
class OnboardMailer < ApplicationMailer
  def onboard(user_id)
    @user = User.find(user_id)
    @subject = I18n.t('user.onboard_email.subject', system: @theme.get('site_title'), locale: @user.locale)
    @locale = @user.locale

    mail(
      to: @user.email,
      subject: @subject
    )
  end
end
