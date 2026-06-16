# frozen_string_literal: true

# Turnstile captcha provider
class CaptchaProviders::Turnstile < CaptchaProviders::Base
  def verify(response, remoteip)
    raise Errors::InvalidCaptcha unless remoteip.present? && response.present?

    res = Faraday.post(challenge_url, { secret:, response:, remoteip: })
    raise Errors::InvalidCaptcha unless JSON.parse(res.body)['success'] == true

    true
  rescue Faraday::ConnectionFailed, Faraday::TimeoutError => e
    raise Errors::CaptchaServiceUnavailable, e.message
  end
end
