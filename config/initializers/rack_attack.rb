# frozen_string_literal: true

# This will return HTTP 429 once the rate limit is exceeded

# 6 login attempts per user name per minute
Rack::Attack.throttle('Login attempts', limit: 6, period: 60) do |request|
  next unless request.path == '/api/v2/tokens' && request.post?

  params = ActionDispatch::Request.new(request.env).params
  params.dig('user', 'user_name')&.to_s&.downcase&.gsub(/\s+/, '')
end

# 6 password reset requests allowed per minute, per email address
Rack::Attack.throttle('Password reset requests', limit: 6, period: 60) do |request|
  next unless request.path == '/api/v2/users/password-reset-request' && request.post?

  params = ActionDispatch::Request.new(request.env).params
  params.dig('user', 'email')&.to_s&.downcase&.gsub(/\s+/, '')
end

# 10 password resets allowed per minute.
# Note: This may be crude ans insufficient for large scale systems,
#       but those systems should be using external identity anyway.
Rack::Attack.throttle('Password resets', limit: 10, period: 60) do |request|
  next unless request.path == '/api/v2/users/password-reset' && request.post?

  'throttle-always'
end
