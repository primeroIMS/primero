# frozen_string_literal: true

# This middleware ensures that the HTTP_AUTHORIZATION header is always set with a Bearer token
# if a JWT token is specified in a cookie. This makes it compatible with the devise-jwt library that
# only looks at the bearer token to verify authentication.
class JwtTokenSetter
  def initialize(app)
    @app = app
  end

  def call(env)
    unless env['HTTP_AUTHORIZATION'].present?
      request = Rack::Request.new(env)
      token = request.cookies['primero_token']
      env['HTTP_AUTHORIZATION'] = "Bearer #{token}" if token.present?
    end

    @app.call(env)
  end
end
