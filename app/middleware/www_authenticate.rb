# frozen_string_literal: true

# Set the WWW-Authenticate header for 401 responses
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
class WwwAuthenticate
  def initialize(app)
    @app = app
  end

  def call(env)
    code, headers, response = @app.call(env)
    headers['WWW-Authenticate'] = 'Bearer realm="Primero" charset="UTF8"' if apply_www_authenticate?(code)
    [code, headers, response]
  end

  def apply_www_authenticate?(code)
    # TODO: We can be more nuanced and return a Basic header if we failed a Basic Auth strategy
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
    code == 401
  end
end
