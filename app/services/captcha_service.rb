# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'mail_checker'

# Utility to verify captchas using different providers
class CaptchaService
  PROVIDERS = {
    'turnstile' => CaptchaProviders::Turnstile.new
  }.freeze

  def self.verify(provider:, token:, remote_ip:)
    return true unless PROVIDERS[provider].present?

    PROVIDERS[provider]&.verify(token, remote_ip) || false
  end
end
