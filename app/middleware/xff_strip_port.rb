# frozen_string_literal: true

# Middleware to remove the port from the header X-Forwarded-For.
# Ensures that the reverse proxy is correctly setting the origin IP.
# Azure Gateways set the header X-Forwarded-For to the format IP:PORT
# which isn't handled by the ActionDispatch::RemoteIp middleware.
class XffStripPort
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['HTTP_X_FORWARDED_FOR']
      env['HTTP_X_FORWARDED_FOR'] =
        env['HTTP_X_FORWARDED_FOR']
        .split(',')
        .map { |x| x.strip.sub(/:\d+$/, '') }
        .join(', ')
    end

    @app.call(env)
  end
end
