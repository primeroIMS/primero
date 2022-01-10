# frozen_string_literal: true

# Class for DeviseMailer
class DeviseMailer < Devise::Mailer
  def reset_password_instructions(record, token, opts = {})
    opts[:subject] = t('user.password_reset.subject', locale: (record&.locale || I18n.locale))
    super
  end
end
