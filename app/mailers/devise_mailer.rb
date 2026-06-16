# frozen_string_literal: true

# Class for DeviseMailer
class DeviseMailer < Devise::Mailer
  helper :application

  def reset_password_instructions(record, token, opts = {})
    @locale = record&.locale || I18n.locale
    opts[:subject] = t('user.password_reset.subject', locale: record&.locale || I18n.locale)
    super
  end
end
