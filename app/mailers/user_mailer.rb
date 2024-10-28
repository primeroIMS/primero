# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Sends out notifications to the email associated with this User.
class UserMailer < ApplicationMailer
  def welcome(user_id, one_time_password = nil)
    load_users!(user_id)
    @email_body = email_body(@user, one_time_password)
    @email_greeting = greeting(@user)
    mail(
      to: @user.email,
      subject: subject(@user)
    )
  end

  private

  def subject(user)
    key = user.using_idp? ? 'subject' : 'subject_instructions'
    I18n.t(
      "user.welcome_email.#{key}",
      system: @theme.site_name,
      locale: user.locale
    )
  end

  def greeting(user)
    I18n.t(
      'user.welcome_email.greeting',
      system: @theme.site_name,
      locale: user.locale
    )
  end

  def email_body(user, one_time_password)
    # return email_body_native(user) unless user.using_idp?

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
      greeting: @theme.email_welcome_greeting[user.locale],
      locale: user.locale
    )
  end

  # rubocop:disable Metrics/AbcSize
  def email_body_sso(user)
    idp_name = user.identity_provider&.name
    prefix = 'user.welcome_email.sso.'
    admin_email = @system_admin&.email ?
      mail_to(@system_admin&.email, I18n.t('email.system_admin'), style: "color: #{@theme.email_link_color}") :
      I18n.t('email.system_admin')

    {
      header: I18n.t("#{prefix}body", role_name: user.role.name, locale: user.locale),
      step1: I18n.t("#{prefix}step1", site_title: @theme.site_title, host: root_url, identity_provider: idp_name, admin_email: admin_email, locale: user.locale),
      step2: '',
      is_otp: true
    }
  end
  # rubocop:enable Metrics/AbcSize

  def email_body_otp(user, one_time_password)
    prefix = 'user.welcome_email.otp.'
    {
      header: I18n.t("#{prefix}body", role_name: user.role.name, locale: user.locale),
      step1: I18n.t("#{prefix}step1", site_title: @theme.site_title, locale: user.locale),
      step2: I18n.t("#{prefix}step2", otp: one_time_password, host: root_url, locale: user.locale),
      is_otp: true
    }
  end

  def load_users!(user_id)
    @user = User.find(user_id)
  end
end
