# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'mail_checker'

# Utility to verify captchas using different providers
class Captcha
  PROVIDERS = {
    'turnstile' => CaptchaProviders::Turnstile.new
  }.freeze

  def self.verifiy_email(email)
    return if MailChecker.valid?(email)

    raise Errors::InvalidEmail, email
  end

  def self.verify(provider:, token:, remote_ip:, email:)
    verifiy_email(email)

    return true unless PROVIDERS[provider].present?

    PROVIDERS[provider]&.verify(token, remote_ip) || false
  end
end
