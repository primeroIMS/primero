# frozen_string_literal: true

require 'digest'
require 'json'

positive_integer = lambda do |name, default|
  value = ENV.fetch(name, default).to_i
  value.positive? ? value : default
end
boolean_type = ActiveModel::Type::Boolean.new

Rack::Attack.throttled_responder = lambda do |request|
  match_data = request.env.fetch('rack.attack.match_data')
  retry_after = match_data[:period] - (match_data[:epoch_time] % match_data[:period])

  if match_data[:count] == match_data[:limit] + 1
    Rails.logger.warn(
      "Rate limit exceeded: throttle=#{request.env.fetch('rack.attack.matched')} " \
      "method=#{request.request_method} path=#{request.path} " \
      "limit=#{match_data[:limit]} period=#{match_data[:period]}"
    )
  end

  body = JSON.generate(
    errors: [
      { status: 429, resource: request.path, message: 'errors.api.too_many_requests' }
    ]
  )

  [
    429,
    {
      'content-type' => 'application/json; charset=utf-8',
      'retry-after' => retry_after.to_s
    },
    [body]
  ]
end

Rack::Attack.throttle(
  'API requests',
  limit: ->(_request) { positive_integer.call('PRIMERO_API_RATE_LIMIT_REQUESTS', 300) },
  period: ->(_request) { positive_integer.call('PRIMERO_API_RATE_LIMIT_PERIOD', 60) }
) do |request|
  enabled = boolean_type.cast(ENV.fetch('PRIMERO_API_RATE_LIMIT_ENABLED', false))
  next unless enabled && request.path.match?(%r{\A/api/v2(?:/|\z)})

  authorization = request.get_header('HTTP_AUTHORIZATION').presence
  session = request.cookies['_app_session'].presence
  identifier = authorization || session || request.remote_ip

  Digest::SHA256.hexdigest(identifier)
end

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

# 6 registrations allowed per ip per minute
Rack::Attack.throttle('Self registration', limit: 6, period: 60) do |request|
  next unless request.path == '/api/v2/self-register' && request.post?

  request.remote_ip
end
