# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Base class for captcha providers
class CaptchaProviders::Base
  def challenge_url
    Rails.application.config.captcha['challenge_url']
  end

  def secret
    Rails.application.config.captcha['secret_key']
  end

  def verify(_token, _ip)
    raise NotImplementedError
  end
end
