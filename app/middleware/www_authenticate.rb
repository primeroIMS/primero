# frozen_string_literal: true

# Set the WWW-Authenticate header for 401 responses
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
class WwwAuthenticate
  def initialize(app)
    @app = app
  end

  def call(env)
    code, headers, response = @app.call(env)
    headers['WWW-Authenticate'] = 'Bearer realm="Primero" charset="UTF8"' if set_www_authenticate?(code, headers)
    [code, headers, response]
  end

  def set_www_authenticate?(code, headers)
    code == 401 && headers['WWW-Authenticate'].nil?
  end
end
