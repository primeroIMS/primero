# frozen_string_literal: true

# Sends out notifications to the email associated with this User.
class UserMailer < ApplicationMailer
  def welcome(user_id, admin_user_id, one_time_password = nil)
    user, admin = load_users!(user_id, admin_user_id)
    @email_body = email_body(user, admin, one_time_password)
    @email_greeting = greeting(user)
    mail(
      to: user.email,
      subject: subject(user)
    )
  end

  private

  def subject(user)
    I18n.t(
      'user.welcome_email.subject',
      system: SystemSettings.current.system_name,
      locale: user.locale
    )
  end

  def greeting(user)
    I18n.t(
      'user.welcome_email.greeting',
      system: SystemSettings.current.system_name,
      locale: user.locale
    )
  end

  def email_body(user, admin, one_time_password)
    return email_body_native(user, admin) unless user.using_idp?

    if one_time_password
      email_body_otp(user, admin, one_time_password)
    else
      email_body_sso(user, admin)
    end
  end

  def email_body_native(user, admin)
    I18n.t(
      'user.welcome_email.body_native',
      role_name: user.role.name,
      admin_full_name: admin.full_name,
      admin_email: admin.email,
      host: root_url,
      locale: user.locale
    )
  end

  def email_body_sso(user, admin)
    idp_name = user.identity_provider&.name
    {
      header: I18n.t('user.welcome_email.sso.body', role_name: user.role.name, locale: user.locale),
      step1: I18n.t('user.welcome_email.sso.step1', host: root_url, identity_provider: idp_name, locale: user.locale),
      step2: I18n.t('user.welcome_email.sso.step2', identity_provider: idp_name, user_name: user.user_name, locale: user.locale),
      step3: I18n.t('user.welcome_email.sso.step3', identity_provider: idp_name, locale: user.locale),
      step4: '',
      footer: I18n.t('user.welcome_email.sso.footer', admin_full_name: admin.full_name, admin_email: admin.email, locale: user.locale)
    }
  end

  def email_body_otp(user, admin, one_time_password)
    {
      header: I18n.t('user.welcome_email.otp.body', role_name: user.role.name, locale: user.locale),
      step1: I18n.t('user.welcome_email.otp.step1', admin_full_name: admin.full_name, admin_email: admin.email, locale: user.locale),
      step2: I18n.t('user.welcome_email.otp.step2', host: root_url, locale: user.locale),
      step3: I18n.t('user.welcome_email.otp.step3', otp: one_time_password, locale: user.locale),
      step4: I18n.t('user.welcome_email.otp.step4', locale: user.locale),
      footer: ''
    }
  end

  def load_users!(user_id, admin_user_id)
    user = User.find(user_id)
    admin_user = User.find(admin_user_id)
    [user, admin_user]
  end
end
