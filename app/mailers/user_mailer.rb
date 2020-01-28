# frozen_string_literal: true

# Sends out notifications to the email associated with this User.
class UserMailer < ApplicationMailer
  def welcome(user_id, admin_user_id, one_time_password = nil)
    user, admin = load_users!(user_id, admin_user_id)
    @email_body = email_body(user, admin, one_time_password)
    @email_greeting = I18n.t('user.welcome_email.greeting', locale: user.locale)
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
    I18n.t(
      'user.welcome_email.body_sso',
      role_name: user.role.name,
      agency_name: user.agency.name,
      user_name: user.user_name,
      admin_full_name: admin.full_name,
      admin_email: admin.email,
      host: root_url,
      locale: user.locale
    )
  end

  def email_body_otp(user, admin, one_time_password)
    I18n.t(
      'user.welcome_email.body_with_password',
      role_name: user.role.name,
      admin_full_name: admin.full_name,
      admin_email: admin.email,
      otp: one_time_password,
      host: root_url,
      locale: user.locale
    )
  end

  def load_users!(user_id, admin_user_id)
    user = User.find(user_id)
    admin_user = User.find(admin_user_id)
    [user, admin_user]
  end
end
