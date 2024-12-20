# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for DeviseMailer
class DeviseMailer < Devise::Mailer
  def reset_password_instructions(record, token, opts = {})
    @locale = (record&.locale || I18n.locale)
    opts[:subject] = t('user.password_reset.subject', locale: (record&.locale || I18n.locale))
    super
  end
end
