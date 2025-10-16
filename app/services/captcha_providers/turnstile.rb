# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Turnstile captcha provider
class CaptchaProviders::Turnstile < CaptchaProviders::Base
  def verify(response, remoteip)
    res = Faraday.post(challenge_url, { secret:, response:, remoteip: })

    raise Errors::InvalidCaptcha unless JSON.parse(res.body)['success'] == true

    true
  end
end
