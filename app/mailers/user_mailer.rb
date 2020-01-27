# frozen_string_literal: true

# Sends out notifications to the email associated with this User.
class UserMailer < ApplicationMailer

  def welcome(user_id, admin_user_id, one_time_password = nil)
    user, admin = load_users!(user_id, admin_user_id)
    @email_body = email_body(user, admin, one_time_password)
    @email_greeting = I18n.t('user.welcome_email.greeting')

    mail(
      to: user.email,
      subject: I18n.t('user.welcome_email.subject', SystemSettings.current.system_name)
    )
  end

  private

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
      host: '' # TODO!
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
      host: '' # TODO!
    )
  end

  def email_body_otp(user, admin, one_time_password)
    I18n.t(
      'user.welcome_email.body_with_password',
      role_name: user.role.name,
      admin_full_name: admin.full_name,
      admin_email: admin.email,
      otp: one_time_password,
      host: '' # TODO!
    )
  end

  def load_users!(user_id, admin_user_id)
    user = User.find(id: user_id)
    send_to_user_allowed!(admin_user_id)
    admin_user = User.find(id: admin_user_id)
    [user, admin_user]
  end
end
