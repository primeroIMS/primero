# frozen_string_literal: true

# Base class for captcha providers
class CaptchaProviders::Base
  def challenge_url
    Rails.application.config.x.captcha[:challenge_url]
  end

  def secret
    Rails.application.config.x.captcha[:secret_key]
  end

  def verify(_token, _ip)
    raise NotImplementedError
  end
end
