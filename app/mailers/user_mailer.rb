# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Sends out notifications to the email associated with this User.
class UserMailer < ApplicationMailer
  def welcome(user_id, one_time_password = nil)
    load_users!(user_id)
    @email_body = email_body(@user, one_time_password)
    @email_greeting = greeting(@user)
    @subject = subject(@user)
    @locale = @user.locale

    mail(
      to: @user.email,
      subject: @subject
    )
  end

  private

  def subject(user)
    key = user.using_idp? ? 'subject' : 'subject_instructions'
    I18n.t(
      "user.welcome_email.#{key}",
      system: @theme.get('site_title'),
      locale: user.locale
    )
  end

  def greeting(user)
    I18n.t(
      'user.welcome_email.greeting',
      system: @theme.get('site_title'),
      locale: user.locale
    )
  end

  def email_body(user, one_time_password)
    return email_body_native(user) unless user.using_idp?

    if one_time_password
      email_body_otp(user, one_time_password)
    else
      email_body_sso(user)
    end
  end

  def email_body_native(user)
    I18n.t(
      'user.welcome_email.body_native',
      role_name: user.role.name,
      greeting: @theme.t('email_welcome_greeting', user.locale),
      locale: user.locale
    )
  end

  def email_body_sso(user)
    idp_name = user.identity_provider&.name
    prefix = 'user.welcome_email.sso.'

    {
      header: I18n.t("#{prefix}body", role_name: user.role.name, locale: user.locale),
      step1: I18n.t("#{prefix}step1", system: site_path(@theme.get('site_title')),
                                      product_name: @theme.get('product_name'),
                                      identity_provider: idp_name, locale: user.locale),
      step2: I18n.t("#{prefix}step2", product_name: @theme.get('product_name'), host: root_url,
                                      identity_provider: idp_name)
    }
  end

  def email_body_otp(user, one_time_password)
    prefix = 'user.welcome_email.otp.'
    {
      header: I18n.t("#{prefix}body", role_name: user.role.name, locale: user.locale),
      step1: I18n.t("#{prefix}step1", site_title: @theme.get('site_title'), locale: user.locale),
      step2: I18n.t("#{prefix}step2", otp: one_time_password, host: root_url, locale: user.locale)
    }
  end

  def load_users!(user_id)
    @user = User.find(user_id)
  end

  def site_path(name, path = root_url)
    ActionController::Base.helpers.link_to(name, path, style: "color: #{@theme.get('email_link_color')}")
  end
end
